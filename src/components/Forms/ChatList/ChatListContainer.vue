<script setup lang="ts">
import ChatListContent from '@/components/Forms/ChatList/ChatListContent.vue'
import { useProfileStore } from '@/stores/profile.store.ts'
import { storeToRefs } from 'pinia'
import ProfileOpenCard from '@/components/Cards/ProfileOpenCard.vue'

const profileStore = useProfileStore()
const { selectedProfile } = storeToRefs(profileStore)
</script>

<template>
  <div class="chats-side-form">
    <!-- Отображается профиль (если он выбран) -->
    <ProfileOpenCard v-if="selectedProfile" @close="selectedProfile = null"/>

    <!-- Иначе мои чаты -->
    <ChatListContent v-else/>
  </div>
</template>

<style scoped lang="scss">
.chats-side-form {
  position: relative;
  display: flex;
  flex-direction: column;

  width: 462px;
  flex-shrink: 0;
  height: 100%;

  background: $white-primary;
  border-radius: 16px;
  border: 1px solid rgba($black-primary, 0.1);
  padding: 24px 0;
  gap: 12px;
}

</style>
