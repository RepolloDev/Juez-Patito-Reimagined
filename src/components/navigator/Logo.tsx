import { Theme } from '../../const/themes'
import { useState, useEffect } from 'react'
import { useStore } from '@nanostores/react'
import { isThemeUpdating } from '../../stores/themeStore'
import { ReactSVG } from 'react-svg'

export default function Logo() {
  const logoThemes: Record<string, string> = {
    [Theme.LIGHT]: "/light.svg",
    [Theme.DARK]: "/dark.svg",
    [Theme.WHITE]: "/white.svg",
    [Theme.BLACK]: "/black.svg",
  }

  const [currentTheme, setTheme] = useState<string>(Theme.LIGHT)
  const $updating = useStore(isThemeUpdating)

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    if (theme) {
      setTheme(theme)
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