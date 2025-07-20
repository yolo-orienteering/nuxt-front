<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useSyncCenter } from '~/stores/useSyncCenter'
  import { useRegion } from '~/stores/useRegion'
  import type { RaceTerrain } from '~/classes/RaceFilter'
  import { useRaceTerrain } from '~/composables/useRaceTerrain'

  const { filter } = useSyncCenter()
  const regionStore = useRegion()
  const { getTerrainIcon, getTerrainText } = useRaceTerrain()

  const props = withDefaults(
    defineProps<{
      loading?: boolean
    }>(),
    {
      loading: false,
    }
  )

  const emits = defineEmits<{
    (e: 'update:filter'): void
  }>()

  onMounted(() => {
    searchEngine()
  })

  // text search helpers
  const lastSearchString = ref<string | undefined>(filter.searchString)

  /**
   * handles user search input
   */
  function searchEngine() {
    setInterval(() => {
      if (filter && filter?.searchString !== lastSearchString.value) {
        lastSearchString.value = filter.searchString
        emits('update:filter')
      }
    }, 1000)
  }

  function updateFilter({
    deadline,
    geographicalScale,
    previousDays,
    terrain,
  }: {
    deadline?: boolean
    geographicalScale?: string | null
    previousDays?: 'add' | 'reset'
    terrain?: RaceTerrain | null
  }) {
    if (deadline !== undefined) {
      filter.deadline = deadline
    }

    if (geographicalScale !== undefined) {
      filter.geographicalScale = geographicalScale || undefined
    }

    if (previousDays !== undefined) {
      if (previousDays === 'reset') {
        filter.previousDays = 0
      } else if (previousDays === 'add') {
        graduallyIncreasePreviousDays()
      }
    }

    if (terrain !== undefined) {
      filter.terrain = terrain || undefined
    }

    emits('update:filter')
  }

  function graduallyIncreasePreviousDays() {
    let daysToChange = 7
    const previousDays = filter.previousDays
    if (previousDays === 0 || previousDays === 1) {
      daysToChange = 1
    }

    if (previousDays === 2) {
      daysToChange = 5
    }

    filter.previousDays += daysToChange
  }
</script>

<template>
  <v-row v-if="filter" class="bg-white races-filter-container">
    <!-- deadline -->
    <v-col class="v-col-auto">
      <q-chip
        @click="updateFilter({ deadline: !filter.deadline })"
        :selected="filter.deadline"
        outline
        class="q-ml-none"
        color="primary"
        dense
        size="xl"
        icon-selected="notifications"
        :class="filter.deadline ? 'bg-primary text-white' : 'bg-white'"
      >
        <span class="text-body2">
          <q-icon v-if="!filter.deadline" name="notifications" size="sm" />
          Anmeldeschluss
        </span>
      </q-chip>
    </v-col>

    <!-- relevance -->
    <v-col class="v-col-auto">
      <q-chip
        @click="
          updateFilter({
            geographicalScale: filter.geographicalScale ? null : 'national',
          })
        "
        :selected="!!filter.geographicalScale"
        outline
        icon-selected="health_and_safety"
        class="q-ml-none"
        color="primary"
        dense
        size="xl"
        :class="filter.geographicalScale ? 'bg-primary text-white' : 'bg-white'"
      >
        <span class="text-body2">
          <q-icon
            v-if="!filter.geographicalScale"
            name="health_and_safety"
            size="sm"
          />
          Nat. Meisterschaft
        </span>
      </q-chip>
    </v-col>

    <!-- terrain -->
    <v-col class="v-col-auto">
      <q-chip
        class="q-ml-none"
        color="primary"
        dense
        size="xl"
        outline
        :selected="!!filter.terrain"
        :class="filter.terrain ? 'bg-primary text-white' : 'bg-white'"
        :removable="!!filter.terrain"
        @remove="updateFilter({ terrain: null })"
        :icon-selected="getTerrainIcon(filter.terrain)"
      >
        <span class="text-body2">
          <q-icon
            v-if="!filter.terrain"
            :name="getTerrainIcon(undefined)"
            size="sm"
          />
          {{ getTerrainText(filter.terrain) }}
        </span>

        <q-menu cover anchor="bottom left" auto-close class="text-no-wrap">
          <q-list>
            <q-item clickable @click="updateFilter({ terrain: 'urban' })">
              <q-item-section
                ><p class="q-mb-none">
                  <q-icon :name="getTerrainIcon('urban')" />
                  {{ getTerrainText('urban') }}
                </p></q-item-section
              >
            </q-item>
            <q-item clickable @click="updateFilter({ terrain: 'forest' })">
              <q-item-section
                ><p class="q-mb-none">
                  <q-icon :name="getTerrainIcon('forest')" />
                  {{ getTerrainText('forest') }}
                </p></q-item-section
              >
            </q-item>
            <q-item clickable @click="updateFilter({ terrain: 'mix' })">
              <q-item-section
                ><p class="q-mb-none">
                  <q-icon :name="getTerrainIcon('mix')" />
                  {{ getTerrainText('mix') }}
                </p></q-item-section
              >
            </q-item>
          </q-list>
        </q-menu>
      </q-chip>
    </v-col>

    <!-- previous -->
    <v-col class="v-col-auto">
      <q-chip
        @click="updateFilter({ previousDays: 'add' })"
        @remove="updateFilter({ previousDays: 'reset' })"
        :selected="!!filter.previousDays"
        outline
        icon-selected="touch_app"
        class="q-ml-none"
        color="primary"
        dense
        size="xl"
        :class="filter.previousDays ? 'bg-primary text-white' : 'bg-white'"
        :removable="!!filter.previousDays"
      >
        <span class="text-body2">
          <q-icon v-if="!filter.previousDays" name="refresh" size="sm" />
          <span v-if="filter.previousDays">
            -{{ filter.previousDays }}
            {{ filter.previousDays > 1 ? `Tage` : `Tag` }}
          </span>
          <span v-else> Frühere OLs </span>
        </span>
      </q-chip>
    </v-col>

    <!-- search -->
    <v-col :class="[!!filter?.searchString ? 'v-col-6' : 'v-col-4']">
      <q-input
        v-model="filter.searchString"
        :loading="props.loading"
        outlined
        label="Lauf suchen"
        color="primary"
        dense
        rounded
        label-color="primary"
        clearable
        clear-icon="close"
      />
    </v-col>

    <!-- region -->
    <v-col :class="[filter.regions ? 'v-col-7' : 'v-col-5']">
      <q-select
        v-model="filter.regions"
        :options="regionStore.regions.map((region) => region.region)"
        @update:model-value="emits('update:filter')"
        @clear="emits('update:filter')"
        dense
        rounded
        multiple
        outlined
        clearable
        color="primary"
        label-color="primary"
        label="Regionen"
      />
    </v-col>
  </v-row>
</template>

<style lang="scss">
  .races-filter-container {
    overflow-x: scroll;
  }
</style>
