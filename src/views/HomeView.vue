<script setup lang="ts">
import ChatsSideForm from '@/components/Forms/ChatsSideForm.vue'
import SelectedChatForm from '@/components/Forms/SelectedChatForm.vue'
</script>


<template>
  <div class="home-view">
    <ChatsSideForm/>
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
