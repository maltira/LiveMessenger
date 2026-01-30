import type { Profile } from '@/types/profile/profile.model.ts'
import type { ErrorResponse } from '@/types/error.dto.ts'
import { apiFetch } from '@/api/fetch.ts'
import type { OnlineStatusResponse } from '@/types/profile/dto/profile.dto.ts'


class ProfileService {
  private baseUrl = import.meta.env.VITE_API_URL

  async MyProfile(): Promise<Profile | ErrorResponse> {
    const response = await apiFetch(`/user/profile`, {
      method: 'GET',
      credentials: 'include',
    })
    return response.json()
  }

  async GetAll(): Promise<Profile[] | ErrorResponse> {
    const response = await apiFetch(`/user/profile/all`, {
      method: 'GET',
      credentials: 'include',
    })
    return response.json()
  }

  async OnlineStatus(userID: string): Promise<OnlineStatusResponse | ErrorResponse> {
    const response = await apiFetch(`/user/profile/${userID}/status`, {
      method: 'GET',
      credentials: 'include',
    })
    return response.json()
  }
}

export const profileService = new ProfileService()