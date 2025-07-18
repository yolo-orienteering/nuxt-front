import { useLocalStorage } from './useLocalStorage'

export function useNewsletter() {
  const localStorage = useLocalStorage()

  function rememberSubscription() {
    localStorage.setItem('NEWSLETTER', 'true')
  }

  function isSubscribed(): boolean | null {
    return localStorage.has('NEWSLETTER')
  }

  return {
    rememberSubscription,
    isSubscribed,
  }
}
