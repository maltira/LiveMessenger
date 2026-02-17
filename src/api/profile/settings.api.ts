import type { ErrorResponse } from '@/types/error.dto.ts'
import { apiFetch } from '@/api/fetch.ts'
import type { Settings } from '@/types/profile/settings.model.ts'
import type { SettingsUpdateReq } from '@/types/profile/dto/settings.dto.ts'

class SettingsService {
  async GetSettings(): Promise<Settings | ErrorResponse> {
    const response = await apiFetch(`/user/settings`, {
      method: 'GET',
      credentials: 'include',
    })
    return response.json()
  }
  async UpdateSettings(req: SettingsUpdateReq): Promise<boolean | ErrorResponse> {
    const response = await apiFetch(`/user/settings`, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify(req),
    })
    return response.json()
  }
}

export const settingsService = new SettingsService()