export const Scheme = {
  LIGHT: 'retro',
  DARK: 'dracula',
  WHITE: 'lofi',
  BLACK: 'black',
} as const

// defaultTheme es del tipo de cada valor de Theme
export type ThemeScheme = (typeof Scheme)[keyof typeof Scheme]
export type Theme = keyof typeof Scheme

export const defaultScheme: [theme: Theme, scheme: ThemeScheme] = [
  'LIGHT',
  'retro',
]
