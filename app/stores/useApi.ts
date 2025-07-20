import { defineStore } from 'pinia'
import { createDirectus, rest } from '@directus/sdk'
import type { CustomDirectusTypes } from '../types/directusTypes'

export const useApi = defineStore('useApi', () => {
  const config = useRuntimeConfig()

  const API_URL = config.public.apiUrl as string

  const directus = createDirectus<CustomDirectusTypes>(API_URL).with(rest())

  return {
    directus,
  }
})
