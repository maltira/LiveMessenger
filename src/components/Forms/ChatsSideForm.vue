<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import MyProfileModal from '@/components/Modals/MyProfileModal.vue'
import { useProfileStore } from '@/stores/profile.store.ts'
import type { Profile } from '@/types/profile/profile.model.ts'
import { storeToRefs } from 'pinia'
import ProfileElement from '@/components/Forms/ProfileElement.vue'

// ? STORE
const profileStore = useProfileStore()
const { isSearching, error, me, search } = storeToRefs(profileStore)
const { FetchBySearch } = profileStore
const searchElement = ref<HTMLElement | null>(null)

// ? REF
const isProfileModalOpen = ref(false)
const findingProfiles = ref<Profile[]>([])

// ? FUNCTIONS
watch(search, (value) => {
  if (value.length < 4) {
    findingProfiles.value = []
  } else {
    setTimeout(async () => {
      findingProfiles.value = (await FetchBySearch(value, 5)) || []
    }, 300)
  }
})
const isAddHide = computed(() => {
  return search.value || searchElement.value && document.activeElement === searchElement.value;
})

onMounted(() => {
  searchElement.value = document.getElementById("search-input")
})
</script>

<template>
  <div class="chats-side-form">
    <div class="form-header">
      <div class="icon-btn" @click="isProfileModalOpen = true">
        <img src="/icons/menu.svg" alt="menu" />
      </div>
      <div id="search-input" class="search-input" :class="{ active: search }">
        <input type="text" id="chat-search" v-model="search" placeholder="Поиск" />
        <img
          src="/icons/close.svg"
          alt="clear-search"
          class="right-side-icon"
          @click="search = ''"
        />
      </div>
      <div class="icon-btn" v-if="!isAddHide">
        <img src="/icons/add.svg" alt="add" />
      </div>
    </div>
    <div v-if="search" class="search-data">
      <div v-if="findingProfiles.length > 0" class="found-data">
        <ProfileElement v-for="p in findingProfiles" :profile="p" />
      </div>
      <p v-else class="empty-data">Ничего не найдено</p>
    </div>
    <div v-else class="chat-data">
      <p class="empty-data">Здесь пока что пусто</p>
    </div>

    <MyProfileModal v-if="isProfileModalOpen" @close="isProfileModalOpen = false" />
  </div>
</template>

<style scoped lang="scss">
.chats-side-form {
  position: relative;
  display: flex;
  flex-direction: column;

  max-width: 462px;
  width: 100%;
  height: 100%;

  background: $white-primary;
  border-radius: 16px;
  border: 1px solid rgba($black-primary, 0.1);
  padding: 24px 0;
  gap: 12px;
}
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
    width: 100%;
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
</style>
