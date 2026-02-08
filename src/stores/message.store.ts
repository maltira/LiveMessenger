import { defineStore } from 'pinia'
import type { ErrorResponse } from '@/types/error.dto.ts'
import { isErrorResponse } from '@/utils/ResponseType.ts'
import { messageService } from '@/api/chat/message.api.ts'
import type {
  GetMessagesResponse,
  MsgCreateRequest,
  MsgUpdateRequest,
} from '@/types/chat/dto/message.dto.ts'
import type { Message } from '@/types/chat/message.model.ts'

export const useMessagesStore = defineStore('messages', {
  state: () => ({
    activeChat: { id: "" as string, messages: [] as Message[] },

    lastMessage: {} as Record<string, {msg_id: string, msg_content: string}>, // <chat_id, last_message>

    isLoading: true,
    error: null as ErrorResponse | null,
  }),
  actions: {
    InitilizeChat() {
      let savedChat = localStorage.getItem('chat')
      if (savedChat) {
        this.activeChat = { id: savedChat, messages: [] }
      }
    },
    SelectChat(id: string | null) {
      if (id === null) {
        this.activeChat = { id: "", messages: []}
        localStorage.removeItem('chat')
      }
      else {
        this.activeChat = { id: id, messages: [] }
        localStorage.setItem('chat', id)
      }
    },

    async FetchMessages(chat_id: string): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: GetMessagesResponse | ErrorResponse = await messageService.GetMessages(chat_id)
        if (isErrorResponse(response)) {
          this.error = response
          return
        }

        this.activeChat = { id: chat_id, messages: response.messages }
      }
      catch (error) {
        this.error = { code: 500, error: error!.toString() }
      }
      finally {
        this.isLoading = false
      }
    },

    async FetchLastMessage(chat_id: string): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: Message | ErrorResponse = await messageService.GetLastMessage(chat_id)
        if (isErrorResponse(response)) {
          this.error = response
          return
        }

        this.lastMessage[chat_id] = {
          msg_id: response.id,
          msg_content: response.content
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
        this.lastMessage[chat_id] = {
          msg_id: response.id,
          msg_content: response.content
        }
        this.activeChat.messages.push(response)
      }
      catch (error) {
        this.error = { code: 500, error: error!.toString() }
      }
      finally {
        this.isLoading = false
      }
    },

    async EditMessage(chat_id: string, msg_id: string, req: MsgUpdateRequest): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: boolean | ErrorResponse = await messageService.EditMessage(msg_id, req)
        if (isErrorResponse(response)) {
          this.error = response
          return
        }

        let index = this.activeChat.messages.findIndex(msg => msg.id === msg_id)
        if (index != -1) {
          this.activeChat.messages[index]!.content = req.content
          this.activeChat.messages[index]!.reply_to_message = req.reply_to_message
          this.activeChat.messages[index]!.edited_at = new Date()
        }

        if (this.lastMessage[chat_id] && this.lastMessage[chat_id].msg_id !== msg_id) {
          this.lastMessage[chat_id].msg_content = req.content
        }
      } catch (error) {
        this.error = { code: 500, error: error!.toString() }
      } finally {
        this.isLoading = false
      }
    },

    async DeleteMessage(msg_id: string): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: boolean | ErrorResponse = await messageService.DeleteMessage(msg_id)
        if (isErrorResponse(response)) {
          this.error = response
          return
        }

        this.activeChat.messages = this.activeChat.messages.filter(msg => msg.id !== msg_id)

        if (this.lastMessage[this.activeChat.id] && this.lastMessage[this.activeChat.id]!.msg_id === msg_id) {
          if (this.activeChat.messages.length > 0) {
            this.lastMessage[this.activeChat.id] = {msg_id: this.activeChat.messages[0]!.id, msg_content: this.activeChat.messages[0]!.content}
          }
        }
      } catch (error) {
        this.error = { code: 500, error: error!.toString() }
      } finally {
        this.isLoading = false
      }
    }
  }
})