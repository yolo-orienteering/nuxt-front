export const useLocalStorage = () => {
  function getItem<T>(key: string): T | null {
    if (typeof window === 'undefined') {
      return null
    }
    const value = window.localStorage.getItem(key)
    if (!value) {
      return null
    }

    try {
      return JSON.parse(value) as T
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return value as T
    }
  }

  function setItem(key: string, value: string | undefined): void {
    if (typeof window === 'undefined' || !value) {
      return
    }

    window.localStorage.setItem(key, value)
  }

  function has(key: string): boolean | null {
    if (typeof window === 'undefined') {
      return null
    }
    return !!window.localStorage.getItem(key)
  }

  return {
    getItem,
    setItem,
    has,
  }
}
