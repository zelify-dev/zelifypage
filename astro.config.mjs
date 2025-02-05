import { defineConfig } from 'astro/config';
import astroI18next from 'astro-i18next';
import tailwind from '@astrojs/tailwind';
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: 'https://www.zelify.com',
  base: '/',
  output: 'static',
  vite: {
    build: {
      charset: 'utf8',
    },
  },
  integrations: [
    tailwind(),
    astroI18next({
      i18next: {
        debug: true,
        defaultLocale: 'en',
        supportedLanguages: ['en', 'es'],
        fallbackLng: 'en',
        load: 'languageOnly',
      }
    }),
    react()
  ],
  experimental: {
    assets: true
  }
});