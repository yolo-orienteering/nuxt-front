export function useDeparture () {

  function formatDepartureTime (startTimeInMinutes: number | undefined | null): string {
    if (!startTimeInMinutes) {
          return 'Unbekannte Startzeit'
        }
      
        const hours = Math.floor(startTimeInMinutes / 60).toString().padStart(2, '0')
        const minutes = (startTimeInMinutes % 60).toString().padStart(2, '0')
        return `${hours}:${minutes}`
  }

  return {
    formatDepartureTime
  }
}