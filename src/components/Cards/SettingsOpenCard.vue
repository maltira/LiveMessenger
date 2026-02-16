<script setup lang="ts">
import { useProfileStore } from '@/stores/profile.store.ts'
import { storeToRefs } from 'pinia'
import SettingsBlock from '@/components/Buttons/SettingsBlock.vue'
import { onMounted, ref } from 'vue'

// ? STORE
const profileStore = useProfileStore()
const { isSettingsOpen, isSessionsOpen, isBlocksOpen } = storeToRefs(profileStore)

// ? FUNCTIONS
const handleClose = () => {
  if (settingsList.value) {
    settingsList.value.style.margin = '0 5px'
    settingsList.value.style.opacity = '0'
  }

  setTimeout(() => {
    isSettingsOpen.value = false
  }, 100)
}
const goToSessions = () => {
  isSessionsOpen.value = true
  handleClose()
}
const goToBlocks = () => {
  isBlocksOpen.value = true
  handleClose()
}

// ? REFS
type SettingBlock = {
  icon: string
  name: string
  description: string
  func: Function | null
}
const settings = ref<SettingBlock[]>([
  { icon: 'mail.svg', name: 'Почта для входа', description: 'example@example.com', func: null },
  {
    icon: 'lock.svg',
    name: 'Пароль для входа',
    description: 'Здесь вы можете изменить пароль',
    func: null,
  },
  {
    icon: 'session.svg',
    name: 'Активные сеансы',
    description: 'С каких устройств выполнен вход',
    func: goToSessions,
  },
  {
    icon: 'block-outline.svg',
    name: 'Заблокированные пользователи',
    description: 'Ваш чёрный список пользователей',
    func: goToBlocks,
  },
  {
    icon: 'user.svg',
    name: 'Параметры конфиденциальности',
    description: 'Ваши публичные данные',
    func: null,
  },
])
const settingsList = ref<HTMLElement | null>(null)

onMounted(() => {
  setTimeout(() => {
    settingsList.value = document.getElementById('settings-list')
    if (settingsList.value) {
      settingsList.value.style.margin = '0'
      settingsList.value.style.opacity = '1'
    }
  }, 1)
})
</script>

<template>
  <div class="form-header">
    <div class="icon-btn" @click="handleClose">
      <img src="/icons/arrow.svg" alt="back" />
    </div>
    <h5>Настройки</h5>
  </div>
  <div id="settings-list">
    <SettingsBlock
      v-for="(s, i) in settings"
      :key="i"
      :icon="s.icon"
      :name="s.name"
      :description="s.description"
      @click="s.func ? s.func() : null"
    />
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
#settings-list {
  display: flex;
  flex-direction: column;
  gap: 8px;

  opacity: 0;
  margin: 0 5px;

  padding: 12px 24px;
}
</style>
