<script setup lang="ts">
import Spinner from '@/components/UI/Spinner.vue'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store.ts'
import { storeToRefs } from 'pinia'
import { useOtpTimer } from '@/composables/useOtpTimer.ts'
import AuthIcon from '@/components/UI/AuthIcon.vue'
import { useNotification } from '@/composables/useNotifications.ts'

// ? PROPS & EMIT
interface Props {
  action: "login" | "register" | "forgot-password"
}
const props = defineProps<Props>()
const emit = defineEmits<{
  ok: []
  close: []
}>()

// ? STORE
const { infoNotification } = useNotification()
const { timeLeft, isActive, start } = useOtpTimer(30)
const authStore = useAuthStore()
const { isLoading, error, email, user_id } = storeToRefs(authStore)
const { VerifyOTP, ResendOTP } = authStore

// ? REF
const code = ref<Array<string>>(new Array(6).fill(''))
const inputs = ref<HTMLInputElement[]>([])

// ? FUNCTIONS
const codeIsComplete = computed(() => code.value.every((v) => v.length === 1))

function handleInput(index: number, e: Event) {
  const input = e.target as HTMLInputElement
  let value = input.value.trim()

  if (value && !/^\d$/.test(value)) {
    code.value[index] = ''
    return
  }

  code.value[index] = value

  if (value.length === 1) {
    if (index < 5)
      nextTick(() => {
        inputs.value[index + 1]?.focus()
      })
    else {
      inputs.value[index]?.blur()
    }
  }
}

function handleKeyDown(index: number, e: KeyboardEvent) {
  if (e.key === 'Backspace' || e.key === 'Delete') {
    code.value[index] = ''
    if (index > 0) {
      e.preventDefault()
      nextTick(() => {
        inputs.value[index - 1]?.focus()
      })
    }
  }
}

function handlePaste(e: ClipboardEvent, index: number) {
  e.preventDefault()
  const paste = (e.clipboardData?.getData('text') || '').replace(/\D/g, '')

  if (!paste) return

  let pos = index
  for (let char of paste) {
    if (pos >= 6) break
    code.value[pos] = char
    pos++
  }
  nextTick(() => {
    const lastFilled = Math.min(pos - 1, 5)
    inputs.value[0]?.blur()
    if (pos >= 6) {
      inputs.value[5]?.blur()
    } else {
      inputs.value[lastFilled]?.focus()
    }
  })
}

const goToResend = async () => {
  if (!isActive.value) {
    await ResendOTP(user_id.value!, email.value!)

    if (error.value) {
      infoNotification("🚫 Ошибка. " + error.value)
      return
    }
    start()
  }
}

const goToVerifyOTP = async () => {
  await VerifyOTP({
    user_id: user_id.value!,
    code: code.value.join(""),
    action: props.action
  })

  if (error.value) {
    infoNotification("🚫 Ошибка. " + error.value)
  } else {
    emit("ok")
  }
}

onMounted(() => {
  start()
  if (inputs.value[0]) {
    inputs.value[0].focus()
  }
})
</script>

<template>
  <div class="otp-form">
    <div class="form-title">
      <AuthIcon img="send.svg" />
      <div class="text-title">
        <h4>Подтверждение почты</h4>
        <p>Мы отправили код подтверждения на <span style="font-weight: 600">{{ email }}</span></p>
      </div>
    </div>
    <div class="form-inputs">
      <input
        v-for="(digit, i) in code"
        :key="i"
        ref="inputs"
        class="code-elem"
        type="text"
        inputmode="numeric"
        maxlength="1"
        autocomplete="one-time-code"
        :value="digit"
        placeholder="_"
        @input="handleInput(i, $event)"
        @keydown="handleKeyDown(i, $event)"
        @paste="handlePaste($event, i)"
      />
    </div>
    <div class="form-buttons">
      <div>
        <button
          class="btn-continue"
          @click="codeIsComplete ? goToVerifyOTP() : null"
          :class="{ disabled: !codeIsComplete || isLoading }"
        >
          Подтвердить
          <Spinner v-if="isLoading" size="small" color="white" />
        </button>
        <button class="btn-back" @click="emit('close')">Вернуться назад</button>
      </div>
      <p class="send-code">
        Код не пришёл?
        <span @click="goToResend" :class="{ active: !isActive }">
            {{ !isActive ? 'Отправить снова' : `${timeLeft}с` }}
          </span>
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.otp-form {
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
        text-align: center;
        opacity: 0.6;
      }
    }
  }
}
.form-inputs {
  display: flex;
  gap: 10px;
  justify-content: space-between;
  width: 100%;

  & > .left,
  .right {
    display: flex;
    gap: 14px;
  }
  & .code-elem {
    @include code-input;
  }
}
.form-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;

  & > div {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;

    & > .btn-continue {
      @include blue-fill-btn;
    }
    & > .btn-back {
      @include inline-btn;
    }
  }
  & > .send-code {
    @include tag-text;
    color: rgba($black-primary, 0.6);

    & > span {
      &.active {
        cursor: pointer;
        color: $blue-color;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
