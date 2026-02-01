<script setup lang="ts">
import ChatListPanel from '@/components/Forms/ProfileSide/ChatListPanel.vue'
import SelectedChatForm from '@/components/Forms/ChatSide/SelectedChatForm.vue'
</script>

<template>
  <div class="home-view">
    <ChatListPanel/>
    <SelectedChatForm/>
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
</style>
