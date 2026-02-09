<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useChatStore } from '@/stores/chats.store.ts'
import { storeToRefs } from 'pinia'
import type { Message } from '@/types/chat/message.model.ts'
import { useProfileStore } from '@/stores/profile.store.ts'

// ? EMIT & PROPS
interface Props {
  msg: Message
  pos_x: number
  pos_y: number
}
const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

// ? STORE
const profileStore = useProfileStore()
const chatStore = useChatStore()
const { activeChat } = storeToRefs(chatStore)
const { DeleteMessage } = chatStore

// ? REFS
const handleClose = () => {
  const actionModal = document.getElementById('message-action-modal')
  if (actionModal) {
    actionModal.style.opacity = '0'
    actionModal.style.transform = 'scale(0.9)'
  }

  setTimeout(() => {
    emit('close')
  }, 50)
}
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    handleClose()
  }
}
const handleClickOutside = (event: MouseEvent) => {
  const actionModal = document.getElementById('message-action-modal')
  if (actionModal && !actionModal.contains(event.target as Node)) {
    handleClose()
  }
}
const replyToMessage = () => {
  if (activeChat.value) {
    activeChat.value.replyTo = props.msg
    handleClose()

    setTimeout(() => {
      const replyContainer = document.getElementById("reply-to-message")
      if (replyContainer) {
        replyContainer.style.opacity = "1"
        replyContainer.style.transform = "scale(1)"
      }
    }, 1)
  }
}
const deleteMessage = async () => {
  if (activeChat.value && profileStore.me && profileStore.me.id === props.msg.user_id) {
    await DeleteMessage(activeChat.value.id, props.msg.id)
    handleClose()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('click', handleClickOutside)
  setTimeout(() => {
    const actionModal = document.getElementById('message-action-modal')

    if (actionModal) {
      actionModal.style.opacity = '1'
      actionModal.style.transform = 'scale(1)'
    }
  }, 1)
})
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div
    class="message-action-modal"
    id="message-action-modal"
    :style="{ top: pos_y + 'px', left: pos_x + 'px' }"
  >
    <div class="action-item" @click="replyToMessage">
      <img src="/icons/bx_share.svg" alt="reply" />
      <p>Ответить</p>
    </div>
    <div v-if="profileStore.me && profileStore.me.id === msg.user_id" class="action-item" @click="deleteMessage">
      <img src="/icons/delete-outline.svg" alt="reply" />
      <p class="red">Удалить</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.message-action-modal {
  display: flex;
  flex-direction: column;

  background: $white-primary;
  border: 1px solid rgba($black-primary, 0.1);
  border-radius: 16px;

  width: 202px;

  opacity: 0;
  transform: scale(0.9);

  position: absolute;
  box-shadow: 4px 4px 24px 0 rgba($black-primary, 0.03);
  transition: 50ms;

  overflow: hidden;
}
.action-item {
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 10px 16px;

  background: transparent;
  cursor: pointer;
  opacity: 0.8;

  & > img {
    width: 20px;
    height: 20px;
  }

  & > p {
    @include tag-text;
    font-weight: 500;
    &.red {
      color: $red-color;
    }
  }

  &:hover {
    opacity: 0.99;
    background: $gray-primary;
  }
}
</style>
