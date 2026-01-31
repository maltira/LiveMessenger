import { ref } from 'vue'

export interface NotificationOptions {
  description: string
  duration?: number
}

interface NotificationItem extends NotificationOptions {
  id: number
  visible: boolean
  show: boolean
}

const notifications = ref<NotificationItem[]>([])
let idCounter = 0

export function useNotification() {
  const showNotification = (options: NotificationOptions) => {
    const id = idCounter++
    const notification = {
      id,
      duration: 4500,
      visible: false, // начинаем невидимым
      show: true, // флаг для начала анимации
      ...options,
    }

    notifications.value.push(notification)

    setTimeout(() => {
      const notificationIndex = notifications.value.findIndex((n) => n.id === id)
      if (notificationIndex > -1) {
        notifications.value[notificationIndex]!.visible = true
      }
    }, 10)

    if (notification.duration > 0) {
      setTimeout(() => {
        hideNotification(id)
      }, notification.duration)
    }
  }

  const hideNotification = (id: number) => {
    const notification = notifications.value.find((element) => element.id === id)
    if (notification) {
      notification.visible = false

      // Удаляем после завершения анимации
      setTimeout(() => {
        notification.show = false
        setTimeout(() => {
          const index = notifications.value.findIndex((element) => element.id === id)
          if (index > -1) {
            notifications.value.splice(index, 1)
          }
        }, 300)
      }, 300)
    }
  }

  const removeNotification = (id: number) => {
    hideNotification(id)
  }

  const infoNotification = (description: string) => {
    showNotification({ description: description })
  }

  return {
    notifications,
    showNotification,
    hideNotification,
    removeNotification,
    infoNotification,
  }
}