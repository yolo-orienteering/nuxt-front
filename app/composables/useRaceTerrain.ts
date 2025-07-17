import type { RaceTerrain } from '@/classes/RaceFilter'

export function useRaceTerrain() {
  function getTerrainIcon(terrain: RaceTerrain): string | undefined {
    if (terrain === 'forest') {
      return 'forest'
    } else if (terrain === 'urban') {
      return 'location_city'
    } else if (terrain === 'mix') {
      return 'nature'
    } else {
      return 'grass'
    }
  }

  function getTerrainText(terrain: RaceTerrain): string | undefined {
    if (terrain === 'forest') {
      return 'Wald'
    } else if (terrain === 'urban') {
      return 'Urban'
    } else if (terrain === 'mix') {
      return 'Mix'
    } else {
      return 'Terrain'
    }
  }

  return {
    getTerrainIcon,
    getTerrainText,
  }
}
