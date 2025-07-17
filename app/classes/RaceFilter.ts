import { Query, QueryFilter } from '@directus/sdk'
import { CustomDirectusTypes, Race } from 'src/types/DirectusTypes'

export type RaceQuery = Query<CustomDirectusTypes, Race>
export type RaceTerrain = 'forest' | 'urban' | 'mix' | undefined | null

export default class RaceFilter {
  public deadline: boolean
  public searchString: string | undefined
  public terrain?: RaceTerrain
  public geographicalScale: string | undefined
  public regions?: string[]
  public previousDays: number
  public limit: number
  public page: number

  constructor (props?: Partial<RaceFilter>) {
    this.deadline = props?.deadline || false
    this.searchString = props?.searchString
    this.terrain = props?.terrain
    this.geographicalScale = props?.geographicalScale
    this.regions = props?.regions || []
    this.previousDays = props?.previousDays || 0
    this.limit = props?.limit || 25
    this.page = props?.page || 1
  }

  public composeRaceQuery ({initialLoad}: {initialLoad?: boolean}): RaceQuery {
    let limit = this.limit
    let page = this.page

    const filterDate = new Date(new Date().setHours(0, 0, 0, 0))
    filterDate.setDate(filterDate.getDate() - this.previousDays + 1)
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
          _gte: filterDateIso
        },
        terrain: {
          _eq: this.terrain
        }
      }
    } as RaceQuery

    // add deadline filter
    if (this.deadline) {
      composedFilter.filter = {
        ...composedFilter.filter,
        _and: [
          {
            deadline: {
              _nnull: true,
            }
          },
          {
            deadline: {
              _gte: filterDateIso
            },
          }
        ],
        // reset date filter
        date: {}
      } as QueryFilter<CustomDirectusTypes, Race>

      composedFilter.sort = 'deadline'
    }

    // add geographical scale filter
    if (this.geographicalScale) {
      composedFilter.filter = {
        ...composedFilter.filter,
        geographicalScale: {
          _eq: this.geographicalScale
        }
      }
    }

    // add region filter
    if (this.regions?.length) {
      const regionsOrFilter = this.regions.map(region => ({region: {_eq: region}}))

      composedFilter.filter = {
        ...composedFilter.filter,
        _or: regionsOrFilter
      }
    }

    // add search
    if (this.searchString) {
      composedFilter.search = this.searchString
    }
  
    return composedFilter
  }
}
