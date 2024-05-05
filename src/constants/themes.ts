export enum ThemeNames {
  // key : value in HTML data-theme
  LIGHT = 'light',
  DARK = 'dark',
  WHITE = 'white',
  BLACK = 'black',
}

export interface Theme {
  themeName: ThemeNames
  name: string
}

export interface Scheme {
  primary: string
  secondary: string
  accent: string
  neutral: string
  'base-100': string
  info: string
  success: string
  warning: string
  error: string
}

export interface ThemeScheme extends Theme {
  scheme: Scheme
}

const light: ThemeScheme = {
  themeName: ThemeNames.LIGHT,
  name: 'retro',
  scheme: {
    primary: '#ef9995',
    secondary: '#a4cbb4',
    accent: '#dc8850',
    neutral: '#2e282a',
    'base-100': '#e4d8b4',
    info: '#2563eb',
    success: '#16a34a',
    warning: '#d97706',
    error: '#f35248',
  },
}

const darkScheme: ThemeScheme = {
  themeName: ThemeNames.DARK,
  name: 'dracula',
  scheme: {
    primary: '#ff79c6',
    secondary: '#bd93f9',
    accent: '#ffb86c',
    neutral: '#414558',
    'base-100': '#282a36',
    info: '#8be9fd',
    success: '#50fa7b',
    warning: '#f1fa8c',
    error: '#ff5555',
  },
}

const whiteScheme: ThemeScheme = {
  themeName: ThemeNames.WHITE,
  name: 'lofi',
  scheme: {
    primary: '#0d0d0d',
    secondary: '#1a1919',
    accent: '#262626',
    neutral: '#000000',
    'base-100': '#ffffff',
    info: '#5fcfdd',
    success: '#69fec3',
    warning: '#ffce69',
    error: '#ff9181',
  },
}

const blackScheme: ThemeScheme = {
  themeName: ThemeNames.BLACK,
  name: 'black',
  scheme: {
    primary: '#373737',
    secondary: '#373737',
    accent: '#373737',
    neutral: '#373737',
    'base-100': '#141414',
    info: '#5fcfdd',
    success: '#69fec3',
    warning: '#ffce69',
    error: '#ff9181',
  },
}

const Schemes = [light, darkScheme, whiteScheme, blackScheme]
export const Themes = {} as Record<ThemeNames, ThemeScheme>
Schemes.forEach((scheme) => {
  Themes[scheme.themeName] = scheme
})

export const defaultTheme = light
export const themeSchemes = Object.values(Themes).map((theme) => ({
  [theme.themeName]: theme.scheme,
}))

export const dataThemeKey = 'data-theme'
