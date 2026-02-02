import { defineStore } from 'pinia'
import type { ErrorResponse } from '@/types/error.dto.ts'
import type { OnlineStatusResponse } from '@/types/profile/dto/profile.dto.ts'
import { profileService } from '@/api/profile/profile.api.ts'
import { isErrorResponse } from '@/utils/ResponseType.ts'

export const useOnlineStore = defineStore('online', {
  state: () => ({
    onlineProfiles: {} as Record<string, OnlineStatusResponse>,
    isLoading: true,
    error: null as ErrorResponse | null,
  }),
  getters: {
    isUserOnline: state => (id: string) => state.onlineProfiles[id]!.online ?? false,
    userLastSeen: state => (id: string) => state.onlineProfiles[id]!.last_seen,
  },
  actions: {
    async fetchProfileOnline(id: string): Promise<void> {
      if (id in this.onlineProfiles) return
      try {
        this.isLoading = true
        this.error = null

        const response: OnlineStatusResponse | ErrorResponse =
          await profileService.OnlineStatus(id)
        if (isErrorResponse(response)) {
          this.error = response
          return
        }
        this.onlineProfiles[id] = response
      }
      catch (error) {
        this.error = { code: 500, error: error!.toString() }
      }
      finally {
        this.isLoading = false
      }
    },
  }
})