<script setup lang="ts">
import type { Profile } from '@/types/profile/profile.model.ts'
import { useOnlineStore } from '@/stores/online.store.ts'
import { storeToRefs } from 'pinia'
import { useBlockStore } from '@/stores/block.store.ts'
import { computed, onMounted, ref } from 'vue'
import Skeleton from '@/components/UI/Skeleton.vue'
import { useProfileStore } from '@/stores/profile.store.ts'
import { type ChatExtended, useChatStore } from '@/stores/chats.store.ts'
import { formatMessageDate } from '@/utils/DateFormat.ts'

interface Props {
  chat: ChatExtended
}
const props = defineProps<Props>()

const profileStore = useProfileStore()
const { me } = storeToRefs(profileStore)
const { FetchProfile } = useProfileStore()

const onlineStore = useOnlineStore()
const { isUserOnline } = storeToRefs(onlineStore)

const blockStore = useBlockStore()
const { isBlockedMeBy } = storeToRefs(blockStore)

const chatStore = useChatStore()
const { setActiveChat } = chatStore

// ? REFS
const profile = ref<Profile | null>(null)
const avatarLoading = ref(true)

// ? FUNCTIONS
const lastMessage = computed(() => {
  return props.chat.lastMessage?.msg_content || 'Нет сообщений'
})
const lastMessageTime = computed(() => {
  const t = props.chat.messages.find(m => m.id === props.chat.lastMessage?.msg_id)?.created_at
  if (t) {
    return formatMessageDate(t)
  }
  else return "null"
})
const isOnline = computed(() => {
  if (props.chat.type === 'private' && profile.value && !isBlockedMeBy.value(profile.value.id)) {
    return isUserOnline.value(profile.value.id)
  }
  return false
})
const chatAvatar = computed(() => {
  if (props.chat.type === 'private' && profile.value) {
    return "/img/avatars/" + profile.value.avatar_url
  }
  return props.chat.avatar_url || "/img/avatars/avatar-violet.png"
})

onMounted(async () => {
  if (props.chat && props.chat.type === 'private') {
    const interlocutor = props.chat.participants.find(p => p.user_id !== me.value!.id)
    if (interlocutor) {
      profile.value = await FetchProfile(interlocutor.user_id)
      if (isBlockedMeBy.value(profile.value!.id)) {
        avatarLoading.value = false
      }
    }
  }
})
</script>

<template>
  <div
    v-if="profile"
    class="profile-element"
    @click="setActiveChat(chat.id, me!.id)"
    :class="{active: chatStore.activeChat && chatStore.activeChat.id === chat.id}"
  >
    <div class="avatar">
      <Skeleton v-if="avatarLoading" class="img-avatar" border-radius="99px" style="opacity: 0.6" />
      <div v-if="isBlockedMeBy(profile.id) && chat.type === 'private'" class="img-avatar blocked">
        {{ profile.full_name[0] ? profile.full_name[0].toUpperCase() : 'Н' }}
      </div>
      <img
        v-else
        @load="avatarLoading = false"
        class="img-avatar"
        :src="chatAvatar"
        alt="avatar"
      />

      <div
        v-if="chat.type === 'private'"
        class="online-status"
        :class="{ active: isOnline }"
      ></div>
    </div>
    <div class="profile-data">
      <p class="chat_name">{{ chat.type === 'group' ? chat.name : profile!.full_name }}</p>
      <p class="last_message">{{ lastMessage }}</p>
      <p class="message-time">{{ lastMessageTime }}</p>
      <div class="counter-unread" v-if="chatStore.unreadMessages(chat.id, me!.id).length > 0">
        {{ chatStore.unreadMessages(chat.id, me!.id).length}}
      </div>
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
  transition: background-color 150ms;

  &:hover {
    background: rgba($gray-primary, 0.5);
  }

  &.active {
    background: $gray-primary;
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
      color: rgba($black-primary, 0.3);
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
  position: relative;
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
  & > .message-time {
    @include tag-text;
    position: absolute;
    right: 0;

    line-height: 120%;
    opacity: 0.6;
    text-align: end;
  }
  & > .counter-unread {
    @include tag-text;
    line-height: 120%;
    font-size: 12px;

    display: flex;
    align-items: center;
    justify-content: center;

    position: absolute;
    right: 0;
    top: 18px;

    color: $white-primary;
    background: $blue-color;
    border-radius: 99px;
    width: 16px;
    height: 16px;

  }
}
</style>
