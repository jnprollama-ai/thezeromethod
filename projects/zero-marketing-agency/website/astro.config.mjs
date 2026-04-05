import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://thezeromethod.com',
  output: 'hybrid',
  adapter: vercel(),
  integrations: [tailwind()],
});
