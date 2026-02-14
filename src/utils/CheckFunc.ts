import type {
  NavigationGuardNext,
  RouteLocationNormalizedGeneric,
  RouteLocationNormalizedLoadedGeneric,
} from 'vue-router'

import { useAuthStore } from '@/stores/auth.store.ts'

export const checkAuth = async (to: RouteLocationNormalizedGeneric, from: RouteLocationNormalizedLoadedGeneric, next: NavigationGuardNext) => {
  const authStore = useAuthStore()
  await authStore.FetchMe()

  if (authStore.me && authStore.error == null) {
    next()
  } else {
    next('/login')
  }
}