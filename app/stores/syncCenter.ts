import { defineStore } from 'pinia'
import { useQuasar } from 'quasar'
import RaceFilter from '@/classes/RaceFilter'
import { useMyDepartures } from '@/composables/useMyDepartures'
import type { DirectusUsers, Race, UserDeparture } from '@/types/DirectusTypes'
import { computed, ref, watch } from 'vue'

export type FollowingUserDeparture = Pick<UserDeparture, 'id' | 'race'>

export const useSyncCenter = defineStore('syncCenter', () => {
  // NEW WAY!
  // todo: move others into new separate composable
  const myDepartures = useMyDepartures()

  /**
   * DEFINE DATA YOU WANT SYNC
   */
  const myRaces = ref<Race[]>([])
  const user = ref<Partial<DirectusUsers> | null>(null)
  const filter = ref<RaceFilter>(new RaceFilter())
  const followingUserDepartures = ref<FollowingUserDeparture[]>([])

  /**
   * DEFINE STORE KEY NAMES
   */
  // local storage variables
  const localStorage = useQuasar().localStorage
  const MY_RACES_STORAGE_KEY = 'my-races'
  const FILTERS_STORAGE_KEY = 'filters'
  const USER_STORAGE_KEY = 'user'
  const FOLLOWING_USER_DEPARTURES_STORAGE_KEY = 'following-user-departures'

  /**
   * INITIAL DATA READING FROM STORE
   */
  // load data from the local store
  readMyRaces()
  readFilters()
  readUser()
  readFollowingUserDepartures()
  function readMyRaces(): void {
    myRaces.value = localStorage.getItem<Race[]>(MY_RACES_STORAGE_KEY) || []
  }
  function readFilters(): void {
    const filtersFromStore: RaceFilter | null =
      localStorage.getItem<RaceFilter>(FILTERS_STORAGE_KEY)
    if (filtersFromStore) {
      filter.value = new RaceFilter(filtersFromStore)
    } else {
      filter.value = new RaceFilter()
    }
  }
  function readUser(): void {
    const userFromStore: Partial<DirectusUsers> | null =
      localStorage.getItem<Partial<DirectusUsers>>(USER_STORAGE_KEY)
    if (userFromStore) {
      user.value = userFromStore
    } else {
      user.value = {}
    }
  }
  function readFollowingUserDepartures(): void {
    const followingDeparturesFromStore: FollowingUserDeparture[] | null =
      localStorage.getItem<FollowingUserDeparture[]>(
        FOLLOWING_USER_DEPARTURES_STORAGE_KEY
      )

    if (followingDeparturesFromStore) {
      followingUserDepartures.value = followingDeparturesFromStore
    }
  }

  /**
   * WATCH CHANGES ON THE DATA AND SAVE THEM
   */
  // races
  watch(
    myRaces,
    () => {
      // sort by date
      localStorage.set(MY_RACES_STORAGE_KEY, myRaces.value)
    },
    { deep: true }
  )
  // filters
  watch(
    filter,
    () => {
      localStorage.set(FILTERS_STORAGE_KEY, filter.value)
    },
    { deep: true }
  )
  // user
  watch(
    user,
    () => {
      localStorage.set(USER_STORAGE_KEY, user.value)
    },
    { deep: true }
  )
  watch(
    followingUserDepartures,
    () => {
      localStorage.set(
        FOLLOWING_USER_DEPARTURES_STORAGE_KEY,
        followingUserDepartures.value
      )
    },
    {
      deep: true,
    }
  )

  /**
   * Computed data
   */

  const myRacesSorted = computed<Race[]>(() => {
    const fiveDaysAgoMs = new Date(
      new Date().setDate(new Date().getDate() - 4)
    ).setHours(0, 0, 0, 0)
    return myRaces.value
      .sort((a, b) => {
        const aDate = a.date
        const bDate = b.date
        if (!aDate || !bDate) {
          return 0
        }
        return new Date(aDate).getTime() - new Date(bDate).getTime()
      })
      .filter((race) => {
        // only return races in future.
        if (!race.date) {
          return false
        }
        return new Date(race.date).setHours(0, 0, 0, 0) >= fiveDaysAgoMs
      })
  })

  const userIdentifier = computed<string | false>(() => {
    if (
      !user.value?.first_name ||
      !user.value.last_name ||
      !user.value.birthYear
    ) {
      return false
    }

    return `${user.value.first_name}${user.value.last_name}${user.value.birthYear}`
      .replace(/\s+/g, '')
      .toLowerCase()
  })

  return {
    myRaces,
    myRacesSorted,
    user,
    filter,
    followingUserDepartures,
    userIdentifier,
    myDepartures,
  }
})
