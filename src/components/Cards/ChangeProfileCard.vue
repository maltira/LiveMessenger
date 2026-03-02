<script setup lang="ts">
import { useProfileStore } from '@/stores/profile.store.ts'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'

const profileStore = useProfileStore()
const { me, isChangeProfileOpen } = storeToRefs(profileStore)

const changeProfileContent = ref<HTMLElement | null>(null)
const fullName = ref<string>('')
const username = ref<string>('')
const bio = ref<string>('')
const birthDate = ref<Date | null>(null)

// ? FUNCTIONS
const handleClose = () => {
  if (changeProfileContent.value) {
    changeProfileContent.value.style.transform = 'scale(0.97)'
    changeProfileContent.value.style.opacity = '0'
  }

  setTimeout(() => {
    isChangeProfileOpen.value = false
  }, 100)
}

onMounted(() => {
  if (me.value) {
    fullName.value = me.value.full_name
    username.value = me.value.username
    bio.value = me.value.bio
    birthDate.value = me.value.birth_date
  }
  setTimeout(() => {
    changeProfileContent.value = document.getElementById("change-profile-content")
    if (changeProfileContent.value) {
      changeProfileContent.value.style.transform = 'scale(1)'
      changeProfileContent.value.style.opacity = '1'
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

  <div id="change-profile-content" class="form-content" v-if="me">
    <div class="profile-info">
      <div class="profile-info_header">
        <div class="avatar-container">
          <div class="set-avatar">
            <img src="/icons/add-photo.svg" alt="add">
          </div>
          <img class="img-avatar" :src="`/img/avatars/${me.avatar_url}`" alt="avatar" />
        </div>
        <div class="profile-header_title">
          <h5>{{ me.full_name }}</h5>
          <p>@{{ me.username }}</p>
        </div>
      </div>
      <div class="profile-info_body">
        <div class="input-element">
          <p class="input-info">Ваше имя</p>
          <input v-model="fullName" type="text" placeholder="Укажите имя" :class="{ active: fullName }" />
        </div>
        <div class="input-element">
          <p class="input-info">Имя пользователя</p>
          <div class="username-input">
            <p class="dog">@</p>
            <input v-model="username" type="text" placeholder="Укажите имя пользователя" :class="{ active: username }" />
          </div>
          <p class="footer-info">По имени пользователя другие люди смогут находить вас и связываться с вами</p>
        </div>
        <div class="input-element">
          <p class="input-info">О себе (необязательно)</p>
          <input v-model="bio" type="text" placeholder="Ваша биография" :class="{ active: bio }" />
        </div>
        <div class="input-element date-input">
          <p class="input-info">Дата рождения (необязательно)</p>
          <input v-model="birthDate" type="date" placeholder="Дата рождения" :class="{ active: birthDate }" />
        </div>
      </div>
    </div>
    <div class="gray-fill-btn">Сохранить изменения</div>
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

        &.date-input{
          & > input {

          }
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
