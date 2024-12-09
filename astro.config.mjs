import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import vercel from '@astrojs/vercel/serverless'

import solidJs from '@astrojs/solid-js'

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), solidJs()],
  output: 'server',
  adapter: vercel(),
  devToolbar: {
    enabled: false,
  },
})
