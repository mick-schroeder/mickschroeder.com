// @ts-check

import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.mickschroeder.com',
  i18n: {
    locales: ['en', 'ga'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
  vite: {
      plugins: [tailwindcss()],
    },

  integrations: [
    react(),
    sitemap(),
    partytown({ config: { forward: ['dataLayer.push'] } }),
  ],
});
