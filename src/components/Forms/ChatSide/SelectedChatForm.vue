<script setup lang="ts">
import { useMessagesStore } from '@/stores/message.store.ts'
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { Profile } from '@/types/profile/profile.model.ts'
import { useProfileStore } from '@/stores/profile.store.ts'
import Skeleton from '@/components/UI/Skeleton.vue'
import { useOnlineStore } from '@/stores/online.store.ts'
import { useBlockStore } from '@/stores/block.store.ts'
import { formatTimeOnly, timeAgo } from '@/utils/DateFormat.ts'
import { useChatsStore } from '@/stores/chats.store.ts'
import type { MsgCreateRequest } from '@/types/chat/dto/message.dto.ts'

const messagesStore = useMessagesStore()
const { activeChat } = storeToRefs(messagesStore)
const { FetchMessages, SendMessage, SelectChat } = messagesStore
const chatStore = useChatsStore()
const { CreatePrivate } = chatStore
const profileStore = useProfileStore()
const { me } = storeToRefs(profileStore)
const { FetchProfile } = profileStore
const onlineStore = useOnlineStore()
const { isUserOnline, userLastSeen } = storeToRefs(onlineStore)
const { fetchProfileOnline } = onlineStore
const blockStore = useBlockStore()
const { isBlockedMeBy } = storeToRefs(blockStore)
const { CheckIfBlockedMe } = blockStore

// ? REFS
const messageInput = ref<string>('')
const forceUpdate = ref(0)
const avatarLoading = ref(true)
const profile = ref<Profile | null>(null)
const isPageLoading = ref<boolean>(true)
let intervalId: number | null = null

const computeStatus = computed(() => {
  if (!profile.value!.Settings.show_online_status) return 'был(а) недавно'
  if (isUserOnline.value(profile.value!.id)) return 'в сети'

  const lastSeenDate = userLastSeen.value(profile.value!.id)
  if (!lastSeenDate) return 'был(а) недавно'

  forceUpdate.value // forceUpdate будет заставлять пересчитать время
  return 'был(а) ' + timeAgo(userLastSeen.value(profile.value!.id)!)
})
const loadChat = async () => {
  let splited = activeChat.value.id.split(':')
  if (splited.length > 1 && splited[1]) {
    // пустой чат
    profile.value = await FetchProfile(splited[1])

    if (isBlockedMeBy.value(profile.value!.id)) {
      avatarLoading.value = false
    }
  } else {
    // чат есть
    await FetchMessages(activeChat.value.id)
    let profile_id = activeChat.value.messages.find((m) => m.user_id !== me.value!.id)
    console.log(activeChat.value.messages)
    // profile.value = await FetchProfile(profile_id)
  }
}

const sendMessage = async () => {
  const req: MsgCreateRequest = {
    content: messageInput.value,
    type: 'text',
    reply_to_message: null,
  }
  if (activeChat.value.id.split(':').length > 1) {
    let chat = await CreatePrivate(profile.value!.id)
    SelectChat(chat!.id)
    await SendMessage(chat!.id, req)
  } else {
    await SendMessage(activeChat.value.id, req)
  }
}

