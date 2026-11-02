// @ts-check
import { loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import partytown from "@astrojs/partytown";

const env = loadEnv(
  process.env.NODE_ENV ?? "production",
  process.cwd(),
  "PUBLIC_",
);
const analyticsId = process.env.PUBLIC_GTAG_ID || env.PUBLIC_GTAG_ID;

export default defineConfig({
  site: "https://www.mickschroeder.com",
  output: "static",
  trailingSlash: "always",
  i18n: {
    locales: ["en", "ga"],
    defaultLocale: "en",
    routing: { prefixDefaultLocale: false },
  },
  fonts: [
    {
      name: "Instrument Sans",
      cssVariable: "--font-instrument",
      provider: fontProviders.fontsource(),
      weights: [400, 500, 600, 700],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["Arial", "sans-serif"],
    },
    {
      name: "Newsreader",
      cssVariable: "--font-newsreader",
      provider: fontProviders.fontsource(),
      weights: [400, 600, 700],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["Georgia", "serif"],
    },
  ],
  vite: { plugins: [tailwindcss()] },
  integrations: [
    sitemap({
      filter: (page) =>
        !new URL(page).pathname.match(/^\/(en(?:\/|$)|404(?:[/.]|$))/),
    }),
    ...(analyticsId
      ? [partytown({ config: { forward: ["dataLayer.push"] } })]
      : []),
  ],
});
