<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store.ts'
import router from '@/router'
import { useProfileStore } from '@/stores/profile.store.ts'
import { storeToRefs } from 'pinia'

const profileStore = useProfileStore()
const { me } = storeToRefs(profileStore)

const authStore = useAuthStore()
const { Logout } = authStore

const goToLogout = async () => {
  await Logout()
  await router.push('/login')
}
</script>


<template>
  <h1>Привет, {{ me?.username }}</h1>
  <button @click="goToLogout">Выйти</button>
</template>

<style scoped></style>
