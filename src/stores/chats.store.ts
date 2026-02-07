import { defineStore } from 'pinia'
import type { ErrorResponse } from '@/types/error.dto.ts'
import { isErrorResponse } from '@/utils/ResponseType.ts'
import type { Chat } from '@/types/chat/chat.model.ts'
import { chatService } from '@/api/chat/chat.api.ts'
import type { ChatCreateRequest } from '@/types/chat/dto/chat.dto.ts'

export const useChatsStore = defineStore('chats', {
  state: () => ({
    chats: [] as Chat[],
    privateChats: new Set<string>(), // id пользователей, с которыми есть личный чат

    isLoading: true,
    error: null as ErrorResponse | null,
  }),
  getters: {
    hasPrivateWith: (state) => (user_id: string) => state.privateChats.has(user_id),
  },
  actions: {
    async FetchAll(): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: Chat[] | ErrorResponse = await chatService.FetchAll()
        if (isErrorResponse(response)) {
          this.error = response
          return
        }
        this.chats = response
        response.forEach(chat => {
          if (chat.type === "private") this.privateChats.add(chat.id)
        })
      }
      catch (error) {
        this.error = { code: 500, error: error!.toString() }
      }
      finally {
        this.isLoading = false
      }
    },

    async IsChatExists(id: string): Promise<boolean> {
      if (this.chats.some(chat => chat.id === id)) {
        return true
      }
      try {
        this.isLoading = true
        this.error = null

        const response: boolean | ErrorResponse = await chatService.IsChatExists(id)
        if (isErrorResponse(response)) {
          this.error = response
          return false
        }

        return response
      } catch (error) {
        this.error = { code: 500, error: error!.toString() }
        return false
      } finally {
        this.isLoading = false
      }
    },

    async CreatePrivate(user_id: string): Promise<Chat | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: Chat | ErrorResponse = await chatService.CreatePrivate(user_id)
        if (isErrorResponse(response)) {
          this.error = response
          return null
        }

        this.chats.push(response)
        this.privateChats.add(user_id)
        return response
      } catch (error) {
        this.error = { code: 500, error: error!.toString() }
        return null
      } finally {
        this.isLoading = false
      }
    },

    async CreateGroup(req: ChatCreateRequest): Promise<Chat | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: Chat | ErrorResponse = await chatService.CreateGroup(req)
        if (isErrorResponse(response)) {
          this.error = response
          return null
        }

        this.chats.push(response)
        return response
      } catch (error) {
        this.error = { code: 500, error: error!.toString() }
        return null
      } finally {
        this.isLoading = false
      }
    }
  }
})