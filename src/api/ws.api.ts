import { useBlockStore } from '@/stores/block.store.ts'
import { useOnlineStore } from '@/stores/online.store.ts'

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
        if (msg.event_type === "block_update") {
          useBlockStore().blockedMeBy[msg.blocker_id] = msg.is_blocked
        }
        else if (msg.event_type === "status_update") {
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
        }
        else if (msg.event_type === "new_message") {

        }
      } catch (e) {
        console.error("websocket onmessage:", e)
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