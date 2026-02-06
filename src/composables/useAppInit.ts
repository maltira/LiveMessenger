import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store.ts'
import router from '@/router'
import { useProfileStore } from '@/stores/profile.store.ts'
import { WSStatus } from '@/api/ws.api.ts'
import { useBlockStore } from '@/stores/block.store.ts'

export function useAppInit() {
  const isAppReady = ref(false)
  const authStore = useAuthStore()
  const profileStore = useProfileStore()
  const blockStore = useBlockStore()
  
  const initApp = async (): Promise<void> => {
    try {
      await authStore.FetchMe()

      if (authStore.me && authStore.error == null) {
        WSStatus.connect()
        await profileStore.FetchMe()
        await blockStore.FetchAll()
        await router.push('/')
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