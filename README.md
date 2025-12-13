# [mickschroeder.com](https://mickschroeder.com)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Content: CC BY-NC 4.0](https://img.shields.io/badge/Content-CC%20BY--NC%204.0-blue.svg)](CONTENT_LICENSE)

Personal site for Mick Schroeder, PharmD — Irish-American indie software developer + pharmacist.

![screenshot](src/assets/projects/screenshot-mickschroeder.png)

## Tech Stack

- [Astro](https://astro.build/) with static prerender
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) styles via custom Astro wrappers
- [Lucide Astro](https://lucide.dev/) icons (inline SVG)
- i18n (en, ga) via Astro i18n routing
- Partytown-enabled Google Analytics (optional, requires env var)
- Sitemap/robots via `@astrojs/sitemap`

## Getting Started

```bash
git clone https://github.com/mick-schroeder/mickschroeder.com.git
cd mickschroeder.com
npm install
npm run dev
```

Open `http://localhost:4321`.

### Build / Preview

```bash
npm run build
npm run preview
```

## Customization

- Site config: `src/config/site.ts` (title, description, social, person metadata)
- Copy/translations: `src/locales/en/common.json`, `src/locales/ga/common.json`
- Projects: `src/data/projects/en.json`, `src/data/projects/ga.json`
- Socials: `src/data/socials/en.json`, `src/data/socials/ga.json`
- Styles: `src/styles/global.css`
- GA: set `PUBLIC_GTAG_ID` (e.g., `G-XXXX`) to enable analytics

## Deployment

- Static output in `dist/`
- AWS Amplify: see `amplify.yml` (Node 22, `npm ci`, `npm run build`)

## License

- Code: [MIT](LICENSE)
- Content (non-code): [CC BY-NC 4.0](CONTENT_LICENSE)

Logos, trademarks, and certain media assets may be excluded and remain All Rights Reserved unless explicitly licensed.
