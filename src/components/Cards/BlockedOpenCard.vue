<script setup lang="ts">
import { useProfileStore } from '@/stores/profile.store.ts'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useNotification } from '@/composables/useNotifications.ts'
import { useBlockStore } from '@/stores/block.store.ts'
import BlockElement from '@/components/Buttons/BlockElement.vue'

// ? STORE
const { infoNotification } = useNotification()
const profileStore = useProfileStore()
const { isSettingsOpen, isBlocksOpen } = storeToRefs(profileStore)
const blockStore = useBlockStore()
const { blocks, error: blockError, isLoading: blockLoading } = storeToRefs(blockStore)

// ? FUNCTIONS
const handleClose = () => {
  if (blockedList.value) {
    blockedList.value.style.transform = 'scale(0.97)'
    blockedList.value.style.opacity = '0'
  }

  setTimeout(() => {
    isBlocksOpen.value = false
    isSettingsOpen.value = true
  }, 100)
}
const unblockUser = async (user_id: string) => {
  const res = await blockStore.UnblockProfile(user_id)

  if (!res && blockError.value) {
    infoNotification("🚫 Ошибка: " + blockError.value.error)
  }
}

// ? REFS
const blockedList = ref<HTMLElement | null>(null)

onMounted(async () => {
  if (!blocks.value || blocks.value && blocks.value.length === 0) {
    await blockStore.FetchAll()
    if (blockError.value) {
      infoNotification('🚫 Ошибка: ' + blockError.value.error)
    }
  }
  else {
    setTimeout(() => {
      blockedList.value = document.getElementById('blocked-list')
      if (blockedList.value) {
        blockedList.value.style.transform = 'scale(1)'
        blockedList.value.style.opacity = '1'
      }
    }, 1)
  }
})
</script>

<template>
  <div class="form-header">
    <div class="icon-btn" @click="handleClose">
      <img src="/icons/arrow.svg" alt="back" />
    </div>
    <h5>Заблокированные</h5>
  </div>

  <div id="blocked-list" class="blocked-list" v-if="blocks && blocks.length > 0">
    <BlockElement v-for="(b, i) in blocks" :key="i" :profile="b.BlockedProfile" @unblock="() => unblockUser(b.blocked_profile_id)"/>
  </div>
  <div class="empty-data" v-else-if="!blockLoading">Ничего не найдено</div>
</template>

<style scoped lang="scss">
.form-header {
  display: flex;
  align-items: center;
  gap: 24px;

  padding: 0 24px;

  & > .icon-btn {
    @include gray-icon-btn;
  }
  & > h5 {
    @include h5-text;
  }
}
.blocked-list {
  display: flex;
  flex-direction: column;
  gap: 8px;

  opacity: 0;
  transform: scale(0.97);

  padding: 12px 24px;

  overflow-y: scroll;
  scrollbar-width: none;
}
.empty-data {
  @include input-text;
  opacity: 0.6;

  display: flex;
  align-items: center;
  justify-content: center;

  height: 100%;
}
</style>
