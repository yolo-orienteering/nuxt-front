import { IconSettings, IconSearch, IconBookmark } from '#components'
import type { FunctionalComponent } from 'vue'

export function useMenu() {
  const showBackButton = ref<boolean>(false)
  const router = useRouter()
  const route = useRoute()

  interface IMenuEntry {
    name: string
    icon: FunctionalComponent
    routeName: string
  }

  const menuEntries = ref<IMenuEntry[]>([
    {
      name: 'Einstellungen',
      icon: IconSettings,
      routeName: 'settings',
    },
    {
      name: 'Feed',
      icon: IconSearch,
      routeName: 'index',
    },
    {
      name: 'Meine Läufe',
      icon: IconBookmark,
      routeName: 'my-races',
    },
  ])

  // decide whether to show the back button or not
  router.afterEach((to) => {
    const insideMenuEntries: boolean = !!menuEntries.value.find(
      (menuEntry: IMenuEntry) => {
        return menuEntry.routeName === to.name
      }
    )
    const isDeparturesByCategory = route.name === 'departures-by-category'
    if (!insideMenuEntries && !isDeparturesByCategory) {
      showBackButton.value = true
    } else {
      showBackButton.value = false
    }
  })

  function isActiveRoute(routeName: string): boolean {
    return route.name === routeName
  }

  return {
    isActiveRoute,
    menuEntries,
    showBackButton,
  }
}
