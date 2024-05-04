import { Palette } from '@phosphor-icons/react'
import { defaultTheme, Themes } from '@constants/themes'
import type { Theme } from '@constants/themes'
import { useState, useEffect } from 'react'
import { useStore } from '@nanostores/react'
import { isThemeUpdating } from '@stores/themeStore'
import Dropdown, { type DropdownProps } from '@components/Dropdown'


interface ThemeSelectorProps extends Omit<DropdownProps, 'button' | 'content'> { }

export default function ThemeSelector(props: ThemeSelectorProps) {

  const [currentTheme, setTheme] = useState<Theme>(defaultTheme)
  const $updating = useStore(isThemeUpdating)

  useEffect(() => {
    const localTheme = localStorage.getItem('theme')
    const inThemes = Object.values(Themes).find(
      (theme) => theme.themeName === localTheme
    )
    if (inThemes) {
      setTheme(inThemes)
    } else {
      setTheme(defaultTheme)
    }
  }, [$updating])

  return (
    <Dropdown
      {...props}
      button={<Palette size={24} className="w-5 lg:w-10" weight="duotone" />}
      content={
        <ul
          tabIndex={0}
          className={`dropdown-content z-[1] p-2 shadow flex flex-col bg-base-100 rounded-md w-52 gap-2`}>
          {Object.values(Themes).map((theme) => (
            <li key={theme.themeName}>
              <button
                onClick={() => isThemeUpdating.set(!$updating)}
                data-set-theme={theme.themeName}
                data-theme={theme.themeName}
                className={`rounded-md flex w-full p-2 px-4 border-2 ${currentTheme === theme ? 'border-neutral' : 'border-transparent'}`}>
                <span className="w-full flex items-center gap-2 ">
                  {theme.name}
                </span>
                <span className="grid grid-cols-4 h-5 gap-1.5">
                  <span className="h-full w-1.5 bg-primary rounded-lg" />
                  <span className="h-full w-1.5 bg-secondary rounded-lg" />
                  <span className="h-full w-1.5 bg-accent rounded-lg" />
                  <span className="h-full w-1.5 bg-neutral rounded-lg" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      }
    />
  )
}