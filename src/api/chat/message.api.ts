import type {
  GetMessagesResponse,
  MsgCreateRequest,
  MsgUpdateRequest,
} from '@/types/chat/dto/message.dto.ts'
import type { ErrorResponse } from '@/types/error.dto.ts'
import { apiFetch } from '@/api/fetch.ts'
import type { Message } from '@/types/chat/message.model.ts'

class MessageService {
  async GetMessages(chat_id: string, offset: number = 0, limit: number = 50): Promise<GetMessagesResponse | ErrorResponse> {
    const response = await apiFetch(`/chat/${chat_id}/messages?limit=${limit}&offset=${offset}`, {
      method: 'GET',
    })
    return response.json()
  }

  async GetLastMessage(chat_id: string): Promise<Message | ErrorResponse> {
    const response = await apiFetch(`/chat/${chat_id}/last-message`, {
      method: 'GET',
    })
    return response.json()
  }

  async SendMessage(chat_id: string, req: MsgCreateRequest): Promise<Message | ErrorResponse> {
    const response = await apiFetch(`/chat/${chat_id}/send`, {
      method: 'POST',
      body: JSON.stringify(req),
    })
    return response.json()
  }

  async EditMessage(msg_id: string, req: MsgUpdateRequest): Promise<boolean | ErrorResponse> {
    const response = await apiFetch(`/chat/message/${msg_id}`, {
      method: 'PUT',
      body: JSON.stringify(req),
    })
    return response.json()
  }

  async DeleteMessage(msg_id: string): Promise<boolean | ErrorResponse> {
    const response = await apiFetch(`/chat/message/${msg_id}`, {
      method: 'DELETE',
    })
    return response.json()
  }
}

export const messageService = new MessageService()