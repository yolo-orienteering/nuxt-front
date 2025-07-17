import {useQuasar} from 'quasar'

export function useNewsletter() {
  const localStorage = useQuasar().localStorage

  function rememberSubscription () {
    localStorage.set('NEWSLETTER', true)
  }

  function isSubscribed (): boolean {
    return localStorage.has('NEWSLETTER')
  }

  return {
    rememberSubscription,
    isSubscribed
  }
}
