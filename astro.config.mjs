import { defineConfig } from 'astro/config';
import astroI18next from 'astro-i18next';
import tailwind from '@astrojs/tailwind';
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: 'https://www.zelify.com',
  base: '/',
  output: 'static',
  integrations: [
    tailwind(),
    astroI18next(),
    react()
  ],
  experimental: {
    assets: true
  }
});