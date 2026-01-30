<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useAppInit } from '@/composables/useAppInit.ts'

const { initApp } = useAppInit()

onMounted(async () => {
  await initApp()
})
</script>

<template>
  <RouterView />
</template>

<style scoped lang="scss">
</style>
