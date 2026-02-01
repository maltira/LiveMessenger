<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useAppInit } from '@/composables/useAppInit.ts'
import Notification from '@/components/UI/Notification.vue'
import Skeleton from '@/components/UI/Skeleton.vue'

const { initApp, isAppReady } = useAppInit()

onMounted(async () => {
  await initApp()
})
</script>

<template>
  <RouterView v-if="isAppReady"/>
  <div v-else class="skeleton-loader">
    <Skeleton width="462px" height="100%" border-radius="16px"/>
    <Skeleton width="100%" height="100%" border-radius="16px"/>
  </div>
  <Notification />
</template>

<style scoped lang="scss">
.skeleton-loader {
  display: flex;
  gap: 6px;
  height: 100vh;
  padding: 32px;
  background: #F6F6F6;
}
</style>
