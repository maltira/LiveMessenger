<script setup lang="ts">
import MyProfileModal from '@/components/Modals/MyProfileModal.vue'
import ProfileItemCard from '@/components/Cards/ProfileItemCard.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useProfileStore } from '@/stores/profile.store.ts'
import { useNotification } from '@/composables/useNotifications.ts'
import Skeleton from '@/components/UI/Skeleton.vue'
import { useOnlineStore } from '@/stores/online.store.ts'
import { useBlockStore } from '@/stores/block.store.ts'
import ChatItemCard from '@/components/Cards/ChatItemCard.vue'
import { useChatStore } from '@/stores/chats.store.ts'

// ? STORE
const { infoNotification } = useNotification()

const profileStore = useProfileStore()
const { isSearching, error, search, selectedProfile, findingProfiles } = storeToRefs(profileStore)
const { FetchBySearch } = profileStore

const onlineStore = useOnlineStore()
const { fetchProfileOnline } = onlineStore
const blockStore = useBlockStore()

const { CheckIfBlockedMe } = blockStore
const chatStore = useChatStore()
const { chatsList } = storeToRefs(chatStore)

// ? REF
const isProfileModalOpen = ref(false)
const searchElement = ref<HTMLElement | null>(null)
const chatDataElement = ref<HTMLElement | null>(null)
const isFetchingStatus = ref(false)
const isFetchingBlock = ref(false)

// ? FUNCTIONS
const fetchProfiles = async (value: string) => {
  findingProfiles.value = (await FetchBySearch(value, 5)) || []

  if (error.value) {
    infoNotification('🚫 Ошибка. ' + error.value.error)
  }
}
const isAddHide = computed(() => {
  return search.value || (searchElement.value && document.activeElement === searchElement.value)
})
const isLoading = computed(() => {
  return isSearching.value || isFetchingStatus.value || isFetchingBlock.value
})

watch(search, (value) => {
  if (value) {
    chatDataElement.value!.style.opacity = "0"
    chatDataElement.value!.style.transform = "scale(0.97)"
    chatDataElement.value!.style.display = 'none'
  } else {
    chatDataElement.value!.style.display = 'flex'
    setTimeout(() => {
      chatDataElement.value!.style.opacity = "1"
      chatDataElement.value!.style.transform = "scale(1)"
    }, 1)
  }

  if (value.length < 4) {
    findingProfiles.value = []
  } else {
    isSearching.value = true
    isFetchingStatus.value = true
    isFetchingBlock.value = true

    setTimeout(async () => {
      await fetchProfiles(value)
      for (const profile of findingProfiles.value) {
        await fetchProfileOnline(profile.id)
        await CheckIfBlockedMe(profile.id)
      }
      isFetchingStatus.value = false
      isFetchingBlock.value = false
    }, 300)
  }
})
onMounted(async() => {
  searchElement.value = document.getElementById('search-input')

  setTimeout(() => {
    chatDataElement.value = document.getElementById("chat-data-id")
    if (chatDataElement.value) {
      chatDataElement.value.style.opacity = "1"
      chatDataElement.value.style.transform = "scale(1)"
    }
  }, 1)

})
</script>

<template>
  <div class="sidebar-header">
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
      <Skeleton v-for="i in 5" :key="i" width="352px" height="64px"/>
    </div>
    <div v-else-if="findingProfiles.length > 0" class="found-data">
      <ProfileItemCard v-for="p in findingProfiles" :profile="p" @click="selectedProfile = p"/>
    </div>
    <p v-else class="empty-data">Ничего не найдено</p>
  </div>

  <div id="chat-data-id" class="chat-data">
    <div v-if="chatsList.length > 0" class="my-chats">
      <ChatItemCard v-for="c in chatsList" :chat="c"/>
    </div>
    <p v-else class="empty-data">Здесь пока что пусто</p>
  </div>

  <MyProfileModal v-if="isProfileModalOpen" @close="isProfileModalOpen = false" />
</template>

<style scoped lang="scss">
#chat-data-id {
  opacity: 0;
  transform: scale(0.97);
  transform-origin: center top;
}

.sidebar-header {
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
}
.chat-data {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  height: 100%;

  & > .my-chats {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    &.skeleton {
      gap: 4px;
    }
  }
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
