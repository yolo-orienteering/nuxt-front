import {defineStore} from 'pinia'
import {computed, onMounted, ref} from 'vue'
import {useApi} from './useApi'
import {aggregate} from '@directus/sdk'

export const useRegion = defineStore('useRegion', () => {
  const { directus } = useApi()

  const allRegions = ref<{ region: string }[]>([])

  const regions = computed<{region: string}[]>(() => allRegions.value.filter(region => !!region))

  onMounted(async () => {
    await getRegions()
  })

  async function getRegions() {
    allRegions.value = await directus.request<{ region: string }[]>(
      aggregate('Race', {
        aggregate: {},
        groupBy: ['region']
      })
    )
  }

  return {
    regions
  }
})
