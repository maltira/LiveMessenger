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
import MessageActionModal from '@/components/Modals/MessageActionModal.vue'
import type { Message } from '@/types/chat/message.model.ts'

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
const pickerPosition = ref({ x: 0, y: 0 })
const msgAction = ref<Message | null>(null)
const profile = ref<Profile | null>(null)
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
const toggleActionModal = (msg: Message, event: MouseEvent) => {
  if (msgAction.value) msgAction.value = null

  pickerPosition.value = {x: event.clientX - 180, y: event.clientY + 10}
  msgAction.value = msg
}

const sendMessage = async () => {
  if (activeChat.value && activeChat.value.inputValue && activeChat.value.inputValue.trim().length > 0) {
    const msg: MsgCreateRequest = {
      content: activeChat.value.inputValue,
      type: 'text',
      reply_to_message: activeChat.value.replyTo?.id || null
    }

    await chatStore.SendMessage(activeChatId.value, msg)

    if (chatError.value) {
      infoNotification("🚫 Сообщение не отправлено: " + chatError.value)
      return
    }
    activeChat.value.inputValue = ''
    activeChat.value.replyTo = undefined
  }
}
const fetchProfileName = computed(() => {
  if (activeChat.value && activeChat.value.replyTo) {
    const id = activeChat.value.replyTo!.user_id
    if (id) {
      if (id === me.value!.id) return "Ваше сообщение"
      return profile.value?.full_name || profile.value?.username
    }
    else return "Система"
  }
  return "Неизвестно"
})

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

        <img v-if="m.user_id === me!.id && !m.read_by.includes(profile.id)" class="read-check" src="/icons/check-fill-blue.svg" alt="read-check">
        <img v-else-if="m.user_id === me!.id && m.read_by.includes(profile.id)" class="read-check" src="/icons/check-double-fill-blue.svg" alt="read-check">

        <p class="message-time" v-if="m.user_id === me!.id">{{ formatTimeOnly(m.created_at) }}</p>

        <p class="message-content" @contextmenu.prevent="toggleActionModal(m, $event)">
          <span v-if="m.reply_to_message" :class="{blue: m.user_id !== me!.id}">
            {{ activeChat.messages.find(msg => msg.id === m.reply_to_message)?.content || "Не найдено" }}
          </span>
          {{ m.content }}
        </p>

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
      <div class="message-input-container">
        <div id="reply-to-message" class="reply-to-message" v-if="activeChat && activeChat.replyTo">
          <div class="content">
            <p class="user">{{ fetchProfileName }}:</p>
            <p class="msg-content">{{ activeChat.replyTo!.content }}</p>
          </div>
          <img class="cancel-reply" @click="activeChat.replyTo = undefined" src="/icons/close.svg" alt="cancel">
        </div>
        <div id="message-input" class="message-input" :class="{ active: activeChat.inputValue }">
          <input
            type="text"
            id="chat-message-input"
            autocomplete="off"
            v-model="activeChat.inputValue"
            placeholder="Введите сообщение"
            @keyup.enter="sendMessage"
          />
        </div>
      </div>

      <div class="icon-btn">
        <img src="/icons/emoji-outline.svg" alt="emoji" />
      </div>
      <div class="icon-btn send-message-btn" @click="sendMessage" :class="{ disabled: !activeChat.inputValue }">
        <img src="/icons/send-filled-white.svg" alt="send" />
      </div>
    </div>
  </div>
  <div v-else class="empty-chat">
    <img src="/icons/chat.svg" alt="empty chat" />
    <p class="empty-data">Выберите или создайте чат</p>
  </div>

  <MessageActionModal
    v-if="msgAction"
    :msg="msgAction"
    :pos_y="pickerPosition.y"
    :pos_x="pickerPosition.x"
    @close="msgAction = null"
  />
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

    & > .read-check {
      width: 14px;
      height: 14px;
      margin-bottom: 4px;
    }
    & > .message-content {
      @include input-text;

      display: flex;
      flex-direction: column;
      gap: 8px;

      padding: 8px 16px;
      border-radius: 16px 16px 16px 0;
      background: $gray-primary;
      color: $black-primary;
      max-width: 340px;
      line-height: 120%;

      & > span {
        @include input-text;
        display: flex;
        align-items: center;

        line-height: 120%;

        padding: 8px 16px;
        height: 33px;
        border-left: 1px solid $white-primary;
        border-radius: 0 8px 8px 0;
        background: rgba($white-primary, 0.1);

        cursor: pointer;

        &.blue {
          background: rgba($black-primary, 0.03);
          border-left-color: rgba($black-primary, 0.4);
        }
      }
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
  align-items: end;
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
  & > .message-input-container{
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;

    & > .reply-to-message {
      display: flex;
      align-items: center;
      gap: 32px;
      width: 100%;

      height: 34px;
      padding: 8px 16px;
      border-radius: 99px;
      border: 1px solid rgba($black-primary, 0.1);
      background: $white-primary;

      opacity: 0;
      transform: scale(0.9);
      transition: 50ms;
      
      & > .content {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;

        & > p {
          @include tag-text;
          line-height: 120%;

          &.user {
            opacity: 0.6;
            flex-shrink: 0;
          }
          &.msg-content {
            opacity: 0.4;
            width: 100%;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }

      & > img {
        cursor: pointer;
        width: 18px;
        height: 18px;
        opacity: 0.6;

        &:hover {
          opacity: 0.8;
        }
      }
    }
    & > #message-input {
      @include gray-fill-input;
    }
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
