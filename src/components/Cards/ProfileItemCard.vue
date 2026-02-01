<script setup lang="ts">
import type { Profile } from '@/types/profile/profile.model.ts'
import { useProfileStore } from '@/stores/profile.store.ts'
import { onMounted, ref } from 'vue'

const profileStore = useProfileStore()
const { CheckOnlineStatus } = profileStore

interface Props {
  profile: Profile
}
const props = defineProps<Props>()

const isOnline = ref<boolean>(false)

onMounted(async () => {
  const res = await CheckOnlineStatus(props.profile.id)
  if (res) isOnline.value = res.online
})
</script>

<template>
  <div class="profile-element">
    <div class="avatar">
      <img :src="`/img/avatars/${profile.avatar_url}`" alt="avatar" />
      <div class="online-status" v-if="isOnline"></div>
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

  & > img {
    max-width: 44px;
    height: 44px;
  }

  & > .online-status {
    position: absolute;
    right: 2px;
    bottom: 2px;

    width: 12px;
    height: 12px;
    background: $blue-color;

    border-radius: 99px;
    border: 2px solid $white-primary;
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
