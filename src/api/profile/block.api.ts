import type { ErrorResponse, MessageResponse } from '@/types/error.dto.ts'
import { apiFetch } from '@/api/fetch.ts'
import type { Block } from '@/types/profile/block.model.ts'

class BlockService {
  async GetAll(): Promise<Block[] | ErrorResponse> {
    const response = await apiFetch(`/user/block/all`, {
      method: 'GET',
      credentials: 'include',
    })
    return response.json()
  }

  async BlockProfile(id: string): Promise<Block | ErrorResponse> {
    const response = await apiFetch(`/user/block/${id}`, {
      method: 'POST',
      credentials: 'include',
    })
    return response.json()
  }

  async UnblockProfile(id: string): Promise<MessageResponse | ErrorResponse> {
    const response = await apiFetch(`/user/block/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    return response.json()
  }

  async CheckBlock(target_id: string): Promise<boolean | ErrorResponse> {
    const response = await apiFetch(`/user/block/check/${target_id}`, {
      method: 'GET',
      credentials: 'include',
    })
    return response.json()
  }
}

export const blockService = new BlockService()