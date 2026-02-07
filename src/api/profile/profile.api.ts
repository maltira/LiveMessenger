import type { Profile } from '@/types/profile/profile.model.ts'
import type { ErrorResponse } from '@/types/error.dto.ts'
import { apiFetch } from '@/api/fetch.ts'
import type { OnlineStatusResponse } from '@/types/profile/dto/profile.dto.ts'


class ProfileService {
  async MyProfile(): Promise<Profile | ErrorResponse> {
    const response = await apiFetch(`/user/profile`, {
      method: 'GET',
    })
    return response.json()
  }

  async FetchProfile(id: string): Promise<Profile | ErrorResponse> {
    const response = await apiFetch(`/user/profile/${id}`, {
      method: 'GET',
    })
    return response.json()
  }

  async GetAll(): Promise<Profile[] | ErrorResponse> {
    const response = await apiFetch(`/user/profile/all`, {
      method: 'GET',
    })
    return response.json()
  }

  async GetAllBySearch(query: string, limit: number): Promise<Profile[] | ErrorResponse> {
    const response = await apiFetch(`/user/profile/search?q=${query}&limit=${limit}`, {
      method: 'GET',
    })
    return response.json()
  }

  async OnlineStatus(userID: string): Promise<OnlineStatusResponse | ErrorResponse> {
    const response = await apiFetch(`/user/profile/${userID}/status`, {
      method: 'GET',
    })
    return response.json()
  }
}

export const profileService = new ProfileService()