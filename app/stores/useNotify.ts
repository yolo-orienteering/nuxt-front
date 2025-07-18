import { defineStore } from 'pinia'
import { onMounted, ref } from 'vue'

type NotificationType = 'success' | 'info' | 'error'
interface Notification {
  type: NotificationType
  text: string
  timeout: number
  createdAt: Date
}

export const useNotify = defineStore('useNotify', () => {
  const DEFAULT_TIMEOUT_MS = 5000
  const notifications = ref<Notification[]>([])
  const intervalId = ref()

  function success({ text, timeout }: { text: string; timeout?: number }) {
    notify({ type: 'success', text, timeout })
  }

  function info({ text, timeout }: { text: string; timeout?: number }) {
    notify({ type: 'info', text, timeout })
  }

  function error({ text, timeout }: { text: string; timeout?: number }): void {
    notify({ type: 'error', text, timeout })
  }

  function notify(
    notification: Pick<Notification, 'type' | 'text'> & { timeout?: number }
  ) {
    notifications.value.push({
      ...notification,
      timeout: notification.timeout || DEFAULT_TIMEOUT_MS,
      createdAt: new Date(),
    })
  }

  /**
   * Remove notifications, which timeout is due
   */
  function timeoutKiller() {
    const now = new Date().getTime()
    const livingNotification = notifications.value.filter(
      (notification) =>
        notification.createdAt.getTime() + notification.timeout > now
    )
    // replace living notifications
    notifications.value = livingNotification
  }

  onMounted(() => {
    intervalId.value = setInterval(() => {
      timeoutKiller()
    }, 1000)
  })

  onBeforeUnmount(() => {
    clearInterval(intervalId.value)
  })

  return { success, info, error, notifications }
})
