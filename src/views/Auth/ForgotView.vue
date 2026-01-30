<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Spinner from '@/components/UI/Spinner.vue'
import { useAuthStore } from '@/stores/auth.store.ts'
import { storeToRefs } from 'pinia'
import router from '@/router'
import AuthIcon from '@/components/UI/AuthIcon.vue'
import CodeForm from '@/components/UI/CodeForm.vue'
import ResetForm from '@/components/UI/ResetForm.vue'

// ? STORE
const authStore = useAuthStore()
const { isLoading, error, email, user_id } = storeToRefs(authStore)
const { ForgotPassword } = authStore

// ? REF
const isCodeRequired = ref(false)
const isCodeConfirm = ref(false)

// ? FUNCTIONS
const goToReset = async () => {
  const res = await ForgotPassword(email.value!)

  if (error.value) {
    console.error(error.value.code, error.value.error)
  } else if (res) {
    user_id.value = res.user_id
    isCodeRequired.value = true
  }
}

const closeAllForm = () => {
  isCodeRequired.value = false
  isCodeConfirm.value = false
}
onMounted(() => {
  email.value = ""
})
</script>

<template>
  <div class="login-page">
    <ResetForm
      v-if="isCodeConfirm"
      @close="closeAllForm"
      @ok="router.push('/login')"
    />
    <CodeForm
      v-else-if="isCodeRequired && !isCodeConfirm"
      action="forgot-password"
      @close="isCodeRequired = false"
      @ok="isCodeConfirm = true"
    />
    <div v-else class="login-form">
      <div class="form-title">
        <AuthIcon img="mail.svg"/>
        <div class="text-title">
          <h4>Восстановление пароля</h4>
          <p>Введите ваш email, указанный при регистрации</p>
        </div>
      </div>
      <div class="form-inputs">
        <div class="input-element">
          <p class="input-info">Электронная почта</p>
          <input
            v-model="email"
            required
            type="email"
            placeholder="example@gmail.com"
            :class="{ active: email }"
          />
        </div>
      </div>
      <div class="form-buttons">
        <button class="btn-continue" @click="email ? goToReset() : null" :class="{disabled: !email || isLoading}">
          Продолжить
          <Spinner v-if="isLoading" size="small" color="white"/>
        </button>
        <p class="change-page">Вспомнили пароль? <span @click="router.push('/login')">Войти</span></p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  width: 100%;
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  background: $gray-primary;

  & > .select-language {
    top: 32px;
    right: 50px;
  }
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 36px;
  width: 437px;

  background: $white-primary;
  border-radius: 20px;
  border: 1px solid rgba($black-primary, 0.1);
  padding: 36px 32px;

  & > .form-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;

    & > img {
      width: 28px;
      height: 28px;
    }

    & > .text-title {
      display: flex;
      flex-direction: column;
      gap: 8px;

      & > h4 {
        @include h4-text;
        text-align: center;
      }
      & > p {
        @include input-text;
        text-align: center;
        opacity: 0.6;
      }
    }
  }
}
.form-inputs {
  display: flex;
  flex-direction: column;
  gap: 20px;

  & > .input-element {
    display: flex;
    flex-direction: column;
    gap: 8px;

    & > p.input-info {
      @include tag-text;
      font-weight: 600;
      opacity: 0.6;
    }

    & input {
      @include st-inline-input;
    }
  }
}
.form-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;

  & > .btn-continue {
    @include blue-fill-btn;
  }
  & > .change-page {
    @include tag-text;
    color: rgba($black-primary, 0.6);

    & > span {
      cursor: pointer;
      color: $blue-color;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
