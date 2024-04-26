export const Scheme = {
    LIGHT: 'retro',
    DARK: 'dracula',
    WHITE: 'lofi',
    BLACK: 'black'
} as const

// defaultTheme es del tipo de cada valor de Theme
export type Theme = typeof Scheme[keyof typeof Scheme]
export const defaultTheme: Theme = Scheme.LIGHT