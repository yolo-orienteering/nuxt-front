<template>
  <div class="q-pt-md">
    <!-- filter
    <Teleport v-if="teleportToMenuEl" :to="teleportToMenuEl">
      <races-filter
        v-show="races"
        :loading="loading"
        @update:filter="updateFilter()"
      />
    </Teleport> -->

    <!-- <race-timeline
      v-if="races"
      :races="races"
      :loading="loading"
      @load-more="loadMore()"
    /> -->
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import RaceTimeline from '~/components/races/raceTimeline.vue'
  import RacesFilter from '~/components/races/racesFilter.vue'
  import { useSyncCenter } from '~/stores/useSyncCenter'
  import type { Race } from '~/types/directusTypes'
  import { useApi } from '~/stores/useApi'
  import { readItems } from '@directus/sdk'

  // defining races
  const loading = ref<boolean>(false)
  const teleportToMenuEl = ref<HTMLElement | null>(null)

  // initially loads races with onMounted hook within composable
  const syncCenter = useSyncCenter()
  const notify = useNotify()
  const { directus } = useApi()
  const races = ref<Race[]>([])

  onMounted(async () => {
    // teleportToMenuEl.value = document.getElementById('teleport-to-menu')
    // await initialLoad()
  })

  async function initialLoad(): Promise<void> {
    loading.value = true
    const query = syncCenter.filter.composeRaceQuery({ initialLoad: true })
    races.value = await directus.request<Race[]>(readItems('Race', query))
    loading.value = false
  }

  async function updateFilter(): Promise<void> {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
    syncCenter.filter.page = 1
    const query = syncCenter.filter.composeRaceQuery({})
    races.value = await directus.request<Race[]>(readItems('Race', query))
  }

  async function loadMore(): Promise<void> {
    syncCenter.filter.page += 1
    const query = syncCenter.filter.composeRaceQuery({})
    const newRaces = await directus.request<Race[]>(readItems('Race', query))

    // no new races
    if (!newRaces.length) {
      syncCenter.filter.page -= 1
      notify.info({
        text: 'Keine weiteren Läufe verfügbar',
      })
      return
    }
    races.value = [...races.value, ...newRaces]
  }
</script>
