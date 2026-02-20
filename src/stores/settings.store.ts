import { defineStore } from 'pinia'
import type { ErrorResponse } from '@/types/error.dto.ts'
import { isErrorResponse } from '@/utils/ResponseType.ts'
import type { Settings } from '@/types/profile/settings.model.ts'
import { settingsService } from '@/api/profile/settings.api.ts'
import type { SettingsUpdateReq } from '@/types/profile/dto/settings.dto.ts'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    settings: {} as Settings,
    isLoading: true,
    error: null as ErrorResponse | null,
  }),
  actions: {
    async FetchSettings(): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: Settings | ErrorResponse = await settingsService.GetSettings()
        if (isErrorResponse(response)) {
          this.error = response
          return
        }
        this.settings = response
      } catch (error) {
        this.error = { code: 500, error: error!.toString() }
      } finally {
        this.isLoading = false
      }
    },

    async UpdateSettings(req: SettingsUpdateReq): Promise<boolean> {
      try {
        this.isLoading = true
        this.error = null

        const response: boolean | ErrorResponse = await settingsService.UpdateSettings(req)
        if (isErrorResponse(response)) {
          this.error = response
          return false
        }

        if (req.dark_mode) this.settings.dark_mode = req.dark_mode
        if (req.show_online_status) this.settings.show_online_status = req.show_online_status
        if (req.language) this.settings.language = req.language
        if (req.show_birth_date) this.settings.show_birth_date = req.show_birth_date

        return response
      } catch (error) {
        this.error = { code: 500, error: error!.toString() }
        return false
      } finally {
        this.isLoading = false
      }
    },
  }
})