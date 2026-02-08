<script setup lang="ts">
import ChatListContainer from '@/components/Forms/ChatList/ChatListContainer.vue'
import ChatContainer from '@/components/Forms/ChatContainer.vue'

</script>

<template>
  <div class="home-view">
    <!-- Левая часть (со спискомм чатов) -->
    <ChatListContainer/>

    <!-- Правая часть (выбранный чат) -->
    <ChatContainer/>
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
