<script setup lang="ts">
import { useProfileStore } from '@/stores/profile.store.ts'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useNotification } from '@/composables/useNotifications.ts'
import { useSettingsStore } from '@/stores/settings.store.ts'
import type { SettingsUpdateReq } from '@/types/profile/dto/settings.dto.ts'

// ? STORE
const { infoNotification } = useNotification()
const profileStore = useProfileStore()
const { isSettingsOpen, isConfidentOpen } = storeToRefs(profileStore)
const settingsStore = useSettingsStore()
const { settings, isLoading, error } = storeToRefs(settingsStore)

// ? FUNCTIONS
const handleClose = () => {
  if (settingsElement.value) {
    settingsElement.value.style.transform = 'scale(0.97)'
    settingsElement.value.style.opacity = '0'
  }

  setTimeout(() => {
    isConfidentOpen.value = false
    isSettingsOpen.value = true
  }, 100)
}
const updateSettings = async (status?: boolean, birth_date?: "all" | "nobody") => {
  const req: SettingsUpdateReq = {
    show_online_status: status,
    show_birth_date: birth_date,
  }
  const updated = await settingsStore.UpdateSettings(req)

  if (!updated && error.value) {
    infoNotification("🚫 Ошибка "+ error.value.code + ": " + error.value.error)
    return
  }

  showOnline.value = status !== undefined ? status : showOnline.value
  showBirthDate.value = birth_date !== undefined ? birth_date : showBirthDate.value
}

// ? REFS
const settingsElement = ref<HTMLElement | null>(null)
const showOnline = ref<boolean>(true)
const showBirthDate = ref<"all" | "nobody">("all")

onMounted(async () => {
  showOnline.value = settings.value.show_online_status
  showBirthDate.value = settings.value.show_birth_date

  setTimeout(() => {
    settingsElement.value = document.getElementById('settings-list')
    if (settingsElement.value) {
      settingsElement.value.style.transform = 'scale(1)'
      settingsElement.value.style.opacity = '1'
    }
  }, 1)
})
</script>

<template>
  <div class="form-header">
    <div class="icon-btn" @click="handleClose">
      <img src="/icons/arrow.svg" alt="back" />
    </div>
    <h5>Конфиденциальность</h5>
  </div>

  <div id="settings-list" class="settings-list">
    <div class="settings_el">
      <div class="info">
        <p class="title">Кто видит мой статус в сети?</p>
        <p class="description">Никто не увидит, когда вы были онлайн</p>
      </div>
      <button
        class="toggle-value"
        :class="{disabled: isLoading}"
        @click="updateSettings(!showOnline)"
      >
        {{ showOnline ? "Все" : "Никто"}}
      </button>
    </div>
    <div class="settings_el">
      <div class="info">
        <p class="title">Кто видит мой день рождения?</p>
        <p class="description">Никто не увидит вашу дату рождения, если вы её скрыли</p>
      </div>
      <button
        class="toggle-value"
        :class="{disabled: isLoading}"
        @click="updateSettings(undefined, showBirthDate === 'all' ? 'nobody' : 'all')"
      >{{ showBirthDate === 'all' ? "Все" : "Никто"}}</button>
    </div>
  </div>
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
.settings-list {
  display: flex;
  flex-direction: column;
  gap: 24px;

  opacity: 0;
  transform: scale(0.97);

  padding: 12px 24px;

  overflow-y: scroll;
  scrollbar-width: none;
}
.settings_el {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;

  & > .info {
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
  & > .toggle-value {
    @include inline-btn;
    height: 37px;
    width: 100px;

    &.disabled {
      opacity: 1;
    }
  }
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
