<script setup lang="ts">
import Spinner from '@/components/UI/Spinner.vue'
import useAuthStore from '@/stores/auth.store.ts'
import { storeToRefs } from 'pinia'
import { useProfileStore } from '@/stores/profile.store.ts'
import { onMounted, onUnmounted, ref } from 'vue'
import CodeForm from '@/components/Forms/Auth/CodeForm.vue'
import router from '@/router'
import { useNotification } from '@/composables/useNotifications.ts'

const { infoNotification } = useNotification()
const authStore = useAuthStore()
const { me, isLoading, error } = storeToRefs(authStore)
const profileStore = useProfileStore()
const { isDeleteModalOpen } = storeToRefs(profileStore)

const containerEl = ref<HTMLElement | null>(null)
const modalEl = ref<HTMLElement | null>(null)
const codeConfirm = ref<HTMLElement | null>(null)
const isCodeRequired = ref<boolean>(false)

const handleClose = () => {
  if (containerEl.value && modalEl.value) {
    containerEl.value!.style.opacity = '0'
    modalEl.value!.style.opacity = '0'
    modalEl.value!.style.transform = 'scale(0.9)'
    if (codeConfirm.value) {
      codeConfirm.value.style.opacity = '0'
      codeConfirm.value.style.transform = 'scale(0.9)'
    }
  }
  setTimeout(() => {
    isDeleteModalOpen.value = false
    isCodeRequired.value = false
  }, 100)
}
const handleClickOutside = (event: MouseEvent) => {
  if (modalEl.value && !modalEl.value.contains(event.target as Node) && !codeConfirm.value!.contains(event.target as Node)) {
    handleClose()
  }
}
const goToConfirm = async () => {
  if (me.value) {
    const res = await authStore.DeleteAccount(me.value.email)

    if (!res && error.value) {
      infoNotification("🚫 " + error.value.error)
      return
    }

    if (modalEl.value) {
      modalEl.value!.style.opacity = '0'
      modalEl.value!.style.transform = 'scale(0.9)'
    }
    setTimeout(() => {
      isCodeRequired.value = true
    }, 100)
    setTimeout(() => {
      codeConfirm.value = document.getElementById('code-confirm-delete')
      codeConfirm.value!.style.opacity = '1'
      codeConfirm.value!.style.transform = 'scale(1)'
    }, 100)
  }
}
const okAction = async () => {
  handleClose()
  await router.push('/login')
  infoNotification("🕑 Аккаунт будет удалён через 3 дня")
}

onMounted(() => {
  containerEl.value = document.getElementById('delete-account-container')
  modalEl.value = document.getElementById('delete-account-modal')

  if (containerEl.value && modalEl.value) {
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
      containerEl.value!.style.opacity = '1'
      modalEl.value!.style.opacity = '1'
      modalEl.value!.style.transform = 'scale(1)'
    }, 1)
  }
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div id="delete-account-container">
    <CodeForm
      id="code-confirm-delete"
      v-if="isCodeRequired"
      action="delete-account"
      @close="handleClose"
      @ok="okAction"
    />
    <div id="delete-account-modal" v-else>
      <div class="title">
        <h5>Удалить аккаунт?</h5>
        <div class="icon-btn" @click="handleClose">
          <img src="/icons/close.svg" alt="close" />
        </div>
      </div>
      <p class="text">
        Процесс удаления займет 3 дня, в течение которых вы сможете восстановить доступ
      </p>
      <div class="actions">
        <button class="btn-cancel" @click="handleClose">Отмена</button>
        <button class="btn-delete" :class="{ disabled: isLoading }" @click="goToConfirm">
          Удалить
          <Spinner v-if="isLoading" size="small" color="white" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#code-confirm-delete {
  opacity: 0;
  transform: scale(0.9);
}
#delete-account-container {
  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  background: rgba($black-primary, 0.05);
  opacity: 0;

  width: 100%;
  height: 100vh;
}
#delete-account-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;

  width: 424px;
  opacity: 0;
  scale: 0.9;

  background: $white-primary;
  border-radius: 20px;
  padding: 28px;
  border: 1px solid rgba($black-primary, 0.1);

  box-shadow: 0 0 32px 0 rgba($black-primary, 0.07);
}
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;

  & > h5 {
    @include h5-text;
  }
  & > .icon-btn {
    @include gray-icon-btn;
  }
}
.text {
  @include input-text;
  opacity: 0.6;
}
.actions {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;

  & > .btn-cancel {
    @include blue-fill-btn;
  }
  & > .btn-delete {
    @include gray-fill-btn;
  }
}
</style>
