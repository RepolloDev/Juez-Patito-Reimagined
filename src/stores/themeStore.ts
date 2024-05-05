import { persistentAtom } from '@nanostores/persistent'
import { dataThemeKey } from '@constants/themes'
import { defaultTheme, type ThemeNames } from '@constants/themes'

export const themeStore = persistentAtom<ThemeNames>(
  dataThemeKey,
  defaultTheme.themeName
)
