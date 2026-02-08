<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useProfileStore } from '@/stores/profile.store.ts'
import { useOnlineStore } from '@/stores/online.store.ts'
import { useBlockStore } from '@/stores/block.store.ts'
import { formatTimeOnly, timeAgo } from '@/utils/DateFormat.ts'
import { useChatStore } from '@/stores/chats.store.ts'
import type { Profile } from '@/types/profile/profile.model.ts'
import { useNotification } from '@/composables/useNotifications.ts'
import type { MsgCreateRequest } from '@/types/chat/dto/message.dto.ts'

const { infoNotification } = useNotification()

const profileStore = useProfileStore()
const { me, error: profileError } = storeToRefs(profileStore)
const { FetchProfile } = profileStore

const onlineStore = useOnlineStore()
const { isUserOnline, userLastSeen } = storeToRefs(onlineStore)
const blockStore = useBlockStore()
const { isBlockedMeBy } = storeToRefs(blockStore)

const chatStore = useChatStore()
const { activeChat, activeChatId, isLoading: chatLoading, error: chatError } = storeToRefs(chatStore)

// ? REFS
const profile = ref<Profile | null>(null)
const messageInput = ref<string>('')
const forceUpdate = ref(0)
const aChat = ref<HTMLElement | null>(null)
let intervalId: number | null = null

// ? FUNCTIONS
const chatAvatar = computed(() => {
  if (activeChat.value) {
    if (activeChat.value.type === 'private' && profile.value) {
      return "/img/avatars/" + profile.value.avatar_url
    }
    return "/img/avatars/" + activeChat.value.avatar_url || '/img/avatars/avatar-violet.png'
  }
  return '/img/avatars/avatar-violet.png'
})
const computeStatus = computed(() => {
  if (activeChat.value) {
    if (activeChat.value.type !== 'private')
      return activeChat.value.participants.length + ' участников'
    if (isBlockedMeBy.value(profile.value!.id)) return 'был(а) давно'
    if (!profile.value!.Settings.show_online_status) return 'был(а) недавно'

    if (isUserOnline.value(profile.value!.id)) return 'в сети'

    const lastSeenDate = userLastSeen.value(profile.value!.id)
    if (!lastSeenDate) return 'был(а) недавно'

    forceUpdate.value // forceUpdate будет заставлять пересчитать время
    return 'был(а) ' + timeAgo(userLastSeen.value(profile.value!.id)!)
  } else return 'чат не выбран'
})
const closeChat = () => {
  if (aChat.value) {
    aChat.value.style.padding = "12px 30px 24px 30px"
    aChat.value.style.opacity = "0"
  }
  setTimeout(() => {
    chatStore.clearActiveChat()
  }, 50)
}

const sendMessage = async () => {
  if (messageInput.value.trim().length > 0) {
    const msg: MsgCreateRequest = {
      content: messageInput.value,
      type: 'text',
      reply_to_message: null
    }

    await chatStore.SendMessage(activeChatId.value, msg)

    if (chatError.value) {
      infoNotification("🚫 Сообщение не отправлено: " + chatError.value)
      return
    }
    messageInput.value = ''
  }
}

watch(activeChatId, async () => {
  if (activeChat.value && activeChat.value.type === 'private') {
    const interlocutor = activeChat.value.participants.find(p => p.user_id !== me.value!.id)
    if (interlocutor) {
      profile.value = await FetchProfile(interlocutor.user_id)

      if (profileError.value) {
        infoNotification("🚫 Ошибка загрузки пользователя: " + profileError.value)
      } else if (profile.value) {
        setTimeout(() => {
          aChat.value = document.getElementById("active-chat")
          if (aChat.value) {
            aChat.value.style.padding = "12px 24px 24px 24px"
            aChat.value.style.opacity = "1"
          }
        }, 1)
      }
    }
  }
})
onMounted(async () => {
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
  <div v-if="activeChat && profile" id="active-chat">
    <div class="profile-element">
      <img class="close-chat" @click="closeChat" src="/icons/arrow.svg" alt="arrow">
      <div class="avatar" @click="profileStore.setActiveProfile(profile)">
        <div v-if="isBlockedMeBy(profile.id)" class="img-avatar blocked">
          {{ profile.full_name[0] ? profile.full_name[0].toUpperCase() : 'Н' }}
        </div>
        <img v-else class="img-avatar" :src="chatAvatar" alt="avatar" />
      </div>
      <div class="profile-data">
        <p class="full_name" @click="profileStore.setActiveProfile(profile)">{{ profile.full_name }}</p>
        <p class="status">{{ computeStatus }}</p>
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
      <div
        v-for="m in activeChat.messages"
        class="message-item"
        :class="{ me: m.user_id === me!.id }"
      >
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
          @keyup.enter="sendMessage"
        />
      </div>
      <div class="icon-btn">
        <img src="/icons/emoji-outline.svg" alt="emoji" />
      </div>
      <div class="icon-btn send-message-btn" @click="sendMessage" :class="{ disabled: !messageInput }">
        <img src="/icons/send-filled-white.svg" alt="send" />
      </div>
    </div>
  </div>
  <div v-else class="empty-chat">
    <img src="/icons/chat.svg" alt="empty chat" />
    <p class="empty-data">Выберите или создайте чат</p>
  </div>
</template>

<style scoped lang="scss">
#active-chat {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  height: 100%;

  background: $white-primary;
  border-radius: 16px;
  border: 1px solid rgba($black-primary, 0.1);
  padding: 12px 30px 24px 30px;

  opacity: 0;

  transition: 50ms;

  & > .profile-element {
    display: flex;
    align-items: center;
    gap: 12px;

    width: 100%;
    padding: 12px 0;
    background: $white-primary;

    & > .close-chat {
      opacity: 0.6;
      cursor: pointer;

      &:hover {
        opacity: 0.8;
      }
    }
    & > .avatar {
      position: relative;
      cursor: pointer;

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
        cursor: pointer;
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
  flex-direction: column-reverse;
  gap: 12px;
  flex-grow: 1;

  width: 100%;
  height: 100%;

  overflow-y: auto;
  scrollbar-color: rgba(0,0,0,0.05) transparent !important;
  scrollbar-width: none;

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
      line-height: 120%;
    }
    & > .message-time {
      @include tag-text;
      font-size: 12px;
      opacity: 0.6;
      margin-bottom: 4px;
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
  margin-top: 16px;

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
.empty-chat {
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

    filter: grayscale(100%);
    opacity: 0.6;
  }

  & > .empty-data {
    @include input-text;
    opacity: 0.6;
    text-align: center;
  }
}
</style>
