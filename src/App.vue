<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useAppInit } from '@/composables/useAppInit.ts'
import Notification from '@/components/UI/Notification.vue'
import Skeleton from '@/components/UI/Skeleton.vue'
import Sidebar from '@/components/Forms/ChatList/Sidebar.vue'
import DeleteAccountModal from '@/components/Modals/DeleteAccountModal.vue'
import { useProfileStore } from '@/stores/profile.store.ts'
import { storeToRefs } from 'pinia'

const { initApp, isAppReady } = useAppInit()
const route = useRoute()

const profileStore = useProfileStore()
const { isDeleteModalOpen } = storeToRefs(profileStore)

const hideSidebar = computed(() => {
  return route.meta.hideSidebar
})

onMounted(async () => {
  await initApp()
})
</script>

<template>
  <div v-if="isAppReady" class="home-view" :class="{ default: hideSidebar }">
    <Sidebar v-if="!hideSidebar" />
    <RouterView />
  </div>

  <div v-else class="home-view skeleton">
    <Skeleton width="462px" height="100%" border-radius="16px" style="flex-shrink: 0" />
    <Skeleton width="100%" height="100%" border-radius="16px" />
  </div>

  <DeleteAccountModal v-if="isDeleteModalOpen"/>
  <Notification />
</template>

<style scoped lang="scss">
.home-view {
  display: flex;
  width: 100%;
  gap: 6px;
  height: 100vh;
  padding: 32px;
  background: #f6f6f6;
}
</style>
