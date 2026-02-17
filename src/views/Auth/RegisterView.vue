<script setup lang="ts">
import { ref } from 'vue'
import Spinner from '@/components/UI/Spinner.vue'
import { useAuthStore } from '@/stores/auth.store.ts'
import { storeToRefs } from 'pinia'
import router from '@/router'
import AuthIcon from '@/components/UI/AuthIcon.vue'
import CodeForm from '@/components/Forms/Auth/CodeForm.vue'
import SelectLanguage from '@/components/Buttons/SelectLanguage.vue'
import { useNotification } from '@/composables/useNotifications.ts'

// ? STORE
const { infoNotification } = useNotification()
const authStore = useAuthStore()
const { isLoading, error, email, password, user_id } = storeToRefs(authStore)
const { Register } = authStore

// ? REF
const isCodeRequired = ref(false)
const isPasswordVisible = ref(false)

// ? FUNCTIONS
const goToRegister = async () => {
  const res = await Register({
    email: email.value!,
    password: password.value!,
  })

  if (error.value) {
    infoNotification("🚫 Ошибка. " + error.value.error)
  } else if (res) {
    user_id.value = res.user_id
    isCodeRequired.value = true
  }
}

const okAction = () => {
  infoNotification("👋 Добро пожаловать в Лайв!")
  router.push('/chat')
}
</script>

<template>
  <div class="login-page">
    <CodeForm
      v-if="isCodeRequired"
      action="register"
      @close="isCodeRequired = false"
      @ok="okAction"
    />
    <div v-else class="login-form">
      <div class="form-title">
        <AuthIcon img="shine.svg"/>
        <div class="text-title">
          <h4>Новый аккаунт в Лайв</h4>
          <p>Создай аккаунт и начни общаться</p>
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
        <div class="input-element">
          <p class="input-info">Придумайте пароль</p>
          <div class="password-input">
            <input
              v-model="password"
              required
              :type="isPasswordVisible ? 'text' : 'password'"
              placeholder="Минимум 8 символов"
              minlength="8"
              class="password"
            />
            <img
              :src="isPasswordVisible ? '/icons/eye-closed.svg' : '/icons/eye-open.svg'"
              alt="visible"
              class="right-side-icon"
              @click="isPasswordVisible = !isPasswordVisible"
            />
          </div>
        </div>
      </div>
      <div class="form-buttons">
        <div class="button-and-privacy">
          <button class="btn-continue" @click="email && password ? goToRegister() : null" :class="{disabled: !(email && password) || isLoading}">
            Продолжить
            <Spinner v-if="isLoading" size="small" color="white"/>
          </button>
          <p class="privacy-confirm">
            Создавая аккаунт, вы соглашаетесь с <a href="#">условиями использования</a> и <a href="#">политикой конфиденциальности</a>
          </p>
        </div>
        <div class="divider"></div>
        <p class="change-page">Уже есть аккаунт? <span @click="router.push('/login')">Войти</span></p>
      </div>
    </div>

    <SelectLanguage/>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  position: relative;
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
      font-weight: 500;
      opacity: 0.6;
    }

    & input {
      @include st-inline-input;
    }
  }
}
.password-input {
  position: relative;

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
.form-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;

  & > .button-and-privacy {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;

    & > .btn-continue {
      @include blue-fill-btn;
    }

    & > .privacy-confirm {
      @include tag-text;
      color: rgba($black-primary, 0.6);
      text-align: center;

      & > a {
        color: $blue-color;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  & > .divider {
    width: 100%;
    height: 1px;
    background: $black-primary;
    opacity: 0.1;
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
