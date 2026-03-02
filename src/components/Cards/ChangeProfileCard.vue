<script setup lang="ts">
import { useProfileStore } from '@/stores/profile.store.ts'
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { UpdateProfileRequest } from '@/types/profile/dto/profile.dto.ts'
import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { useNotification } from '@/composables/useNotifications.ts'
import Spinner from '@/components/UI/Spinner.vue'

const { infoNotification } = useNotification()
const profileStore = useProfileStore()
const { me, isChangeProfileOpen, error, isLoading, selectedProfile } = storeToRefs(profileStore)

// ? REF
const changeProfileContent = ref<HTMLElement | null>(null)
const fullName = ref<string>('')
const username = ref<string>('')
const bio = ref<string>('')
const birthDate = ref<Date | null>(null)

const avatarFile = ref<File | null>(null)
const avatarPreview = ref<string | null>(null)
const isUploadingAvatar = ref<boolean>(false)
const fileInputRef = ref<HTMLInputElement | null>(null)
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png']
type ImgBBResponse = {
  data: {
    id: string
    url: string
  }
}

// ? FUNCTIONS
const handleClose = () => {
  if (changeProfileContent.value) {
    changeProfileContent.value.style.transform = 'scale(0.97)'
    changeProfileContent.value.style.opacity = '0'
  }

  setTimeout(() => {
    isChangeProfileOpen.value = false
    selectedProfile.value = me.value
  }, 100)
}
const handleAvatarFile = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  // Валидация
  if (!ALLOWED_TYPES.includes(file.type)) {
    infoNotification('Допустимые форматы: JPG, JPEG и PNG')
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    infoNotification(`Файл слишком большой. Максимальный размер: 5 MB`)
    return
  }

  avatarPreview.value = URL.createObjectURL(file)
  avatarFile.value = file
}
const goToSave = async () => {
  if (canSave.value && me.value) {
    // Сначала загружаем аватар на сервер
    isUploadingAvatar.value = true
    let res: ImgBBResponse | null = null
    if (avatarFile.value && avatarPreview.value) {
      const formData = new FormData()
      formData.append('image', avatarFile.value)
      formData.append('key', '493edcd16bddbcf5ec0a7a6983c398bd')

      const r = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body: formData })
      res = await r.json()
    }
    isUploadingAvatar.value = false

    // Обновляем пользователя
    const req: UpdateProfileRequest = {
      birth_date_is_set: me.value.birth_date !== birthDate.value
    }

    if (fullName.value !== me.value.full_name) req.full_name = fullName.value
    if (username.value !== me.value.username) req.username = username.value
    if (bio.value !== me.value.bio) req.bio = bio.value
    if (birthDate.value !== me.value.birth_date) req.birth_date = birthDate.value
    if (avatarFile.value && avatarPreview.value && res) {
      req.avatar_url = res.data.url
    }

    await profileStore.UpdateProfile(req)

    if (error.value) {
      infoNotification(error.value.error)
    } else {
      infoNotification("Изменения успешно сохранены")
    }
  }
}
const triggerFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}
const removeFile = () => {
  if (avatarPreview.value) {
    URL.revokeObjectURL(avatarPreview.value!)
    avatarPreview.value = null
  }
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
  avatarFile.value = null
}

// ? COMPUTED
const canSave = computed(() => {
  return me.value &&
    (me.value.full_name !== fullName.value && fullName.value.length > 3 ||
    me.value.username !== username.value && username.value.length > 3 ||
    me.value.bio !== bio.value ||
    me.value.birth_date !== birthDate.value ||
    avatarFile.value && me.value.avatar_url !== avatarFile.value?.name)
})

onMounted(() => {
  if (me.value) {
    fullName.value = me.value.full_name
    username.value = me.value.username
    bio.value = me.value.bio
    birthDate.value = me.value.birth_date || null
  }
  setTimeout(() => {
    changeProfileContent.value = document.getElementById('change-profile-content')
    if (changeProfileContent.value) {
      changeProfileContent.value.style.transform = 'scale(1)'
      changeProfileContent.value.style.opacity = '1'
    }
  }, 1)
})
onUnmounted(() => {
  if (avatarPreview.value) URL.revokeObjectURL(avatarPreview.value)
})
</script>

