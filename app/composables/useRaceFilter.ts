import type { Query, QueryFilter } from '@directus/sdk'
import type { CustomDirectusTypes, Race } from '~/types/directusTypes'

export type RaceQuery = Query<CustomDirectusTypes, Race>
export type RaceTerrain = 'forest' | 'urban' | 'mix' | undefined | null

export interface RaceFilter {
  deadline: boolean
  searchString: string | undefined
  terrain?: RaceTerrain
  geographicalScale: string | undefined
  regions?: string[]
  previousDays: number
  limit: number
  page: number
}

export const useRaceFilter = () => {
  const filter = ref<RaceFilter>({
    deadline: false,
    searchString: undefined,
    terrain: undefined,
    geographicalScale: undefined,
    regions: [],
    previousDays: 0,
    limit: 25,
    page: 1,
  })

  function initFilter(props: Partial<RaceFilter>) {
    filter.value.deadline = props?.deadline || false
    filter.value.searchString = props?.searchString
    filter.value.terrain = props?.terrain
    filter.value.geographicalScale = props?.geographicalScale
    filter.value.regions = props?.regions || []
    filter.value.previousDays = props?.previousDays || 0
    filter.value.limit = props?.limit || 25
    filter.value.page = props?.page || 1
  }

  function composeRaceQuery({
    initialLoad,
  }: {
    initialLoad?: boolean
  }): RaceQuery {
    let limit = filter.value.limit
    let page = filter.value.page

    const filterDate = new Date(new Date().setHours(0, 0, 0, 0))
    filterDate.setDate(filterDate.getDate() - filter.value.previousDays + 1)
    const filterDateIso = filterDate.toISOString()

    // in case of initial load
    if (initialLoad && page > 1) {
      limit = page * limit
      page = 1
    }

    // base query
    const composedFilter: RaceQuery = {
      limit,
      page,
      sort: 'date',
      filter: {
        date: {
          _gte: filterDateIso,
        },
        terrain: {
          _eq: filter.value.terrain,
        },
      },
    } as RaceQuery

    // add deadline filter
    if (filter.value.deadline) {
      composedFilter.filter = {
        ...composedFilter.filter,
        _and: [
          {
            deadline: {
              _nnull: true,
            },
          },
          {
            deadline: {
              _gte: filterDateIso,
            },
          },
        ],
        // reset date filter
        date: {},
      } as QueryFilter<CustomDirectusTypes, Race>

      composedFilter.sort = 'deadline'
    }

    // add geographical scale filter
    if (filter.value.geographicalScale) {
      composedFilter.filter = {
        ...composedFilter.filter,
        geographicalScale: {
          _eq: filter.value.geographicalScale,
        },
      }
    }

    // add region filter
    if (filter.value.regions?.length) {
      const regionsOrFilter = filter.value.regions.map((region) => ({
        region: { _eq: region },
      }))

      composedFilter.filter = {
        ...composedFilter.filter,
        _or: regionsOrFilter,
      }
    }

    // add search
    if (filter.value.searchString) {
      composedFilter.search = filter.value.searchString
    }

    return composedFilter
  }

  return {
    filter,
    initFilter,
    composeRaceQuery,
  }
}
