<script setup lang="ts">
import { useProfileStore } from '@/stores/profile.store.ts'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store.ts'
import { useNotification } from '@/composables/useNotifications.ts'
import SessionElement from '@/components/Buttons/SessionElement.vue'

// ? STORE
const { infoNotification } = useNotification()
const profileStore = useProfileStore()
const { isSettingsOpen, isSessionsOpen } = storeToRefs(profileStore)
const authStore = useAuthStore()
const { sessions, isLoading: sessionLoading, error: sessionsError } = storeToRefs(authStore)

// ? FUNCTIONS
const handleClose = () => {
  if (sessionsList.value) {
    sessionsList.value.style.transform = 'scale(0.97)'
    sessionsList.value.style.opacity = '0'
  }

  setTimeout(() => {
    isSessionsOpen.value = false
    isSettingsOpen.value = true
  }, 100)
}
const computeDevice = (d: string) => {
  const splitDevice = d.split(" / ")
  if (splitDevice.length > 1) {
    return splitDevice[0] + " " + splitDevice[1]
  }
  return d
}
const closeSession = async (ref_token: string) => {
  const closed = await authStore.LogoutSession(ref_token)

  if (!closed && sessionsError.value) {
    infoNotification("🚫 Ошибка сессии: " + sessionsError.value.error)
  }
}

// ? REFS
const sessionsList = ref<HTMLElement | null>(null)

onMounted(async () => {
  await authStore.FetchSessions()

  if (sessionsError.value) {
    infoNotification('🚫 Ошибка: ' + sessionsError.value.error)
  } else {
    setTimeout(() => {
      sessionsList.value = document.getElementById('sessions-list')
      if (sessionsList.value) {
        sessionsList.value.style.transform = 'scale(1)'
        sessionsList.value.style.opacity = '1'
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
    <h5>Активные сеансы</h5>
  </div>

  <div id="sessions-list" class="sessions-list" v-if="sessions && sessions.length > 0">
    <SessionElement
      v-for="(s, i) in sessions"
      :key="i"
      :id="s.id"
      :name="computeDevice(s.device)"
      :description="s.ip"
      @close_conn="() => closeSession(s.refresh_token)"
    />
  </div>
  <div class="empty-data" v-else-if="!sessionLoading">Ничего не найдено</div>
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
.sessions-list {
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
