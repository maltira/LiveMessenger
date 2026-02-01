<script setup lang="ts">
import { useProfileStore } from '@/stores/profile.store.ts'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth.store.ts'
import router from '@/router'
import { onMounted, onUnmounted } from 'vue'

// ? EMIT & PROPS
const emit = defineEmits<{
  close: []
}>()

// ? STORE
const profileStore = useProfileStore()
const { me, selectedProfile } = storeToRefs(profileStore)
const authStore = useAuthStore()
const { Logout } = authStore

// ? HANDLES
const handleClose = () => {
  const myProfileModal = document.getElementById('my-profile-modal')
  if (myProfileModal) {
    myProfileModal.style.opacity = '0'
    myProfileModal.style.transform = 'scale(0.9)'
    myProfileModal.style.top = '50px'
  }

  setTimeout(() => {
    emit('close')
  }, 100)
}
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    handleClose()
  }
}
const handleClickOutside = (event: MouseEvent) => {
  const myProfileModal = document.getElementById('my-profile-modal')
  if (myProfileModal && !myProfileModal.contains(event.target as Node)) {
    handleClose()
  }
}

// ? FUNCTIONS
const goToLogout = async () => {
  await Logout()
  await router.push('/login')
}
const goToMyProfile = () => {
  selectedProfile.value = me.value
  handleClose()
}

onMounted(() => {
  setTimeout(() => {
    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('click', handleClickOutside)
    const myProfileModal = document.getElementById('my-profile-modal')

    if (myProfileModal) {
      myProfileModal.style.opacity = '1'
      myProfileModal.style.transform = 'scale(1)'
      myProfileModal.style.top = '74px'
    }
  }, 1)
})
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="my-profile-modal" id="my-profile-modal">
    <div class="modal-header">
      <img :src="`/img/avatars/${me!.avatar_url}`" alt="avatar" />
      <div class="modal-header_user">
        <p class="full_name">{{ me!.full_name }}</p>
        <p class="user_name">@{{ me!.username }}</p>
      </div>
    </div>
    <div class="divider"></div>
    <div class="modal-link" @click="goToMyProfile">
      <img src="/icons/user.svg" alt="user">
      <p class="link-name">Мой профиль</p>
    </div>
    <div class="modal-link">
      <img src="/icons/moon-inline.svg" alt="dark theme">
      <p class="link-name">Тёмная тема</p>
    </div>
    <div class="divider"></div>
    <div class="modal-link">
      <img src="/icons/settings.svg" alt="settings">
      <p class="link-name">Настройки</p>
    </div>
    <div class="modal-link">
      <img src="/icons/language.svg" alt="lang">
      <p class="link-name">Язык интерфейса</p>
    </div>
    <div class="divider"></div>
    <div class="modal-link">
      <img src="/icons/question-line.svg" alt="question" />
      <p class="link-name">Нужна помощь?</p>
    </div>
    <div class="modal-link logout" @click="goToLogout">
      <img src="/icons/exit.svg" alt="exit">
      <p class="link-name">Выйти из аккаунта</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.my-profile-modal {
  opacity: 0;
  transform: scale(0.9);
  transform-origin: 0 0;

  position: absolute;
  top: 50px;
  left: 12px;
  z-index: 99;

  display: flex;
  flex-direction: column;
  gap: 6px;

  width: 279px;
  padding: 12px 16px;

  background: $white-primary;
  border-radius: 12px;
  border: 1px solid rgba($black-primary, 0.1);
  box-shadow: 4px 4px 24px 0 rgba($black-primary, 0.03);

  transition: 50ms;
}
.divider {
  width: 100%;
  height: 1px;
  background: rgba($black-primary, 0.1);
}
.modal-header {
  display: flex;
  align-items: center;
  gap: 12px;

  padding: 8px 4px;

  & > img {
    width: 42px;
    height: 42px;
  }
  & > .modal-header_user {
    display: flex;
    flex-direction: column;
    gap: 2px;

    & > .full_name {
      @include button-text;
    }
    & > .user_name {
      @include tag-text;
      opacity: 0.6;
    }
  }
}
.modal-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  opacity: 1;
  cursor: pointer;
  border-radius: 6px;

  & > img {
    width: 24px;
    height: 24px;
  }
  & > p {
    @include button-text;
  }

  &:hover {
    opacity: 0.9;
    background-color: $gray-primary;
  }

  &.logout {
    & > p {
      color: $red-color;
    }

    &:hover {
      opacity: 0.9;
      background-color: rgba($red-color, 0.05);
    }
  }
}
</style>
