import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from "@astrojs/react";

//import vercelServerless from "@astrojs/vercel/serverless";
//import node from "@astrojs/node";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react()]

  // Output to Vercel Serverless
  // output: "server",
  // adapter: vercelServerless(),

  // Output to node server
  // output: "server",
  // adapter: node({
  //   mode: "middleware"
  // })
  ,
  output: "server",
  adapter: netlify()
});