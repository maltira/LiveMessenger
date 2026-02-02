<script setup lang="ts">
import MyProfileModal from '@/components/Modals/MyProfileModal.vue'
import ProfileItemCard from '@/components/Cards/ProfileItemCard.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useProfileStore } from '@/stores/profile.store.ts'
import { useNotification } from '@/composables/useNotifications.ts'
import Skeleton from '@/components/UI/Skeleton.vue'
import { useOnlineStore } from '@/stores/online.store.ts'

// ? STORE
const { infoNotification } = useNotification()
const profileStore = useProfileStore()
const { isSearching, error, search, selectedProfile, findingProfiles } = storeToRefs(profileStore)
const { FetchBySearch } = profileStore
const searchElement = ref<HTMLElement | null>(null)
const onlineStore = useOnlineStore()
const { onlineProfiles } = storeToRefs(onlineStore)
const { fetchProfileOnline } = onlineStore

// ? REF
const isProfileModalOpen = ref(false)

// ? FUNCTIONS
const fetchProfiles = async (value: string) => {
  findingProfiles.value = (await FetchBySearch(value, 5)) || []

  if (error.value) {
    infoNotification('🚫 Ошибка. ' + error.value)
  }
}
const isAddHide = computed(() => {
  return search.value || (searchElement.value && document.activeElement === searchElement.value)
})
const isFetchingStatus = ref(false)

const isLoading = computed(() => {
  return isSearching.value || isFetchingStatus.value
})

watch(search, (value) => {
  if (value.length < 4) {
    findingProfiles.value = []
  } else {
    isSearching.value = true
    isFetchingStatus.value = true

    setTimeout(async () => {
      await fetchProfiles(value)
      for (const profile of findingProfiles.value) {
        await fetchProfileOnline(profile.id)
      }
      isFetchingStatus.value = false
    }, 300)

  }
})
onMounted(async() => {
  searchElement.value = document.getElementById('search-input')
})
</script>

<template>
  <div class="form-header">
    <div class="icon-btn" @click="isProfileModalOpen = true">
      <img src="/icons/menu.svg" alt="menu" />
    </div>
    <div id="search-input" class="search-input" :class="{ active: search }">
      <input type="text" id="chat-search" autocomplete="off" v-model="search" placeholder="Поиск" />
      <img src="/icons/close.svg" alt="clear-search" class="right-side-icon" @click="search = ''" />
    </div>
    <div class="icon-btn" v-if="!isAddHide">
      <img src="/icons/add.svg" alt="add" />
    </div>
  </div>
  <div v-if="search" class="search-data">
    <div v-if="isLoading" class="found-data skeleton">
      <Skeleton v-for="i in 5" :key="i" width="414px" height="64px"/>
    </div>
    <div v-else-if="findingProfiles.length > 0" class="found-data">
      <ProfileItemCard v-for="p in findingProfiles" :profile="p" @click="selectedProfile = p"/>
    </div>
    <p v-else class="empty-data">Ничего не найдено</p>
  </div>
  <div v-else class="chat-data">
    <p class="empty-data">Здесь пока что пусто</p>
  </div>

  <MyProfileModal v-if="isProfileModalOpen" @close="isProfileModalOpen = false" />
</template>

<style scoped lang="scss">
.form-header {
  display: flex;
  align-items: center;
  gap: 12px;

  padding: 0 24px;

  & > .icon-btn {
    @include gray-icon-btn;
  }
  & > .search-input {
    @include gray-fill-input;
  }
}
.search-data {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: start;

  width: 100%;
  height: 100%;

  & > .found-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    &.skeleton {
      gap: 4px;
    }
  }
  &.empty {
    justify-content: center;
  }
}
.chat-data {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  height: 100%;
}

.empty-data {
  @include input-text;
  text-align: center;
  opacity: 0.6;

  position: absolute;
  top: 50%;

  width: 100%;
}
#search-spinner {
  position: absolute;
  left: calc(50% - 10px);
  top: 50%;
}
</style>
