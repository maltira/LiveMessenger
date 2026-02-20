<script setup lang="ts">

interface Props {
  icon: string
  name: string
  description: string
}
const props = defineProps<Props>()
</script>

<template>
  <div class="settings-block">
    <img :src="`/icons/${icon}`" alt="icon">
    <div class="info">
      <p class="title">{{ name }}</p>
      <p class="description">{{ description }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.settings-block {
  display: flex;
  align-items: center;
  gap: 12px;

  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;

  & > img {
    width: 24px;
    height: 24px;
    opacity: 0.6;
  }

  &:hover {
    background: rgba($gray-primary, 0.5);
  }
}
.info {
  display: flex;
  flex-direction: column;
  gap: 6px;

  & > .title {
    @include button-text;
    line-height: 100%;
  }
  & > .description {
    @include input-text;
    opacity: 0.6;
    line-height: 120%;
  }
}
</style>
