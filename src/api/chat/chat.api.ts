import type { ErrorResponse } from '@/types/error.dto.ts'
import { apiFetch } from '@/api/fetch.ts'
import type { Chat } from '@/types/chat/chat.model.ts'
import type { ChatCreateRequest } from '@/types/chat/dto/chat.dto.ts'

class ChatService {
  async IsChatExists(id: string): Promise<boolean | ErrorResponse> {
    const response = await apiFetch(`/chat/${id}/check`, {
      method: 'GET',
    })
    return response.json()
  }

  async FetchAll(): Promise<Chat[] | ErrorResponse> {
    const response = await apiFetch(`/chat/all`, {
      method: 'GET',
    })
    return response.json()
  }

  async CreatePrivate(userID: string): Promise<Chat | ErrorResponse> {
    const response = await apiFetch(`/chat/create/private?uid=${userID}`, {
      method: 'POST',
    })
    return response.json()
  }

  async CreateGroup(req: ChatCreateRequest): Promise<Chat | ErrorResponse> {
    const response = await apiFetch(`/chat/create/group`, {
      method: 'POST',
      body: JSON.stringify(req)
    })
    return response.json()
  }
}

export const chatService = new ChatService()