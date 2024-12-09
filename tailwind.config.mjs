const { addIconSelectors } = require('@iconify/tailwind')

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './node_modules/preline/preline.js',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'geist-sans': ['Geist Sans', 'sans-serif'],
        'fira-code': ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    addIconSelectors(['ph']),
    require('preline/plugin'),
  ],
}
