<script setup lang="ts">
import useAuthStore from '@/stores/auth.store.ts'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import router from '@/router'
import Spinner from '@/components/UI/Spinner.vue'
import { useNotification } from '@/composables/useNotifications.ts'
import { formatBirthDate } from '@/utils/DateFormat.ts'

const { infoNotification } = useNotification()
const authStore = useAuthStore()
const { recovery, error, isLoading, user_id } = storeToRefs(authStore)

const goToRecovery = async () => {
  if (recovery.value && user_id.value) {
    await authStore.RecoveryAccount(user_id.value, recovery.value.recovery_token)

    if (error.value) {
      infoNotification('🚫 ' + error.value.error)
      return
    }
    await router.push('/login')
    infoNotification('Аккаунт восстановлен, авторизируйтесь повторно')
  }
}

onMounted(async () => {
  if (!recovery.value) {
    // токена нет
    return router.back()
  }
})
</script>

<template>
  <div class="recovery-page">
    <div class="recovery-form">
      <div class="text-title">
        <h4>
          Ваш аккаунт будет удалён<br>
          {{ recovery?.to_be_deleted_at ? formatBirthDate(recovery?.to_be_deleted_at) : 'null' }}
        </h4>
        <p>А пока вы можете восстановить к нему доступ в любой момент, если передумаете</p>
      </div>
      <button @click="goToRecovery" :class="{ disabled: isLoading }">
        Восстановить аккаунт
        <Spinner v-if="isLoading" size="small" color="white" />
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.recovery-page {
  position: relative;
  width: 100%;
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  background: $gray-primary;
}
.recovery-form {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 437px;

  background: $white-primary;
  border-radius: 20px;
  border: 1px solid rgba($black-primary, 0.1);
  padding: 36px 32px;

  & > .text-title {
    display: flex;
    flex-direction: column;
    gap: 12px;

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

  & > button {
    @include blue-fill-btn;
  }
}
</style>
