import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from "@astrojs/react";
import million from "million/compiler";

import vercelServerless from "@astrojs/vercel/serverless";
// import node from "@astrojs/node"

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react()],
  vite: {
    plugins: [million.vite({
      mode: 'react',
      server: true,
      auto: true,
    })]
  },
  compressHTML: true,

  // Output to Vercel Serverless
  output: "server",
  adapter: vercelServerless(
    {
      edgeMiddleware: true,
    }
  ),

  // Output to node server
  // output: "server",
  // adapter: node({
  //   mode: "middleware"
  // })
});