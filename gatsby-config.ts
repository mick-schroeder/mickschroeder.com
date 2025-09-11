import type { GatsbyConfig } from "gatsby";

const IS_PROD = process.env.NODE_ENV === "production";
const SITE_URL = "https://www.mickschroeder.com";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Mick Schroeder`,
    siteUrl: SITE_URL,
  },
  flags: {
    FAST_DEV: true,
    DEV_SSR: false,
  },
  graphqlTypegen: true,
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
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/locales`,
        name: `locale`,
      },
    },

    // i18n
    {
      resolve: `gatsby-plugin-react-i18next`,
      options: {
        localeJsonSourceName: `locale`,
        languages: [`en`, `ga`],
        defaultLanguage: `en`,
        siteUrl: SITE_URL,
        trailingSlash: "always",
        i18nextOptions: {
          interpolation: { escapeValue: false },
          keySeparator: false,
          nsSeparator: false,
        },
        pages: [],
      },
    },

    // PWA manifest )
    {
      resolve: `gatsby-plugin-manifest`,
      options: { icon: `src/images/icon.png` },
    },

    // Only include analytics + sitemap in production
    ...(
      IS_PROD
        ? [
            {
              resolve: `gatsby-plugin-google-gtag`,
              options: {
                trackingIds: ["G-XXXXXXXXXX"],
              },
            },
            {
              resolve: `gatsby-plugin-sitemap`,
              options: {
                // Optional: exclude dev-404 or any i18n helper routes if needed
                exclude: ["/dev-404-page/"],
              },
            },
          ]
        : []
    ),
  ],
};

export default config;
