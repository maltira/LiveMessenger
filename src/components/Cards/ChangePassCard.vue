<script setup lang="ts">
import { useProfileStore } from '@/stores/profile.store.ts'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useNotification } from '@/composables/useNotifications.ts'
import AuthIcon from '@/components/UI/AuthIcon.vue'
import Spinner from '@/components/UI/Spinner.vue'
import CodeForm from '@/components/Forms/Auth/CodeForm.vue'
import useAuthStore from '@/stores/auth.store.ts'
import router from '@/router'

// ? STORE
const { infoNotification } = useNotification()
const profileStore = useProfileStore()
const { isSettingsOpen, isChangePassOpen } = storeToRefs(profileStore)
const authStore = useAuthStore()
const { error, isLoading } = storeToRefs(authStore)

// ? FUNCTIONS
const handleClose = () => {
  if (passChangeElement.value) {
    passChangeElement.value.style.transform = 'scale(0.97)'
    passChangeElement.value.style.opacity = '0'
  }

  setTimeout(() => {
    isChangePassOpen.value = false
    isSettingsOpen.value = true
  }, 100)
}

const okAction = async () => {
  await authStore.Logout()
  await router.push('/login')
  infoNotification("✅ Пароль был успешно изменен, повторите вход")
  handleClose()
}
const confirmPass = async () => {
  if (pass1.value.trim() === pass2.value.trim()) {
    infoNotification("🚫 Пароли не должны совпадать")
    return
  }
  if (pass2.value.trim().length >= 8) {
    await authStore.ChangePass(pass1.value, pass2.value)

    if (error.value) {
      infoNotification("🚫 Ошибка: " + error.value.error)
      return
    }
    isCodeRequired.value = true

    setTimeout(() => {
      codeElement.value = document.getElementById("change-pass-code")

      if (codeElement.value) {
        codeElement.value.style.opacity = '1'
        codeElement.value.style.transform = 'scale(1)'
      }
    }, 1)
  } else {
    infoNotification("🚫 Длина пароля должна быть не менее 8 символов")
  }
}
const backToPass = () => {
  if (codeElement.value) {
    codeElement.value.style.opacity = '0'
    codeElement.value.style.transform = 'scale(0.97)'
  }
  setTimeout(() => {
    isCodeRequired.value = false
  }, 100)
}

// ? REFS
const passChangeElement = ref<HTMLElement | null>(null)
const codeElement = ref<HTMLElement | null>(null)

const isCodeRequired = ref(false)
const pass1 = ref<string>("")
const isPass1Visible = ref(false)
const pass2 = ref<string>("")
const isPass2Visible = ref(false)

onMounted(async () => {
  setTimeout(() => {
    passChangeElement.value = document.getElementById('pass-change')
    if (passChangeElement.value) {
      passChangeElement.value.style.transform = 'scale(1)'
      passChangeElement.value.style.opacity = '1'
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

  <div id="pass-change" class="pass-change">
    <CodeForm
      id="change-pass-code"
      v-if="isCodeRequired"
      action="change-pass"
      :pass_ch="pass2"
      @close="backToPass"
      @ok="okAction"
      :style="{width: '100%', padding: 0, border: 'none'}"
    />
    <div v-else class="login-form">
      <div class="form-title">
        <AuthIcon img="lock.svg"/>
        <div class="text-title">
          <h4>Изменить пароль</h4>
          <p>Укажите старый пароль, чтобы подтвердить изменение</p>
        </div>
      </div>
      <div class="password-input">
        <input
          v-model="pass1"
          required
          :type="isPass1Visible ? 'text' : 'password'"
          placeholder="Укажите старый пароль"
          minlength="8"
          class="password"
        />
        <img
          :src="isPass1Visible ? '/icons/eye-closed.svg' : '/icons/eye-open.svg'"
          alt="visible"
          class="right-side-icon"
          @click="isPass1Visible = !isPass1Visible"
        />
      </div>
      <div class="password-input" >
        <input
          v-model="pass2"
          required
          :type="isPass2Visible ? 'text' : 'password'"
          placeholder="Укажите новый пароль"
          minlength="8"
          class="password"
        />
        <img
          :src="isPass2Visible ? '/icons/eye-closed.svg' : '/icons/eye-open.svg'"
          alt="visible"
          class="right-side-icon"
          @click="isPass2Visible = !isPass2Visible"
        />
      </div>
      <button class="btn-continue" @click="pass2.length > 7 && pass1.length > 7 ? confirmPass() : null" :class="{disabled: pass2.length < 8 || pass1.length < 8 || isLoading}">
        Продолжить
        <Spinner v-if="isLoading" size="small" color="white"/>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
#change-pass-code {
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
.pass-change {
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
  & input {
    @include st-inline-input;

    &::-ms-reveal {
      width : 0;
      height: 0;
    }
    &::-ms-clear {
      width : 0;
      height: 0;
    }
  }
  & > .btn-continue {
    @include blue-fill-btn;
  }
}
.password-input {
  position: relative;
  width: 100%;

  & > img {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    z-index: 2;
    opacity: 0.4;

    &:hover {
      opacity: 0.5;
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
