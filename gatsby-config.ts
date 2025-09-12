import type { GatsbyConfig } from "gatsby";

const IS_PROD = process.env.NODE_ENV === "production";
const SITE_URL = process.env.SITE_URL || "https://www.mickschroeder.com";
const GTAG_ID = process.env.GTAG_ID;

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Mick Schroeder`,
    description:
      `Irish-American indie software developer and pharmacist.`,
    siteUrl: SITE_URL,
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
    typesOutputPath: `types/gatsby-types.d.ts`,
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
        icon: `src/images/projects/icon.png`,
        icon_options: { purpose: `any maskable` },
      },
    },

    // Only in production
    ...(
      IS_PROD
        ? [
            ...(GTAG_ID
              ? [{
                  resolve: `gatsby-plugin-google-gtag`,
                  options: { trackingIds: [GTAG_ID] },
                }]
              : []),
            {
              resolve: `gatsby-plugin-sitemap`,
              options: {
                // Exclude dev 404
                exclude: ["/dev-404-page/"],
                query: `
                  {
                    site { siteMetadata { siteUrl } }
                    allSitePage { nodes { path pageContext } }
                  }
                `,
                resolveSiteUrl: ({ site }: any) => site.siteMetadata.siteUrl,
                serialize: ({ site, allSitePage }: any) => {
                  const siteUrl: string = (site.siteMetadata.siteUrl || '').replace(/\/$/, '');
                  const ensureTrailingSlash = (p: string) => (p.endsWith('/') ? p : `${p}/`);
                  return allSitePage.nodes
                    .filter((n: any) => !n.path.includes('dev-404-page'))
                    .map((n: any) => {
                      const url = `${siteUrl}${n.path}`;
                      const i18n = n.pageContext?.i18n;
                      if (i18n) {
                        const languages: string[] = i18n.languages || [];
                        const defaultLanguage: string | undefined = i18n.defaultLanguage;
                        const originalPath: string = i18n.originalPath || '/';
                        const normalizedOriginal = originalPath && originalPath !== '/'
                          ? (originalPath.startsWith('/') ? originalPath : `/${originalPath}`)
                          : '/';
                        const links = languages.map((lng: string) => ({
                          lang: lng,
                          url: `${siteUrl}/${lng}${ensureTrailingSlash(normalizedOriginal)}`,
                        }));
                        if (defaultLanguage) {
                          links.push({
                            lang: 'x-default',
                            url: `${siteUrl}/${defaultLanguage}${ensureTrailingSlash(normalizedOriginal)}`,
                          });
                        }
                        return { url, links };
                      }
                      return { url };
                    });
                },
              },
            },
            {
              resolve: `gatsby-plugin-robots-txt`,
              options: {
                host: SITE_URL,
                sitemap: `${SITE_URL}/sitemap-index.xml`,
                policy: [{ userAgent: '*', allow: '/' }],
              },
            },
          ]
        : []
    ),
  ],
};

export default config;
