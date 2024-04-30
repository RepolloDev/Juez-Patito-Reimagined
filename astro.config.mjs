import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from "@astrojs/react";
import million from "million/compiler";

import vercelServerless from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react()],
  // vite: {
  //   plugins: [million.vite({
  //     mode: 'react',
  //     server: true,
  //     auto: true,
  //   })]
  // },
  output: "hybrid",
  adapter: vercelServerless(
    {
      edgeMiddleware: true,
    }
  )
});