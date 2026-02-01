import { useBlockStore } from '@/stores/block.store.ts'

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
        if (msg.type === "block_update") {
          useBlockStore().blockedMeBy[msg.blocker_id] = msg.is_blocked
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