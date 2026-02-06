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
    chat: { id: "" as string, messages: [] as Message[] },

    lastMessage: {} as Record<string, {msg_id: string, msg_content: string}>, // <chat_id, last_message>

    isLoading: true,
    error: null as ErrorResponse | null,
  }),
  actions: {
    async FetchMessages(chat_id: string): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: GetMessagesResponse | ErrorResponse = await messageService.GetMessages(chat_id)
        if (isErrorResponse(response)) {
          this.error = response
          return
        }

        this.chat = { id: chat_id, messages: response.messages }
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
          msg_content: computeContent(response.content, response.type)
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
          msg_content: computeContent(response.content, response.type)
        }
        this.chat.messages.push(response)
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

        let index = this.chat.messages.findIndex(msg => msg.id === msg_id)
        if (index != -1) {
          this.chat.messages[index]!.content = req.content
          this.chat.messages[index]!.reply_to_message = req.reply_to_message
          this.chat.messages[index]!.edited_at = new Date()
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

        this.chat.messages = this.chat.messages.filter(msg => msg.id !== msg_id)

        if (this.lastMessage[this.chat.id] && this.lastMessage[this.chat.id]!.msg_id === msg_id) {
          if (this.chat.messages.length > 0) {
            this.lastMessage[this.chat.id] = {msg_id: this.chat.messages[0]!.id, msg_content: this.chat.messages[0]!.content}
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

function computeContent(content: string, type: string) {
  if (type === "file") return "документ"
  else if (type === "image") return "изображение"
  else if (type === "video") return "видео"
  else return content
}