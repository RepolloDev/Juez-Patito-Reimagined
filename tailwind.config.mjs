/** @type {import('tailwindcss').Config} */
import { themeSchemes } from './src/constants/themes'

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        geist: ['Geist Sans', 'sans-serif'],
        'victor-mono': ['Victor Mono Variable', 'monospace'],
        'major-mono': ['Major Mono Display', 'monospace'],
      },
    },
  },

  darkMode: 'selector',

  plugins: [require('daisyui'), require('@tailwindcss/typography')],
  daisyui: {
    themes: themeSchemes,
  },
}
