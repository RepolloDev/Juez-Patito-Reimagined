import { Scheme, type Theme } from '../../const/themes'
import { useState, useEffect } from 'react'
import { useStore } from '@nanostores/react'
import { isThemeUpdating } from '../../stores/themeStore'
import { ReactSVG } from 'react-svg'

export default function Logo() {
  const logoThemes: Record<string, string> = {
    [Scheme.LIGHT]: "/light.svg",
    [Scheme.DARK]: "/dark.svg",
    [Scheme.WHITE]: "/white.svg",
    [Scheme.BLACK]: "/black.svg",
  }

  const [currentTheme, setTheme] = useState<Theme>(Scheme.LIGHT)
  const $updating = useStore(isThemeUpdating)

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    if (theme && Object.values(Scheme).includes(theme as Theme)) {
      setTheme(theme as Theme)
    }
  }, [$updating])

  return (
    <ReactSVG
      src={logoThemes[currentTheme]}
      beforeInjection={(svg) => {
        svg.classList.add('object-contain')
        svg.classList.add('w-full')
        svg.classList.add('h-full')
      }}
      className='w-10 h-10 lg:w-14 lg:h-14'
      wrapper='span'
    />
  )
}