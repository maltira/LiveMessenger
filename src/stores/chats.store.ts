import { defineStore } from 'pinia'
import type { ErrorResponse } from '@/types/error.dto.ts'
import { isErrorResponse } from '@/utils/ResponseType.ts'
import type { Chat } from '@/types/chat/chat.model.ts'
import { chatService } from '@/api/chat/chat.api.ts'
import type { ChatCreateRequest } from '@/types/chat/dto/chat.dto.ts'
import type { Message } from '@/types/chat/message.model.ts'
import type { Participant } from '@/types/chat/participant.model.ts'
import type {
  GetMessagesResponse,
  MsgCreateRequest,
  MsgUpdateRequest,
} from '@/types/chat/dto/message.dto.ts'
import { messageService } from '@/api/chat/message.api.ts'
import { participantService } from '@/api/chat/participant.api.ts'

export interface ChatExtended extends Chat {
  messages: Message[]
  participants: Participant[]
  unread: number
  lastMessage?: { msg_id: string; msg_content: string }
}

export const useChatStore = defineStore('chats', {
  state: () => ({
    chats: new Map<string, ChatExtended>(), // chat_id:данные
    privateChats: new Set<string>(), // id пользователей, с которыми есть личный чат
    activeChatId: "" as string,

    isLoading: true,
    error: null as ErrorResponse | null,
  }),
  getters: {
    chatsList: (state) => Array.from(state.chats.values()),
    activeChat: (state): ChatExtended | null => state.chats.get(state.activeChatId) || null,
    isActiveChat: (state) => !!state.activeChatId,
    hasPrivate: (state) => (id: string) => state.privateChats.has(id),
  },
  actions: {
    addMessage(chat_id: string, msg: Message) {
      const chat = this.chats.get(chat_id)
      if (chat) {
        if (!chat.messages.some(m => m.id === msg.id)) {
          chat.messages.push(msg)
        }
        chat.unread += 1
        chat.lastMessage = { msg_id: msg.id, msg_content: msg.content }
        this.chats.set(chat_id, chat)
      }
    },
    async setActiveChat(chat_id: string, me_id: string) {
      if (chat_id === this.activeChatId) return

      const chat = this.chats.get(chat_id)
      if (chat) {
        if (chat.messages.length === 0) {
          await this.FetchMessages(chat_id)
        }
        if (chat.participants.length === 0) {
          await this.FetchParticipants(chat_id, me_id)
        }
        chat.unread = 0
      }
      this.activeChatId = chat_id
    },
    clearActiveChat() {
      this.activeChatId = ''
    },

    async FetchChats(): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: Chat[] | ErrorResponse = await chatService.FetchAll()
        if (isErrorResponse(response)) {
          this.error = response
          return
        }

        response.forEach(chat => {
          this.chats.set(chat.id, {
            ...chat,
            messages: [],
            participants: [],
            unread: 0,
          })
        })
      }
      catch (error) {
        this.error = { code: 500, error: error!.toString() }
      }
      finally {
        this.isLoading = false
      }
    },
    async CreatePrivateChat(user_id: string): Promise<Chat | null> {
      if (this.privateChats.has(user_id))
        return null
      try {
        this.isLoading = true
        this.error = null

        const response: Chat | ErrorResponse = await chatService.CreatePrivate(user_id)
        if (isErrorResponse(response)) {
          this.error = response
          return null
        }

        this.chats.set(response.id, {
          ...response,
          messages: [],
          participants: [],
          unread: 0,
        })
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

        this.chats.set(response.id, {
          ...response,
          messages: [],
          participants: [],
          unread: 0,
        })

        return response
      } catch (error) {
        this.error = { code: 500, error: error!.toString() }
        return null
      } finally {
        this.isLoading = false
      }
    },

    async FetchParticipants(chat_id: string, me_id: string): Promise<Participant[] | null> {
      try {
        this.isLoading = true
        this.error = null
        const response: Participant[] | ErrorResponse = await participantService.GetAllParticipants(chat_id)
        if (isErrorResponse(response)) {
          this.error = response
          return null
        }

        const chat = this.chats.get(chat_id)
        if (chat) {
          chat.participants = response
          this.chats.set(chat_id, chat)

          if (chat.type === 'private') {
            const p = response.find(p => p.user_id !== me_id)!
            this.privateChats.add(p.user_id)
          }
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

    async FetchMessages(chat_id: string, l: number = 50, o: number = 0): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: GetMessagesResponse | ErrorResponse = await messageService.GetMessages(chat_id, o, l)
        if (isErrorResponse(response)) {
          this.error = response
          return
        }
        const chat = this.chats.get(chat_id)
        if (chat) {
          chat.messages = [...chat.messages, ...response.messages]
          this.chats.set(chat_id, chat)
        }
      }
      catch (error) {
        this.error = { code: 500, error: error!.toString() }
      }
      finally {
        this.isLoading = false
      }
    },
    async SendMessage(chat_id: string, req: MsgCreateRequest): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: Message | ErrorResponse = await messageService.SendMessage(chat_id, req)
        if (isErrorResponse(response)) {
          this.error = response
          return
        }
        this.addMessage(chat_id, response)
      }
      catch (error) {
        this.error = { code: 500, error: error!.toString() }
      }
      finally {
        this.isLoading = false
      }
    },
    async EditMessage(chat_id: string, msg_id: string, req: MsgUpdateRequest): Promise<boolean | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: boolean | ErrorResponse = await messageService.EditMessage(msg_id, req)
        if (isErrorResponse(response)) {
          this.error = response
          return null
        }

        const chat = this.chats.get(chat_id)
        if (chat) {
          const msgIndex = chat.messages.findIndex(m => m.id === msg_id)
          if (msgIndex !== -1) {
            chat.messages[msgIndex]!.content = req.content
            chat.messages[msgIndex]!.reply_to_message = req.reply_to_message
            this.chats.set(chat_id, chat)
          }
        }

        return response
      } catch (error) {
        this.error = { code: 500, error: error!.toString() }
        return null
      } finally {
        this.isLoading = false
      }
    },
    async DeleteMessage(chat_id: string, msg_id: string): Promise<boolean | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: boolean | ErrorResponse = await messageService.DeleteMessage(msg_id)
        if (isErrorResponse(response)) {
          this.error = response
          return null
        }

        const chat = this.chats.get(chat_id)
        if (chat) {
          chat.messages = chat.messages.filter(m => m.id !== msg_id)
          if (chat.lastMessage && chat.lastMessage.msg_id === msg_id) {
            chat.lastMessage = chat.messages.length > 0 ? {
              msg_id: chat.messages[0]!.id,
              msg_content: chat.messages[0]!.content,
            } : undefined
          }
          this.chats.set(chat_id, chat)
        }
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