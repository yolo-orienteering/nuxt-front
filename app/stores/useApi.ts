import { defineStore } from 'pinia'
import { createDirectus, rest } from '@directus/sdk'
import type { CustomDirectusTypes } from '../types/directusTypes'

export const useApi = defineStore('useApi', () => {
  const API_URL = (): string => {
    return (
      import.meta.env.VITE_API_URL ||
      'https://cic01at5ntdhf7wg13631.cleavr.xyz/'
    )
  }

  const directus = createDirectus<CustomDirectusTypes>(API_URL()).with(rest())

  return {
    directus,
  }
})
