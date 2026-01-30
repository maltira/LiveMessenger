<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

type Language = {
  img: string
  name: string
  code: string
}
const allLanguages = ref<Language[]>([
  {
    img: '/icons/rus-flag.svg',
    name: 'Русский',
    code: 'ru-RU',
  },
  {
    img: '/icons/uk-flag.svg',
    name: 'Английский',
    code: 'en-US',
  },
])
const selectedLanguage = ref<Language>(allLanguages.value[0]!)
const isModalVisible = ref(false)
const btn = document.getElementById('select-lang-btn')

const toggleModal = () => {
  isModalVisible.value = !isModalVisible.value
}
const selectLanguage = (language: Language) => {
  selectedLanguage.value = language
}

const handleClickOutside = (e: MouseEvent) => {
  if (isModalVisible.value) {const btn = document.getElementById('select-lang-btn')
    const modal = document.getElementById('select-lang-modal')
    if (!modal!.contains(e.target as Element) && !btn!.contains(e.target as Element)) {
      toggleModal()
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div id="select-lang-btn" @click="toggleModal">
    <img src="/icons/language.svg" alt="language" />
    <p>{{ selectedLanguage.name }}</p>
    <div id="select-lang-modal" v-if="isModalVisible">
      <div
        class="lang-block"
        v-for="l in allLanguages"
        @click="selectLanguage(l)"
        :class="{ active: selectedLanguage.code === l.code }"
      >
        <img :src="l.img" alt="flag" />
        <p>{{ l.name }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#select-lang-btn {
  position: fixed;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;

  opacity: 0.8;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  & > p {
    @include button-text;
  }
}
#select-lang-modal {
  display: flex;
  flex-direction: column;
  gap: 4px;

  position: fixed;
  top: 76px;
  width: 160px;

  padding: 4px;
  border-radius: 8px;
  background: $white-primary;

  z-index: 1000;

  & > .lang-block {
    display: flex;
    align-items: center;
    gap: 8px;

    cursor: pointer;

    padding: 8px;
    border-radius: 4px;
    background: transparent;

    & > p {
      @include button-text;
    }
    & > img {
      width: 20px;
      height: 20px;
    }

    &.active {
      background: $gray-primary;
      pointer-events: none !important;
      cursor: default !important;
    }

    &:hover {
      background: rgba($gray-primary, 0.5);
    }
  }
}
</style>
