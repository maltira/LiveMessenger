<script setup lang="ts">
import { useProfileStore } from '@/stores/profile.store.ts'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useNotification } from '@/composables/useNotifications.ts'
import { useSettingsStore } from '@/stores/settings.store.ts'

// ? STORE
const { infoNotification } = useNotification()
const profileStore = useProfileStore()
const { isLanguagesOpen } = storeToRefs(profileStore)
const settingsStore = useSettingsStore()
const { settings, error, isLoading } = storeToRefs(settingsStore)

// ? FUNCTIONS
const handleClose = () => {
  if (languagesList.value) {
    languagesList.value.style.transform = 'scale(0.97)'
    languagesList.value.style.opacity = '0'
  }

  setTimeout(() => {
    isLanguagesOpen.value = false
  }, 100)
}
const goToSaveSettings = async () => {
  if (selectedLanguage.value && selectedLanguage.value !== settings.value.language) {
    await settingsStore.UpdateSettings({
      language: selectedLanguage.value,
      show_birth_date: null,
      show_online_status: null,
      dark_mode: null,
    })

    if (error.value) {
      infoNotification("🚫 " + error.value.error)
    } else {
      infoNotification("Язык изменен: " + selectedLanguage.value)
    }
  }
}

// ? REFS
type LanguageItem = {
  name: string
  local: string
  code: string
}
const selectedLanguage = ref<string>("")
const languagesList = ref<HTMLElement | null>(null)
const languages = ref<LanguageItem[]>([
  {name: "Русский", local: "Русский", code: "ru-RU"},
  {name: "English", local: "English", code: "en-US"},
])

onMounted(async () => {
  selectedLanguage.value = settings.value.language
  setTimeout(() => {
    languagesList.value = document.getElementById('language-list')
    if (languagesList.value) {
      languagesList.value.style.transform = 'scale(1)'
      languagesList.value.style.opacity = '1'
    }
  }, 1)
})
</script>

<template>
  <div class="form-header">
    <div class="icon-btn" @click="handleClose">
      <img src="/icons/arrow.svg" alt="back" />
    </div>
    <h5>Язык интерфейса</h5>
  </div>

  <div id="language-list" class="language-list">
    <div class="languages">
      <div class="language-item" v-for="(l, i) in languages" :key="i" @click="selectedLanguage = l.code">
        <input type="radio" name="language" :value="l.code" v-model="selectedLanguage">
        <div class="info">
          <p class="name">{{ l.name }}</p>
          <p class="local">{{ l.local }}</p>
        </div>
      </div>
    </div>
    <button
      @click="goToSaveSettings"
      :class="{ disabled: settings.language === selectedLanguage || isLoading }"
    >
      Сохранить изменения
    </button>
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
.language-list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  opacity: 0;
  transform: scale(0.97);

  padding: 4px 24px;

  & > .languages {
    overflow-y: scroll;
    scrollbar-width: none;
  }

  & > button {
    @include gray-fill-btn;
  }
}
.language-item {
  display: flex;
  align-items: center;
  gap: 16px;

  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;

  & > input {
    -webkit-appearance: none;
    appearance: none;

    width: 20px;
    height: 20px;
    border: 2px solid rgba($black-primary, 0.2);
    outline: none;
    border-radius: 100%;

    &:checked {
      border: 6px solid rgba($blue-color, 1);
    }
  }
  & > .info {
    display: flex;
    flex-direction: column;
    gap: 6px;

    & > .name {
      @include button-text;
      line-height: 100%;
    }
    & > .local {
      @include input-text;
      opacity: 0.6;
      line-height: 120%;
    }
  }

  &:hover {
    background: rgba($gray-primary, 0.5);
  }
}
</style>