onMounted(async () => {
  await loadChat()

  if (profile.value && profile.value.id) {
    await CheckIfBlockedMe(profile.value.id)
    await fetchProfileOnline(profile.value.id)
  }
  isPageLoading.value = false
  if (activeChat.value.id && isBlockedMeBy.value(profile.value!.id)) {
    avatarLoading.value = false
  }

  intervalId = setInterval(() => {
    forceUpdate.value++
  }, 60000) // каждые 60с
})
onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<template>
  <Skeleton v-if="isPageLoading" width="100%" height="100%" border-radius="16px" />
  <div v-else class="active-chat">
    <div class="profile-element">
      <div class="avatar">
        <Skeleton
          v-if="avatarLoading"
          class="img-avatar"
          border-radius="99px"
          style="opacity: 0.6"
        />
        <div v-if="isBlockedMeBy(profile!.id)" class="img-avatar blocked">
          {{ profile!.full_name[0] ? profile!.full_name[0].toUpperCase() : 'Н' }}
        </div>
        <img
          v-else
          @load="avatarLoading = false"
          class="img-avatar"
          :src="`/img/avatars/${profile!.avatar_url}`"
          alt="avatar"
        />

        <div
          class="online-status"
          :class="{ active: isUserOnline(profile!.id) && !isBlockedMeBy(profile!.id) }"
        ></div>
      </div>
      <div class="profile-data">
        <p class="full_name">{{ profile!.full_name }}</p>
        <p class="status" v-if="isBlockedMeBy(profile!.id)">Доступ ограничен</p>
        <p class="status" v-else-if="me!.id === profile!.id">@{{ profile!.username }}</p>
        <p class="status" v-else>{{ computeStatus }}</p>
      </div>
      <div class="buttons">
        <div class="action-btn">
          <img src="/icons/search.svg" alt="search" />
        </div>
        <div class="action-btn">
          <img src="/icons/menu-dot.svg" alt="search" />
        </div>
      </div>
    </div>
    <div v-if="activeChat.messages.length > 0" class="messages-list">
      <div v-for="m in activeChat.messages" class="message-item" :class="{me: m.user_id === me!.id}">
        <p class="message-time" v-if="m.user_id === me!.id">{{ formatTimeOnly(m.created_at) }}</p>
        <p class="message-content">{{ m.content }}</p>
        <p class="message-time" v-if="m.user_id !== me!.id">{{ formatTimeOnly(m.created_at) }}</p>
      </div>
    </div>
    <div v-else class="empty-messages">
      <img src="/img/animated-hello-gif.gif" alt="greeting" />
      <p>Начните общение прямо сейчас</p>
    </div>
    <div class="input-fields">
      <div class="icon-btn">
        <img src="/icons/add.svg" alt="add" />
      </div>
      <div id="message-input" class="message-input" :class="{ active: messageInput }">
        <input
          type="text"
          id="chat-message-input"
          autocomplete="off"
          v-model="messageInput"
          placeholder="Введите сообщение"
        />
      </div>
      <div class="icon-btn">
        <img src="/icons/emoji-outline.svg" alt="emoji" />
      </div>
      <div
        class="icon-btn send-message-btn"
        :class="{ disabled: !messageInput }"
        @click="sendMessage"
      >
        <img src="/icons/send-filled-white.svg" alt="send" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.active-chat {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  height: 100%;

  background: $white-primary;
  border-radius: 16px;
  border: 1px solid rgba($black-primary, 0.1);
  padding: 12px 24px 24px 24px;

  & > .profile-element {
    display: flex;
    align-items: center;
    gap: 12px;

    width: 100%;
    padding: 12px 0;
    background: $white-primary;

    & > .avatar {
      position: relative;

      & > .img-avatar {
        max-width: 44px;
        width: 44px !important;
        height: 44px !important;
        border-radius: 99px;

        &.blocked {
          @include h5-text;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          background: $gray-primary;
          color: rgba($black-primary, 0.3);
        }
      }

      & > .online-status {
        position: absolute;
        right: 2px;
        bottom: 2px;

        width: 4px;
        height: 4px;
        opacity: 0;

        background: $blue-color;

        border-radius: 99px;
        border: 2px solid $white-primary;

        &.active {
          width: 12px;
          height: 12px;
          opacity: 1;
        }
      }
    }
    & > .profile-data {
      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 100%;

      & > .full_name {
        @include button-text;
        line-height: 100%;
        width: 90%;
      }
      & > .status {
        @include tag-text;
        line-height: 120%;
        opacity: 0.6;
      }
    }
    & > .buttons {
      display: flex;
      align-items: center;

      & > .action-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        width: 42px;
        height: 42px;
        background: transparent;
        border-radius: 100%;

        cursor: pointer;

        &:hover {
          background: $gray-primary;
        }

        & > img {
          opacity: 0.6;
        }
      }
    }
  }
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 12px;

  width: 100%;
  height: 100%;

  & > .message-item {
    display: flex;
    align-items: end;
    justify-content: start;

    width: 100%;
    gap: 6px;

    & > .message-content {
      @include input-text;

      padding: 8px 16px;
      border-radius: 16px 16px 16px 0;
      background: $gray-primary;
      color: $black-primary;
      max-width: 340px;
    }
    & > .message-time {
      @include tag-text;
      opacity: 0.6;
    }

    &.me {
      justify-content: end;
      & > .message-content {
        color: $white-primary;
        background: $blue-color;
        border-radius: 16px 16px 0 16px;
      }
    }
  }
}
.input-fields {
  display: flex;
  align-items: center;
  gap: 10px;

  width: 100%;

  & > .icon-btn {
    @include gray-icon-btn;

    &.send-message-btn {
      background: $black-primary !important;
      border: none !important;

      &.disabled {
        opacity: 0.2;
      }
      & > img {
        opacity: 1;
      }
    }
  }
  & > #message-input {
    @include gray-fill-input;
  }
}

.empty-messages {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 20px;

  & > img {
    width: 68px;
    height: 68px;
  }

  & > p {
    @include tag-text;
    opacity: 0.6;
    text-align: center;
  }
}
</style>
