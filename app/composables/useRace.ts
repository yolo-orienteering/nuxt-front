import { useSyncCenter } from '@/stores/syncCenter'
import type { Race, RaceInstruction } from '@/types/DirectusTypes'

type RaceLinkType =
  | 'event'
  | 'publication'
  | 'ranking'
  | 'inscription'
  | 'liveResult'
  | 'instruction'

export function useRace() {
  const syncCenter = useSyncCenter()

  function composeLink({
    race,
    linkType,
  }: {
    race: Race
    linkType: RaceLinkType
  }): string | undefined {
    let linkToOpen: string | undefined | null = undefined
    const raceInstruction = (race.instruction as RaceInstruction[])?.[0]
    switch (linkType) {
      case 'event':
        linkToOpen = race.eventLink
        break
      case 'inscription':
        linkToOpen = race.inscriptionLink
        break
      case 'publication':
        linkToOpen = race.publicationLink
        break
      case 'ranking':
        linkToOpen = race.rankingLink
        break
      case 'liveResult':
        linkToOpen = race.liveResultLink
        break
      case 'instruction':
        linkToOpen =
          raceInstruction?.linkOverwritten || raceInstruction?.linkCrawled
        break
      default:
        break
    }

    return linkToOpen || undefined
  }

  function addOrRemoveRace(race: Race) {
    const index = syncCenter.myRaces.findIndex((r) => r.id === race.id)
    if (index === -1) {
      syncCenter.myRaces.push(race)
    } else {
      syncCenter.myRaces.splice(index, 1)
    }
  }

  return {
    composeLink,
    addOrRemoveRace,
  }
}
