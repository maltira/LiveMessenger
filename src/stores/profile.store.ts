import { defineStore } from 'pinia'
import type { ErrorResponse } from '@/types/error.dto.ts'
import { isErrorResponse } from '@/utils/ResponseType.ts'
import type { Profile } from '@/types/profile/profile.model.ts'
import { profileService } from '@/api/profile/profile.api.ts'
import type { OnlineStatusResponse } from '@/types/profile/dto/profile.dto.ts'


export const useProfileStore = defineStore('profile', {
  state: () => ({
    me: null as Profile | null,
    search: "",
    isSearching: false,
    isLoading: true,
    error: null as ErrorResponse | null,
  }),

  actions: {
    async FetchMe(): Promise<Profile | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: Profile | ErrorResponse = await profileService.MyProfile()
        if (isErrorResponse(response)) {
          this.error = response
          return null
        }

        this.me = response
        return response
      } catch (error) {
        this.error = { code: 500, error: error!.toString() }
        return null
      } finally {
        this.isLoading = false
      }
    },

    async FetchAll(): Promise<Profile[] | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: Profile[] | ErrorResponse = await profileService.GetAll()
        if (isErrorResponse(response)) {
          this.error = response
          return null
        }

        return response
      } catch (error) {
        this.error = { code: 500, error: error!.toString() }
        return null
      } finally {
        this.isLoading = false
      }
    },

    async FetchBySearch(query: string, limit: number): Promise<Profile[] | null> {
      try {
        this.isSearching = true
        this.error = null

        const response: Profile[] | ErrorResponse = await profileService.GetAllBySearch(query, limit)
        if (isErrorResponse(response)) {
          this.error = response
          return null
        }

        return response
      }
      catch (error) {
        this.error = { code: 500, error: error!.toString() }
        return null
      }
      finally {
        this.isSearching = false
      }
    },

    async CheckOnlineStatus(userID: string): Promise<OnlineStatusResponse | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: OnlineStatusResponse | ErrorResponse =
          await profileService.OnlineStatus(userID)
        if (isErrorResponse(response)) {
          this.error = response
          return null
        }

        return response
      } catch (error) {
        this.error = { code: 500, error: error!.toString() }
        return null
      } finally {
        this.isLoading = false
      }
    },
  }
})