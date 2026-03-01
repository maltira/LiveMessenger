<script setup lang="ts">
import ChatListContent from '@/components/Forms/ChatList/ChatListContent.vue'
import { useProfileStore } from '@/stores/profile.store.ts'
import { storeToRefs } from 'pinia'
import ProfileOpenCard from '@/components/Cards/ProfileOpenCard.vue'
import SettingsOpenCard from '@/components/Cards/SettingsOpenCard.vue'
import SessionsOpenCard from '@/components/Cards/SessionsOpenCard.vue'
import BlockedOpenCard from '@/components/Cards/BlockedOpenCard.vue'
import ConfidentOpenCard from '@/components/Cards/ConfidentOpenCard.vue'
import ChangeMailCard from '@/components/Cards/ChangeMailCard.vue'
import ChangePassCard from '@/components/Cards/ChangePassCard.vue'
import LanguageCard from '@/components/Cards/LanguageCard.vue'
import ChangeProfileCard from '@/components/Cards/ChangeProfileCard.vue'

const profileStore = useProfileStore()
const {
  selectedProfile,
  isSettingsOpen,
  isSessionsOpen,
  isBlocksOpen,
  isConfidentOpen,
  isChangeMailOpen,
  isChangePassOpen,
  isLanguagesOpen,
  isChangeProfileOpen,
} = storeToRefs(profileStore)
</script>

<template>
  <div class="chats-side-form">
    <!-- Отображается профиль (если он выбран) -->
    <ProfileOpenCard v-if="selectedProfile"/>

    <!-- Настройки -->
    <SettingsOpenCard v-else-if="isSettingsOpen"/>

    <!-- Активные сессии -->
    <SessionsOpenCard v-else-if="isSessionsOpen"/>

    <!-- Черный список -->
    <BlockedOpenCard v-else-if="isBlocksOpen"/>

    <!-- Настройки конфиденциальности -->
    <ConfidentOpenCard v-else-if="isConfidentOpen"/>

    <!-- Смена почты -->
    <ChangeMailCard v-else-if="isChangeMailOpen"/>

    <!-- Смена пароля -->
    <ChangePassCard v-else-if="isChangePassOpen"/>

    <!-- Выбор языка -->
    <LanguageCard v-else-if="isLanguagesOpen"/>

    <ChangeProfileCard v-else-if="isChangeProfileOpen"/>

    <!-- Иначе мои чаты -->
    <ChatListContent v-else/>
  </div>
</template>

<style scoped lang="scss">
.chats-side-form {
  position: relative;
  display: flex;
  flex-direction: column;

  width: 400px;
  flex-shrink: 0;
  height: 100%;

  background: $white-primary;
  border-radius: 16px;
  border: 1px solid rgba($black-primary, 0.1);
  padding: 24px 0;
  gap: 12px;
}

</style>
