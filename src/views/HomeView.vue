<script setup lang="ts">
import ChatListPanel from '@/components/Forms/ProfileSide/ChatListPanel.vue'
import SelectedChatForm from '@/components/Forms/ChatSide/SelectedChatForm.vue'
import { storeToRefs } from 'pinia'
import { useMessagesStore } from '@/stores/message.store.ts'

const messagesStore = useMessagesStore()
const { activeChat } = storeToRefs(messagesStore)
</script>

<template>
  <div class="home-view">
    <ChatListPanel/>
    <SelectedChatForm v-if="activeChat.id"/>
    <div v-else class="empty-chat">
      <img src="/icons/chat.svg" alt="empty chat" />
      <p class="empty-data">Выберите или создайте чат</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home-view {
  display: flex;
  gap: 6px;

  padding: 32px;
  background: $gray-primary;

  width: 100%;
  height: 100vh;
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
