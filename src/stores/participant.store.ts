import { defineStore } from 'pinia'
import type { ErrorResponse } from '@/types/error.dto.ts'
import { isErrorResponse } from '@/utils/ResponseType.ts'
import type { Participant } from '@/types/chat/participant.model.ts'
import { participantService } from '@/api/chat/participant.api.ts'
import type { MuteRequest } from '@/types/chat/dto/participant.dto.ts'

export const useParticipantStore = defineStore('participant', {
  state: () => ({
    isLoading: true,
    error: null as ErrorResponse | null,
  }),
  actions: {
    async GetParticipant(chat_id: string, user_id: string): Promise<Participant | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: Participant | ErrorResponse = await participantService.GetParticipant(chat_id, user_id)
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
        this.isLoading = false
      }
    },

    async IsParticipant(chat_id: string, user_id: string): Promise<boolean | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: boolean | ErrorResponse = await participantService.IsParticipant(chat_id, user_id)
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
        this.isLoading = false
      }
    },

    async JoinToChat(chat_id: string): Promise<boolean | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: boolean | ErrorResponse = await participantService.JoinToChat(chat_id)
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
        this.isLoading = false
      }
    },
    async LeaveChat(chat_id: string): Promise<boolean | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: boolean | ErrorResponse = await participantService.LeaveChat(chat_id)
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
        this.isLoading = false
      }
    },

    async KickUser(chat_id: string, user_id: string): Promise<boolean | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: boolean | ErrorResponse = await participantService.KickUser(chat_id, user_id)
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
        this.isLoading = false
      }
    },
    async MuteUser(chat_id: string, req: MuteRequest): Promise<boolean | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: boolean | ErrorResponse = await participantService.MuteUser(chat_id, req)
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
        this.isLoading = false
      }
    },
    async UnmuteUser(chat_id: string, user_id: string): Promise<boolean | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: boolean | ErrorResponse = await participantService.UnmuteUser(chat_id, user_id)
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
        this.isLoading = false
      }
    },
  }
})