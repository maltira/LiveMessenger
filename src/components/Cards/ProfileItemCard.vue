<script setup lang="ts">
import type { Profile } from '@/types/profile/profile.model.ts'
import { useOnlineStore } from '@/stores/online.store.ts'
import { storeToRefs } from 'pinia'
import { useBlockStore } from '@/stores/block.store.ts'

const onlineStore = useOnlineStore()
const { isUserOnline } = storeToRefs(onlineStore)
const blockStore = useBlockStore()
const { isBlockedMeBy } = storeToRefs(blockStore)

interface Props {
  profile: Profile
}
const props = defineProps<Props>()
</script>

<template>
  <div class="profile-element">
    <div class="avatar">
      <img
        v-if="isBlockedMeBy(profile.id)"
        class="img-avatar"
        style="opacity: 0.4"
        src="/icons/block-outline.svg"
        alt="block.svg"
      />
      <img v-else class="img-avatar" :src="`/img/avatars/${profile.avatar_url}`" alt="avatar" />

      <div class="online-status" :class="{active: isUserOnline(profile.id) && !isBlockedMeBy(profile.id)}"></div>
    </div>
    <div class="profile-data">
      <p class="full_name">{{ profile.full_name }}</p>
      <p class="user_name">@{{ profile.username }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.profile-element {
  display: flex;
  align-items: center;
  gap: 12px;

  width: 100%;
  padding: 10px 24px;
  background: transparent;

  cursor: pointer;
  transition: background-color 1ms;
  &:hover {
    background: rgba($gray-primary, 0.5);
  }
}
.avatar {
  position: relative;

  & > .img-avatar {
    max-width: 44px;
    height: 44px;
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
.profile-data {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;

  & > .full_name {
    @include button-text;
    line-height: 100%;
    width: 90%;
  }
  & > .user_name {
    @include tag-text;
    line-height: 120%;
    opacity: 0.6;
  }
}
</style>
