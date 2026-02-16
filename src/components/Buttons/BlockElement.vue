<script setup lang="ts">

import type { Profile } from '@/types/profile/profile.model.ts'

interface Props {
  profile: Profile
}
const props = defineProps<Props>()

const emit = defineEmits<{
  unblock: []
}>()
</script>

<template>
  <div class="block-element">
    <img class="avatar" :src="`/img/avatars/${profile.avatar_url}`" alt="avatar">
    <div class="info">
      <p class="title">{{ profile.full_name }}</p>
      <p class="description">@{{ profile.username }}</p>
    </div>
    <img src="/icons/close.svg" alt="unblock" class="unblock" @click="emit('unblock')">
  </div>
</template>

<style scoped lang="scss">
.block-element {
  display: flex;
  align-items: center;
  gap: 12px;

  & > .avatar {
    width: 44px;
    height: 44px;
  }
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
.unblock {
  width: 24px;
  height: 24px;
  opacity: 0.6;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
}
</style>
