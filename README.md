# [mickschroeder.com](https://mickschroeder.com)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Content: CC BY 4.0](https://img.shields.io/badge/Content-CC%20BY%204.0-blue.svg)](CONTENT_LICENSE.md)

Website of Mick Schroeder, PharmD. Irish-American Indie Software Developer + Pharmacist 🇮🇪 🇺🇸

![screenshot](https://github.com/mick-schroeder/gatsby-schroeder/raw/master/src/assets/images/screenshot.gif)

## Development

```
git clone https://github.com/mick-schroeder/mickschroeder.com.git
cd mickschroeder.com
npm install
npm run develop
```

Open `http://localhost:8000`

## Production

```
npm run build
```
## Customize Your Fork

- Site config: edit `gatsby-config.ts` → `siteMetadata`
  - `title`, `description`, `siteUrl`
  - `social`: usernames or email
  - `person`: full name, job title, alumniOf
- Copy and translations: `locales/en/common.json` and `locales/ga/common.json`
- Projects: add/edit `src/data/en/projects.json` and `src/data/ga/projects.json`
  - Optional per‑project fields: `repo`, `homepage`, `language`, `license`, `links`
- Socials: add/edit `src/data/en/socials.json` and `src/data/ga/socials.json`
  - Provide `title`, `cta`, `url`, and optional `icon` (e.g. `/images/socials/github.svg`)
- Env vars: copy `.env.example` to `.env` and set `SITE_URL` (and `GTAG_ID` if used)

Node version: use `nvm use` (see `.nvmrc`) or Node 22.10+.

## Author

- [Mick Schroeder](https://mickschroeder.com)

## License

- Code: [MIT](LICENSE)
- Content (non-code): [CC BY 4.0](CONTENT_LICENSE.md)

Logos, trademarks, and certain media assets may be excluded and remain All Rights Reserved unless explicitly licensed.
