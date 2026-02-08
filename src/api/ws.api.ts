import { useBlockStore } from '@/stores/block.store.ts'
import { useOnlineStore } from '@/stores/online.store.ts'
import { useChatStore } from '@/stores/chats.store.ts'
import type { Message } from '@/types/chat/message.model.ts'

class WSStatusService {
  private wsUrl = import.meta.env.VITE_WS_API_URL
  private socket: WebSocket | null = null

  connect() {
    console.log('Connecting to WS server...')
    this.socket = new WebSocket(this.wsUrl + "/user/ws")

    this.socket.onopen = () => {
      console.log('WebSocket connected')
    }

    this.socket.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data)
        switch (msg.event_type) {
          case "block_update":
            useBlockStore().blockedMeBy[msg.blocker_id] = msg.is_blocked
            break
          case "status_update":
            const onlineStore = useOnlineStore()
            const { user_id, is_online, last_seen } = msg

            // обновляем только существующие записи в кеше (а новые подтягиваем по надобности)
            if (user_id in onlineStore.onlineProfiles) {
              // console.log("Получено событие", user_id, "(online:", is_online, ", last_seen:", last_seen, ")")
              onlineStore.onlineProfiles[user_id] = {
                online: is_online,
                last_seen: last_seen ? new Date(last_seen) : null,
              }
            }
            break
          case "new_message":
            const chatStore = useChatStore()
            const message: Message = {
              id: msg.id,
              chat_id: msg.chat_id,
              user_id: msg.user_id,
              content: msg.content,
              type: msg.type,
              created_at: msg.created_at,
              reply_to_message: msg.reply_to_message,
              edited_at: null,
            }
            console.log("new_message", message)
            chatStore.addMessage(msg.chat_id, message)
            break
          default:
            console.debug('[WS] Unknown event:', msg.event_type)
        }
      } catch (e) {
        console.error("[WS] websocket onmessage:", e)
      }
    }

    this.socket.onerror = (error) => {
      console.error('❌ WS error:', error)
    }

    this.socket.onclose = () => {
      this.disconnect()
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close()
      this.socket = null
      console.log('🔌 WS closed')
    }
  }
}

export const WSStatus = new WSStatusService()