import { readItems } from '@directus/sdk'
import { useSyncCenter } from '@/stores/syncCenter'
import type { FollowingUserDeparture } from '@/stores/syncCenter'
import { useApi } from '@/stores/useApi'
import type { UserDeparture } from '@/types/DirectusTypes'

export function useFollowingUserDepartures() {
  const { followingUserDepartures } = useSyncCenter()
  const { directus } = useApi()

  async function getFollowingUserDeparturesbyRace(
    raceId: string
  ): Promise<UserDeparture[] | false> {
    try {
      const userDepartureIds: string[] = followingUserDepartures
        .filter((following) => following.race === raceId)
        .map((following) => following.id)

      return await directus.request<UserDeparture[]>(
        readItems('UserDeparture', {
          filter: {
            id: {
              _in: userDepartureIds,
            },
          },
          fields: [
            'id',
            'startTimeInMinutes',
            {
              raceCategory: ['id', 'name'],
              user: ['first_name', 'last_name', 'birthYear'],
            },
            'race',
          ],
          sort: ['startTimeInMinutes'],
          limit: -1,
        })
      )
    } catch (error) {
      console.log(error)
      return false
    }
  }

  function followOrUnfollowUserDepartures(
    userDeparture: FollowingUserDeparture
  ): void {
    const index = followingUserDepartures.findIndex(
      (following) => following.id === userDeparture.id
    )
    if (index !== -1) {
      followingUserDepartures.splice(index, 1)
    } else {
      followingUserDepartures.push(userDeparture)
    }
  }

  return { getFollowingUserDeparturesbyRace, followOrUnfollowUserDepartures }
}
