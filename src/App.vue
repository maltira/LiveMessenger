<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useAppInit } from '@/composables/useAppInit.ts'
import Notification from '@/components/UI/Notification.vue'

const { initApp } = useAppInit()

onMounted(async () => {
  await initApp()
})
</script>

<template>
  <RouterView />
  <Notification />
</template>

<style scoped lang="scss">
</style>