<template>
  <div class="form-header">
    <div class="icon-btn" @click="handleClose">
      <img src="/icons/arrow.svg" alt="back" />
    </div>
  </div>

  <div id="change-profile-content" class="form-content" v-if="me">
    <div class="profile-info">
      <div class="profile-info_header">
        <div class="avatar-container">
          <div class="set-avatar" @click="avatarPreview ? removeFile() : triggerFileInput()" :class="{disabled: isUploadingAvatar}">
            <img :src="avatarPreview ? '/icons/delete-outline-black.svg' : `/icons/add-photo.svg`" alt="add" />
            <Spinner v-if="isUploadingAvatar" size="small"/>
          </div>
          <img class="img-avatar" :src="avatarPreview || me.avatar_url" alt="avatar" />
          <input
            ref="fileInputRef"
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            style="display: none"
            @change="handleAvatarFile"
          >
        </div>
        <div class="profile-header_title">
          <h5>{{ me.full_name }}</h5>
          <p>@{{ me.username }}</p>
        </div>
      </div>
      <div class="profile-info_body">
        <div class="input-element">
          <p class="input-info">Ваше имя</p>
          <input
            v-model="fullName"
            type="text"
            placeholder="Укажите имя"
            :class="{ active: fullName }"
            maxlength="100"
          />
        </div>
        <div class="input-element">
          <p class="input-info">Имя пользователя</p>
          <div class="username-input">
            <p class="dog">@</p>
            <input
              v-model="username"
              type="text"
              placeholder="Укажите имя пользователя"
              :class="{ active: username }"
              maxlength="50"
            />
          </div>
          <p class="footer-info">
            По имени пользователя другие люди смогут находить вас и связываться с вами
          </p>
        </div>
        <div class="input-element">
          <p class="input-info">О себе</p>
          <input v-model="bio" maxlength="500" type="text" placeholder="Ваша биография" :class="{ active: bio }" />
        </div>
        <div class="input-element date-input">
          <p class="input-info">Дата рождения</p>
          <VueDatePicker
            v-model="birthDate"
            placeholder="Дата рождения"
            :formats="{ input: 'yyyy-MM-dd' }"
            :maxDate="new Date()"
            :time-config="{ enableTimePicker: false }"
            auto-apply
          />
        </div>
      </div>
    </div>
    <div
      class="gray-fill-btn"
      :class="{disabled: !canSave || isLoading || isUploadingAvatar}"
      @click="goToSave"
    >
      Сохранить изменения
      <Spinner v-if="isLoading || isUploadingAvatar" size="small"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.form-header {
  display: flex;
  align-items: center;
  gap: 24px;

  padding: 0 24px;

  & > .icon-btn {
    @include gray-icon-btn;
  }
}
.form-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  height: 100%;

  padding: 0 24px;

  opacity: 0;
  transform: scale(0.97);

  & > .profile-info {
    display: flex;
    flex-direction: column;
    gap: 16px;

    & > .profile-info_header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;

      & > .avatar-container {
        & > .img-avatar {
          width: 72px !important;
          height: 72px !important;
          border-radius: 100%;
        }
        & > .set-avatar {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 72px !important;
          height: 72px !important;
          background: rgba($white-primary, 0.7);
          border-radius: 99px;
          opacity: 0;
          cursor: pointer;

          & > img {
            width: 28px;
            height: 28px;
            opacity: 0.8;
          }

          &:hover {
            opacity: 1;
          }
          &.disabled {
            opacity: 1;
            pointer-events: none;
            & > img {
              display: none;
            }
          }
        }
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
    & > .profile-info_body {
      display: flex;
      flex-direction: column;
      gap: 16px;

      & > .input-element {
        display: flex;
        flex-direction: column;
        align-items: end;
        gap: 8px;

        & > p {
          @include tag-text;
          font-weight: 500;
          opacity: 0.6;
          line-height: 120%;

          width: 100%;

          &.footer-info {
            font-weight: 400;
          }
        }
        & input {
          @include st-inline-input;
          width: 100%;
        }
      }
    }
  }
  & > .gray-fill-btn {
    @include gray-fill-btn;
  }
}
.username-input {
  position: relative;
  width: 100%;
  & > input {
    padding-left: 36px !important;
  }
  & > p {
    @include input-text;
    line-height: 120%;

    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    cursor: default;
    z-index: 2;
    opacity: 0.6;
    pointer-events: none;
  }
}
</style>
