class WSStatusService {
  private wsUrl = import.meta.env.VITE_WS_API_URL
  private socket: WebSocket | null = null

  connect() {
    console.log('Connecting to WS server...')
    this.socket = new WebSocket(this.wsUrl + "/user/ws")

    this.socket.onopen = () => {
      console.log('WebSocket connected')
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