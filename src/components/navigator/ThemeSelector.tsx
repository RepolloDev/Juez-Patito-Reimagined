import { Palette } from '@phosphor-icons/react'
import { Theme, defaultTheme } from '../../const/themes'
import { useState, useEffect } from 'react'
import { useStore } from '@nanostores/react'
import { isThemeUpdating } from '../../stores/themeStore'

export default function ThemeSelector() {
  const [currentTheme, setTheme] = useState<string>(defaultTheme)
  const $updating = useStore(isThemeUpdating)

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    if (theme) {
      setTheme(theme)
    }
  }, [$updating])

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-sm btn-ghost btn-circle">
        <Palette size={24} className="w-5 lg:w-10" weight="duotone" />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] p-2 shadow flex flex-col bg-base-100 rounded-md w-52 gap-2">
        {
          Object.values(Theme).map((theme) => (
            <li
              key={theme}
            >
              <button
                onClick={() => isThemeUpdating.set(
                  !$updating
                )}
                data-set-theme={theme}
                data-theme={theme}
                className={`rounded-md flex w-full p-2 px-4 border-2 ${currentTheme === theme ? 'border-neutral' : 'border-transparent'}`}>
                <span className="w-full flex items-center gap-2 ">
                  {theme}
                </span>
                <span className="grid grid-cols-4 h-5 gap-1.5">
                  <span className="h-full w-1.5 bg-primary rounded-lg" />
                  <span className="h-full w-1.5 bg-secondary rounded-lg" />
                  <span className="h-full w-1.5 bg-accent rounded-lg" />
                  <span className="h-full w-1.5 bg-neutral rounded-lg" />
                </span>
              </button>
            </li>
          ))
        }
      </ul>
    </div>
  )
}
