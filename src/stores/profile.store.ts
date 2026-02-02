import { defineStore } from 'pinia'
import type { ErrorResponse } from '@/types/error.dto.ts'
import { isErrorResponse } from '@/utils/ResponseType.ts'
import type { Profile } from '@/types/profile/profile.model.ts'
import { profileService } from '@/api/profile/profile.api.ts'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    me: null as Profile | null,
    selectedProfile: null as Profile | null,

    search: "",
    findingProfiles: [] as Profile[],
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
  }
})