<script setup lang="ts">
import { useProfileStore } from '@/stores/profile.store.ts'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useNotification } from '@/composables/useNotifications.ts'
import AuthIcon from '@/components/UI/AuthIcon.vue'
import Spinner from '@/components/UI/Spinner.vue'
import CodeForm from '@/components/Forms/Auth/CodeForm.vue'
import useAuthStore from '@/stores/auth.store.ts'

// ? STORE
const { infoNotification } = useNotification()
const profileStore = useProfileStore()
const { isSettingsOpen, isChangeMailOpen } = storeToRefs(profileStore)
const authStore = useAuthStore()
const { error, isLoading } = storeToRefs(authStore)

// ? FUNCTIONS
const handleClose = () => {
  if (mailChangeElement.value) {
    mailChangeElement.value.style.transform = 'scale(0.97)'
    mailChangeElement.value.style.opacity = '0'
  }

  setTimeout(() => {
    isChangeMailOpen.value = false
    isSettingsOpen.value = true
  }, 100)
}

const okAction = async () => {
  if (authStore.me) authStore.me.email = email.value
  infoNotification("✅ Почта была успешно изменена!")
  handleClose()
}
const confirmMail = async () => {
  if (email.value === authStore.me?.email) {
    infoNotification("🚫 Новый адрес совпадает с текущим")
    return
  }
  if (email.value && email.value.includes('@')) {
    await authStore.ChangeMail(email.value)

    if (error.value) {
      infoNotification("🚫 Ошибка: " + error.value.error)
      return
    }
    isCodeRequired.value = true

    setTimeout(() => {
      codeElement.value = document.getElementById("change-mail-code")

      if (codeElement.value) {
        codeElement.value.style.opacity = '1'
        codeElement.value.style.transform = 'scale(1)'
      }
    }, 1)
  } else {
    infoNotification("🚫 Ошибка: укажите верную почту")
  }
}
const backToEmail = () => {
  if (codeElement.value) {
    codeElement.value.style.opacity = '0'
    codeElement.value.style.transform = 'scale(0.97)'
  }
  setTimeout(() => {
    isCodeRequired.value = false
  }, 100)
}

// ? REFS
const mailChangeElement = ref<HTMLElement | null>(null)
const codeElement = ref<HTMLElement | null>(null)

const isCodeRequired = ref(false)
const email = ref<string>("")

onMounted(async () => {
  setTimeout(() => {
    mailChangeElement.value = document.getElementById('mail-change')
    if (mailChangeElement.value) {
      mailChangeElement.value.style.transform = 'scale(1)'
      mailChangeElement.value.style.opacity = '1'
    }
  }, 1)
})
</script>

<template>
  <div class="form-header">
    <div class="icon-btn" @click="handleClose">
      <img src="/icons/arrow.svg" alt="back" />
    </div>
  </div>

  <div id="mail-change" class="mail-change">
    <CodeForm
      id="change-mail-code"
      v-if="isCodeRequired"
      action="change-mail"
      :email="email"
      @close="backToEmail"
      @ok="okAction"
      :style="{width: '100%', padding: 0, border: 'none'}"
    />
    <div v-else class="login-form">
      <div class="form-title">
        <AuthIcon img="mail.svg"/>
        <div class="text-title">
          <h4>Укажите новый адрес</h4>
          <p>После изменения коды подтверждения будут приходить на новый адрес</p>
        </div>
      </div>
      <input
        v-model="email"
        required
        type="email"
        placeholder="example@gmail.com"
        :class="{ active: email }"
      />
      <button class="btn-continue" @click="email ? confirmMail() : null" :class="{disabled: !email || isLoading}">
        Продолжить
        <Spinner v-if="isLoading" size="small" color="white"/>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
#change-mail-code {
  opacity: 0;
  transform: scale(0.97);
}
.form-header {
  position: absolute;
  z-index: 2;

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
.mail-change {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;

  opacity: 0;
  transform: scale(0.97);

  height: 100%;

  padding: 0 24px;
}
.login-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  width: 100%;

  & > .form-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    width: 100%;

    & > .text-title {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;

      & > h4 {
        @include h4-text;
        text-align: center;
      }
      & > p {
        @include input-text;
        opacity: 0.6;
        text-align: center;
      }
    }
  }
  & > input {
    @include st-inline-input;
  }
  & > .btn-continue {
    @include blue-fill-btn;
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
