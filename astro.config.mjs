import { defineConfig } from 'astro/config';
import astroI18next from 'astro-i18next';
import tailwind from '@astrojs/tailwind';
import react from "@astrojs/react";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  site: 'https://www.zelify.com',
  base: '/',
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  vite: {
    build: {
      charset: 'utf8',
    },
    ssr: {
      noExternal: ['three'],
    },
    optimizeDeps: {
      include: ['three'],
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
  ]
});