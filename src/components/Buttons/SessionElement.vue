<script setup lang="ts">

interface Props {
  id: string
  name: string
  description: string
}
const props = defineProps<Props>()

const emit = defineEmits<{
  close_conn: []
}>()
</script>

<template>
  <div class="session-element">
    <div class="info">
      <p class="title">{{ name }}</p>
      <p class="description">{{ description }}</p>
    </div>
    <button class="close-session" @click="emit('close_conn')">Завершить</button>
  </div>
</template>

<style scoped lang="scss">
.session-element {
  display: flex;
  align-items: center;
  gap: 16px;

  padding: 8px 0;

  & > .info{
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;

    & > .title {
      @include button-text;
      line-height: 100%;
    }
    & > .description {
      @include input-text;
      line-height: 120%;
      opacity: 0.6;
    }
  }
}
.close-session {
  @include inline-btn;

  width: fit-content;
  height: 37px;

  color: rgba($red-color, 0.6);
  border-color: rgba($red-color, 0.2);

  &:hover {
    color: rgba($red-color, 0.8);
    border-color: rgba($red-color, 0.4);
  }
}
</style>
