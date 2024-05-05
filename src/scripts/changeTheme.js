import { themeStore } from '@stores/themeStore'
import { dataThemeKey } from '@constants/themes'

function changeThemeEvent() {
  const newTheme = themeStore.value
  document.documentElement.setAttribute(dataThemeKey, newTheme)
}

themeStore.subscribe(changeThemeEvent)
