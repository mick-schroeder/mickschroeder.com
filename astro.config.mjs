// @ts-check
import { loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
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
