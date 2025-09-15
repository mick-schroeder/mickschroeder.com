import type { GatsbyConfig } from "gatsby";

const IS_PROD = process.env.NODE_ENV === "production";
const GATSBY_SITE_URL = process.env.GATSBY_SITE_URL || "https://www.mickschroeder.com";

const IS_DEV = process.env.NODE_ENV !== "production";
const config: GatsbyConfig = {
  siteMetadata: {
    title: `Mick Schroeder`,
    description:
      `Irish-American indie software developer and pharmacist.`,
    siteUrl: GATSBY_SITE_URL,
    author: `Mick Schroeder`,
    image: `/images/og-card.png`,
    social: {
      twitter: `@mick_schroeder`,
      github: `mick-schroeder`,
      linkedin: `schroedermick`,
      email: `mick@mickschroeder.com`,
    },
    person: {
      fullName: `Mick Schroeder, Pharm.D.`,
      givenName: `Michael`,
      familyName: `Schroeder`,
      alternateName: `Mick`,
      jobTitle: `Informatics Pharmacist`,
      alumniOf: [
        { name: `Trinity College Dublin`, url: `https://www.tcd.ie/` },
        { name: `Philadelphia College of Pharmacy`, url: `https://www.sju.edu/departments/philadelphia-college-pharmacy` },
      ],
    },
  },
  flags: {
    FAST_DEV: true,
    DEV_SSR: false,
  },
    graphqlTypegen: {
    typesOutputPath: `${__dirname}/.cache/types/gatsby-types.d.ts`,
  },
  plugins: [
    "gatsby-plugin-postcss",
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    "gatsby-transformer-json",

    // Data sources
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/data/`, // contains /en/projects.json and /ga/projects.json
        ignore: ["**/.DS_Store", "**/Thumbs.db"],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images/`,
        ignore: ["**/.DS_Store", "**/Thumbs.db"],
      },
    },
    // Also source static images so plugin-image can process icons referenced from JSON
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `static_images`,
        path: `${__dirname}/static/images/`,
        ignore: ["**/.DS_Store", "**/Thumbs.db"],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/locales`,
        name: `locale`,
        ignore: ["**/.DS_Store", "**/Thumbs.db"],
      },
    },

    // i18n
    {
      resolve: `gatsby-plugin-react-i18next`,
      options: {
        localeJsonSourceName: `locale`,
        languages: [`en`, `ga`],
        defaultLanguage: `en`,
        siteUrl: GATSBY_SITE_URL,
        trailingSlash: "always",
        i18nextOptions: {
          interpolation: { escapeValue: false },
          keySeparator: false,
          nsSeparator: false,
        },
        pages: [],
      },
    },

    // PWA manifest
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Mick Schroeder`,
        short_name: `Schroeder`,
        description:
          `Mick Schroeder — Indie software developer and pharmacist.`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#111827`,
        display: `standalone`,
        icon: `src/images/icon.png`,
        icon_options: { purpose: `any maskable` },
      },
    },

    // Only in production
    ...(
      IS_PROD
        ? [
            // Google Analytics (GA4) via gtag.js
            ...(process.env.GATSBY_GTAG_ID
              ? [
                  {
                    resolve: `gatsby-plugin-google-gtag`,
                    options: {
                      trackingIds: [process.env.GATSBY_GTAG_ID],
                      // Global config for gtag.js
                      gtagConfig: {
                        anonymize_ip: true,
                      },
                      // Plugin behavior controls
                      pluginConfig: {
                        head: true,
                        respectDNT: true,
                      },
                    },
                  },
                ]
              : []),
            {
              resolve: `gatsby-plugin-sitemap`,
              options: {
                // Use defaults. If you want hreflang alternates in the sitemap later,
                // reintroduce a serialize function.
              },
            },
            {
              resolve: `gatsby-plugin-robots-txt`,
              options: {
                host: GATSBY_SITE_URL,
                sitemap: `${GATSBY_SITE_URL}/sitemap-index.xml`,
                policy: [{ userAgent: '*', allow: '/' }],
              },
            },
          ]
        : []
    ),
  ],
};

export default config;
