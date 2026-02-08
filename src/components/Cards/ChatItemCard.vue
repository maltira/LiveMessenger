<script setup lang="ts">
import type { Profile } from '@/types/profile/profile.model.ts'
import { useOnlineStore } from '@/stores/online.store.ts'
import { storeToRefs } from 'pinia'
import { useBlockStore } from '@/stores/block.store.ts'
import { onMounted, ref } from 'vue'
import Skeleton from '@/components/UI/Skeleton.vue'
import type { Chat } from '@/types/chat/chat.model.ts'
import { useProfileStore } from '@/stores/profile.store.ts'
import { useMessagesStore } from '@/stores/message.store.ts'

const profileStore = useProfileStore()
const { me } = storeToRefs(profileStore)
const { FetchProfile } = useProfileStore()
const onlineStore = useOnlineStore()
const { isUserOnline } = storeToRefs(onlineStore)
const blockStore = useBlockStore()
const { isBlockedMeBy } = storeToRefs(blockStore)
const messagesStore = useMessagesStore()
const { lastMessage } = storeToRefs(messagesStore)
const { SelectChat } = messagesStore

// ? REFS
const profile = ref<Profile | null>(null)
const avatarLoading = ref(true)

interface Props {
  chat: Chat
}
const props = defineProps<Props>()
onMounted(async () => {
  if (props.chat.type === 'private') {
    let chatWith = props.chat.Participants.find(p => p.id !== me.value!.id)
    profile.value = await FetchProfile(chatWith!.id)

    if (isBlockedMeBy.value(profile.value!.id)) {
      avatarLoading.value = false
    }
  }
})
</script>

<template>
  <div class="profile-element" @click="SelectChat(chat.id)">
    <div class="avatar">
      <Skeleton v-if="avatarLoading" class="img-avatar" border-radius="99px" style="opacity: 0.6;" />
      <div v-if="isBlockedMeBy(profile!.id) && chat.type === 'private'" class="img-avatar blocked">
        {{ profile!.full_name[0] ? profile!.full_name[0].toUpperCase() : "Н" }}
      </div>
      <img
        v-else
        @load="avatarLoading = false"
        class="img-avatar"
        :src="chat.type === 'private' ? `/img/avatars/${profile!.avatar_url}` : chat.avatar_url!"
        alt="avatar"
      />

      <div v-if="chat.type === 'private'" class="online-status" :class="{active: isUserOnline(profile!.id) && !isBlockedMeBy(profile!.id)}"></div>
    </div>
    <div class="profile-data">
      <p class="chat_name">{{ chat.type === 'group' ? chat.name : profile!.full_name }}</p>
      <p class="last_message">{{ lastMessage[chat.id] }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.profile-element {
  display: flex;
  align-items: center;
  gap: 12px;

  width: 100%;
  padding: 10px 24px;
  background: transparent;

  cursor: pointer;
  transition: background-color 1ms;

  &:hover {
    background: rgba($gray-primary, 0.5);
  }
}
.avatar {
  position: relative;

  & > .img-avatar {
    max-width: 44px;
    width: 44px !important;
    height: 44px !important;
    border-radius: 99px;

    &.blocked {
      @include h5-text;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      background: $gray-primary;
      color: rgba($black-primary, 0.3)
    }
  }

  & > .online-status {
    position: absolute;
    right: 2px;
    bottom: 2px;

    width: 4px;
    height: 4px;
    opacity: 0;

    background: $blue-color;

    border-radius: 99px;
    border: 2px solid $white-primary;

    &.active {
      width: 12px;
      height: 12px;
      opacity: 1;
    }
  }
}
.profile-data {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;

  & > .chat_name {
    @include button-text;
    line-height: 100%;
    width: 90%;
  }
  & > .last_message {
    @include tag-text;
    line-height: 120%;
    opacity: 0.6;
  }
}
</style>
