<script setup lang="ts">
</script>

<template>
  <div class="selected-chat-form">
    <div class="empty-chat">
      <img src="/icons/chat.svg" alt="empty chat">
      <p class="empty-data">Выберите или создайте чат</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.selected-chat-form {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
}
.empty-chat {
  display: flex;
  flex-direction: column;
  align-items: center;
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
