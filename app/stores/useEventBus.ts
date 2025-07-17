import { defineStore } from 'pinia'
import { EventBus } from 'quasar'

export const useEventBus = defineStore('useEventBus', () => {
  const eventBus = new EventBus()

  return {
    eventBus,
  }
})