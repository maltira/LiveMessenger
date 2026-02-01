<script setup lang="ts">
import { useProfileStore } from '@/stores/profile.store.ts'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth.store.ts'
import router from '@/router'
import { useBlockStore } from '@/stores/block.store.ts'
import { computed, onMounted } from 'vue'
import { useNotification } from '@/composables/useNotifications.ts'
import Skeleton from '@/components/UI/Skeleton.vue'
import { formatBirthDate, timeAgo } from '@/utils/DateFormat.ts'

// ? EMIT
const emit = defineEmits<{
  close: []
}>()

// ? STORE
const { infoNotification } = useNotification()
const profileStore = useProfileStore()
const { me, selectedProfile: profile } = storeToRefs(profileStore)
const authStore = useAuthStore()
const { Logout } = authStore
const blockStore = useBlockStore()
const { isLoading: blockLoading, error: blockError, blockedMeBy, isBlocked } = storeToRefs(blockStore)
const { BlockProfile, UnblockProfile, CheckIfBlockedMe } = blockStore

// ? COMPUTED
const isProfileBlocked = computed(() => {
  return isBlocked.value(profile.value!.id)
})
const isBlockedByThisUser = computed(() => {
  return blockedMeBy.value[profile.value!.id] ?? false
})

// ? FUNCTIONS
const goToLogout = async () => {
  await Logout()
  await router.push('/login')
}
const goToBlock = async () => {
  if (isProfileBlocked.value) {
    await UnblockProfile(profile.value!.id)
  } else {
    await BlockProfile(profile.value!.id)
  }

  if (blockError.value) {
    infoNotification('🚫 Ошибка. ' + blockError.value)
  }
}

onMounted(async () => {
  if (profile.value && profile.value.id && !(profile.value.id in blockedMeBy)) {
    await CheckIfBlockedMe(profile.value.id)
  }
})
</script>

<template>
  <div class="form-header">
    <div class="icon-btn" @click="emit('close')">
      <img src="/icons/arrow.svg" alt="back" />
    </div>
    <div class="icon-btn" v-if="me!.id === profile!.id">
      <img src="/icons/settings.svg" alt="settings" />
    </div>
  </div>
  <div v-if="!profile || blockedMeBy[profile.id] === undefined" class="form-content skeleton" >
    <div class="profile-info">
      <div class="profile-info_header">
        <Skeleton class="img-avatar skeleton" border-radius="99px"/>
        <div class="profile-header_title">
          <Skeleton width="50%" border-radius="99px"/>
          <Skeleton width="20%" height="19.2px" border-radius="99px"/>
        </div>
      </div>
      <Skeleton height="280px"/>
    </div>
    <div class="profile-actions">
      <Skeleton height="48px" border-radius="99px"/>
      <Skeleton height="48px" border-radius="99px"/>
    </div>
  </div>
  <div v-else class="form-content">
    <div class="profile-info">
      <div class="profile-info_header">
        <img v-if="isBlockedByThisUser" class="img-avatar" style="opacity: 0.4;" src="/icons/block-outline.svg" alt="block.svg">
        <img v-else class="img-avatar" :src="`/img/avatars/${profile!.avatar_url}`" alt="avatar" />

        <div class="profile-header_title">
          <h5>{{ profile!.full_name }}</h5>

          <p v-if="isBlockedByThisUser">Доступ ограничен</p>
          <p v-else-if="me!.id === profile!.id">@{{ profile!.username }}</p>
          <p v-else>{{ profile!.Settings.show_online_status && profile!.last_seen ? timeAgo(profile!.last_seen) : "Был(а) недавно" }}</p>
        </div>
      </div>
      <div class="profile-info_body">
        <div class="body_block" v-if="!isBlockedByThisUser">
          <p class="title-block">О себе</p>
          <p class="info-block">{{ profile!.bio || 'Не указано' }}</p>
        </div>
        <div class="body_block" v-if="me!.id !== profile!.id">
          <p class="title-block">Имя пользователя</p>
          <p class="info-block">@{{ profile!.username }}</p>
        </div>
        <div class="body_block" v-if="!isBlockedByThisUser && profile!.Settings.show_birth_date !== 'nobody'">
          <p class="title-block">Дата рождения</p>
          <p class="info-block">{{ profile!.birth_date ? formatBirthDate(profile!.birth_date) : 'Не указано' }}</p>
        </div>
        <div class="body_block" v-if="!isBlockedByThisUser">
          <p class="title-block">Дата регистрации</p>
          <p class="info-block">{{ profile!.created_at }}</p>
        </div>
      </div>
    </div>
    <div class="profile-actions" v-if="profile && me">
      <div class="gray-fill-btn" v-if="me.id !== profile.id">
        <img src="/icons/message.svg" alt="open chat" />
        Перейти в чат
      </div>
      <div
        class="red-btn red"
        v-if="me.id !== profile.id"
        @click="goToBlock"
        :class="{ disabled: blockLoading }"
      >
        <img src="/icons/block-red.svg" alt="block-red.svg" />
        {{ isProfileBlocked ? 'Разблокировать' : 'Заблокировать' }}
      </div>
      <div v-else class="red-btn red" @click="goToLogout">
        <img src="/icons/exit-red.svg" alt="exit" />
        Выйти из аккаунта
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 24px;

  & > .icon-btn {
    @include gray-icon-btn;
  }
}
.blocked-by-user {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;

  height: 100%;
  margin-bottom: 50px;

  & > img {
    width: 72px;
    height: 72px;
    opacity: 0.3;
  }
  & > p {
    @include tag-text;
    opacity: 0.6;
    text-align: center;
    width: 80%
  }
}
.form-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
.profile-info {
  display: flex;
  flex-direction: column;
  gap: 24px;

  padding: 0 24px;
}
.profile-info_header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  & > .img-avatar {
    width: 72px !important;
    height: 72px !important;
  }

  & > .profile-header_title {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;

    width: 100%;

    & > h5 {
      @include h5-text;
      font-weight: 600;
      line-height: 100%;
    }
    & > p {
      @include input-text;
      opacity: 0.6;
      line-height: 120%;
    }
  }
}
.profile-info_body {
  display: flex;
  flex-direction: column;

  padding: 6px;
  border-radius: 12px;
  background: $gray-primary;

  & > .body_block {
    display: flex;
    flex-direction: column;
    gap: 4px;

    padding: 8px 12px;

    & > .title-block {
      @include tag-text;
      line-height: 120%;
      font-weight: 500;
      opacity: 0.6;
    }
    & > .info-block {
      @include input-text;
      line-height: 120%;
    }
  }
}
.profile-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 24px;

  & > .gray-fill-btn {
    @include gray-fill-btn;
  }

  & > .red-btn {
    @include inline-btn;
  }
}
</style>
