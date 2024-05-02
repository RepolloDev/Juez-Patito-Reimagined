import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from "@astrojs/react";

import vercelServerless from "@astrojs/vercel/serverless";
// import node from "@astrojs/node"

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react()],
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