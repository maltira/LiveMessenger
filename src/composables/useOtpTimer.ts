import { ref, onUnmounted } from 'vue'

export function useOtpTimer(seconds = 30) {
  const timeLeft = ref(0)
  const isActive = ref(false)

  let interval: number | null = null

  function start() {
    if (interval) return

    timeLeft.value = seconds
    isActive.value = true

    interval = window.setInterval(() => {
      timeLeft.value--

      if (timeLeft.value <= 0) {
        stop()
      }
    }, 1000)
  }

  function stop() {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
    isActive.value = false
    timeLeft.value = 0
  }

  onUnmounted(stop)

  return {
    timeLeft,
    isActive,
    start,
    stop,
  }
}
