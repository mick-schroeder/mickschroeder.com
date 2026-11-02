# [mickschroeder.com](https://www.mickschroeder.com)

Personal site for Mick Schroeder, PharmD — Irish-American indie software developer and pharmacist.

Static Astro 7 pages, Tailwind CSS 4, native Astro components, Lucide SVG icons, and English/Irish routing. Fonts are served from the built site. No React runtime or client framework is required.

## Development

Use the Node version recorded in `.nvmrc` (currently 22.23.4):

```sh
nvm install
nvm use
npm ci
npm run dev
```

Open `http://localhost:4321`. To build and preview production output:

```sh
npm run build
npm run preview
```

Use `npx astro dev stop` or `npx astro preview stop` to stop a background server. Automated checks use `--ignore-lock` to run independent foreground servers.

## Content and components

- Site identity and contact information: `src/config/site.ts`.
- English and Irish interface strings: `src/locales/{en,ga}/common.json`. Both dictionaries must have the same keys.
- Projects and social links: `src/data/{projects,socials}/{en,ga}.json`. Keep project identities and order aligned across languages. Project images live in `src/assets/projects/` and are resolved centrally for both the page and JSON-LD.
- Shared homepage, privacy page, and footer components keep route files small. The substantive privacy policy is stored once in `src/data/privacy.ts`; update its effective date only when changing policy content.
- Styles: `src/styles/global.css`. Astro's Fonts API downloads the configured font files at build time and serves them locally. A fresh build needs network access to Fontsource.

English canonicals use `/` and `/privacy-policy/`. `/en/` and `/en/privacy-policy/` remain working aliases, excluded from the sitemap. Irish pages use `/ga/`. The Irish privacy page explains that the full policy is in English, links to it, and marks its English content with `lang="en"`.

Language links and all content work without JavaScript. The enhanced selector preserves the current section. The theme toggle follows system preferences by default, stores explicit choices under `theme-preference`, and still works when storage is unavailable.

## Optional analytics

Set `PUBLIC_GTAG_ID` to a GA4 measurement ID, such as `G-XXXXXXXXXX`, in the hosting environment or a local `.env` file. This enables Google Analytics through Partytown. When unset, no analytics scripts or Partytown runtime are emitted.

The analytics build test uses a placeholder ID and sends no analytics requests.

## Verification

Install the test browser once:

```sh
npx playwright install chromium
```

Then run:

```sh
npm run verify
```

This runs type/content checks, formatting, a production build, browser/accessibility tests, an analytics-enabled build check, and mobile Lighthouse audits for both languages. Lighthouse targets at least 95 in performance, accessibility, best practices, and SEO. Results depend on the machine and should be investigated when they fail.

Individual commands:

```sh
npm run check
npm run format:check
npm run build
npm test
npm run check:analytics
npm run audit:lighthouse
npm run audit:prod
```

`npm run format` applies formatting. Browser checks use port 4322; Lighthouse uses port 4323. Keep `PUBLIC_GTAG_ID` unset for the normal browser/performance checks. `CHROME_PATH` can override Lighthouse's browser executable.

GitHub Actions runs the same verification on pull requests and pushes to `main`, saving browser screenshots/traces and Lighthouse JSON reports. Local results are in `test-results/`, `playwright-report/`, and `output/lighthouse/` and are excluded from Git.

### Recorded results

Mobile Lighthouse audits on 2 November 2026 scored 100 for performance, accessibility, best practices, and SEO on both English and Irish homepages. Largest contentful paint was approximately 0.77 seconds in English and 0.75 seconds in Irish, with zero total blocking time and cumulative layout shift below 0.001. These are local lab measurements.

With analytics disabled, the production homepage contains 67,623 bytes of HTML and uses 49,339 bytes of CSS. Theme and language scripts are inline; no standalone JavaScript files or Partytown runtime are emitted.

### Dependency notes

TypeScript is pinned to version 6 because the stable Astro checker does not support TypeScript 7.

The dependency audit on 2 November 2026 reported no production vulnerabilities and five moderate findings in Lighthouse's development dependencies: `lighthouse` → `@sentry/node` → `@sentry/bundler-plugins` → `glob` / `minimatch`.

- `glob`: [GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4), filesystem traversal continuing after a cancellation timeout.
- `minimatch`: [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249), possible denial of service through amplified glob patterns.

These dependencies belong to the local/CI audit tool and are not shipped in the static site. The suggested forced fix downgrades Lighthouse from 13.6.0 to 13.5.0; check for an upstream dependency fix before applying forced updates.

## Deployment

AWS Amplify reads `.nvmrc`, runs `npm ci`, builds the site, and publishes `dist/`. GitHub Actions runs verification checks on pull requests and pushes to `main`.

## License

- Code: [MIT](LICENSE).
- Content: [CC BY-NC 4.0](CONTENT_LICENSE.md).

Logos, trademarks, and certain media assets may be excluded and remain All Rights Reserved unless explicitly licensed.
