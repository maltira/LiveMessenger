import type { Participant } from '@/types/chat/participant.model.ts'
import type { ErrorResponse } from '@/types/error.dto.ts'
import { apiFetch } from '@/api/fetch.ts'
import type { MuteRequest } from '@/types/chat/dto/participant.dto.ts'

class ParticipantService {
  async GetParticipant(chat_id: string, user_id: string): Promise<Participant | ErrorResponse> {
    const response = await apiFetch(`/chat/${chat_id}/user?uid=${user_id}`, {
      method: 'GET',
    })
    return response.json()
  }
  async GetAllParticipants(chat_id: string): Promise<Participant[] | ErrorResponse> {
    const response = await apiFetch(`/chat/${chat_id}/user/all`, {
      method: 'GET',
    })
    return response.json()
  }
  async IsParticipant(chat_id: string, user_id: string): Promise<boolean | ErrorResponse> {
    const response = await apiFetch(`/chat/${chat_id}/user/check?uid=${user_id}`, {
      method: 'GET',
    })
    return response.json()
  }

  async JoinToChat(chat_id: string): Promise<boolean | ErrorResponse> {
    const response = await apiFetch(`/chat/${chat_id}/join`, {
      method: 'POST',
    })
    return response.json()
  }
  async LeaveChat(chat_id: string): Promise<boolean | ErrorResponse> {
    const response = await apiFetch(`/chat/${chat_id}/leave`, {
      method: "DELETE",
    })
    return response.json()
  }

  async KickUser(chat_id: string, user_id: string): Promise<boolean | ErrorResponse> {
    const response = await apiFetch(`/chat/${chat_id}/kick?uid=${user_id}`, {
      method: 'DELETE',
    })
    return response.json()
  }
  async MuteUser(chat_id: string, req: MuteRequest): Promise<boolean | ErrorResponse> {
    const response = await apiFetch(`/chat/${chat_id}/mute`, {
      method: 'PUT',
      body: JSON.stringify(req),
    })
    return response.json()
  }
  async UnmuteUser(chat_id: string, user_id: string): Promise<boolean | ErrorResponse> {
    const response = await apiFetch(`/chat/${chat_id}/unmute?uid=${user_id}`, {
      method: 'PUT',
    })
    return response.json()
  }
}

export const participantService = new ParticipantService()