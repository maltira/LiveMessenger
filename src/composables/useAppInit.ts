import { ref } from 'vue'
import useAuthStore from '@/stores/auth.store.ts'
import router from '@/router'
import { useProfileStore } from '@/stores/profile.store.ts'
import { WSStatus } from '@/api/ws.api.ts'
import { useBlockStore } from '@/stores/block.store.ts'
import { useChatStore } from '@/stores/chats.store.ts'
import { useNotification } from '@/composables/useNotifications.ts'
import { useOnlineStore } from '@/stores/online.store.ts'
import { useSettingsStore } from '@/stores/settings.store.ts'

export function useAppInit() {
  const isAppReady = ref(false)
  const authStore = useAuthStore()
  const profileStore = useProfileStore()
  const blockStore = useBlockStore()
  const chatStore = useChatStore()
  const onlineStore = useOnlineStore()
  const settingsStore = useSettingsStore()
  const { infoNotification } = useNotification()
  
  const initApp = async (): Promise<void> => {
    try {
      await authStore.FetchMe()

      if (authStore.me && authStore.error == null) {
        WSStatus.connect()
        await profileStore.FetchMe()
        await blockStore.FetchAll()

        await chatStore.FetchChats()
        if (chatStore.error) {
          infoNotification("🚫 Ошибка загрузки чатов: " + chatStore.error.error)
        } else {
          for (const chat of chatStore.chatsList) {
            await chatStore.FetchParticipants(chat.id, authStore.me!.id)
            await chatStore.FetchMessages(chat.id)
            await settingsStore.FetchSettings()

            if (chat.messages.length > 0 && chat.messages[0])
              chat.lastMessage = {msg_id: chat.messages[0].id, msg_content: chat.messages[0].content}
          }
          for (const p of chatStore.privateChats) {
            await blockStore.CheckIfBlockedMe(p)
            await onlineStore.fetchProfileOnline(p)
          }
        }

        await router.push('/chat')
      }
    }
    catch (error) {
      console.error("App initialization failed:", error)
    }
    finally {
      isAppReady.value = true
    }
  }
  return {
    isAppReady,
    initApp,
  }
}