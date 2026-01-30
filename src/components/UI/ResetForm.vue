<script setup lang="ts">
import router from '@/router'
import Spinner from '@/components/UI/Spinner.vue'
import AuthIcon from '@/components/UI/AuthIcon.vue'
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store.ts'
import { storeToRefs } from 'pinia'

// ? PROPS & EMIT
const emit = defineEmits<{
  ok: []
  close: []
}>()

// ? STORE
const authStore = useAuthStore()
const { isLoading, error, user_id } = storeToRefs(authStore)
const { ResetPassword } = authStore

// ? REF
const password = ref<string>('')
const passwordConfirm = ref<string>('')
const isPasswordVisible = ref(false)
const isPasswordConfirmVisible = ref(false)

// ? FUNCTIONS
const passwordValid = computed(() => {
  return password.value.length > 7 && password.value === passwordConfirm.value
})

const resetPassword = async () => {
  await ResetPassword({
    user_id: user_id.value!,
    new_password: password.value,
  })

  if (error.value) {
    console.error(error.value.code, error.value.error)
  } else {
    emit("ok")
  }
}
</script>

<template>
  <div class="reset-form">
    <div class="form-title">
      <AuthIcon img="password-lock.svg" />
      <div class="text-title">
        <h4>Придумайте пароль</h4>
        <p>Убедитесь, что не забудете его вновь</p>
      </div>
    </div>
    <div class="form-inputs">
      <div class="input-element">
        <p class="input-info">Новый пароль</p>
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
      <div class="input-element">
        <p class="input-info">Пароль</p>
        <div class="password-input">
          <input
            v-model="passwordConfirm"
            required
            :type="isPasswordConfirmVisible ? 'text' : 'password'"
            placeholder="Повторите пароль"
            minlength="8"
            class="password"
          />
          <img
            :src="isPasswordConfirmVisible ? '/icons/eye-closed.svg' : '/icons/eye-open.svg'"
            alt="visible"
            class="right-side-icon"
            @click="isPasswordConfirmVisible = !isPasswordConfirmVisible"
          />
        </div>
      </div>
    </div>
    <div class="form-buttons">
      <button
        class="btn-continue"
        @click="passwordValid ? resetPassword() : null"
        :class="{ disabled: !passwordValid || isLoading }"
      >
        Изменить пароль
        <Spinner v-if="isLoading" size="small" color="white" />
      </button>
      <button class="btn-back" @click="emit('close')">Вернуться назад</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.reset-form {
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
  gap: 12px;
  width: 100%;

  & > .btn-continue {
    @include blue-fill-btn;
  }
  & > .btn-back {
    @include gray-inline-btn;
  }
}
</style>
