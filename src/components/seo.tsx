import * as React from "react";
import { graphql, useStaticQuery } from "gatsby";
import { useI18next } from "gatsby-plugin-react-i18next";

type AlternateLink = {
  href: string;
  hrefLang: string;
};

export interface SEOProps {
  title?: string;
  description?: string;
  pathname?: string; // e.g. "/en/"
  image?: string; // path or absolute
  type?: "website" | "article";
  noindex?: boolean;
  alternates?: AlternateLink[];
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  pathname = "/",
  image,
  type = "website",
  noindex = false,
  alternates = [],
  jsonLd,
}) => {
  const data = useStaticQuery<{
    site: {
      siteMetadata: {
        title: string;
        description?: string;
        siteUrl: string;
        author?: string;
        image?: string;
        social?: {
          twitter?: string;
          github?: string;
          linkedin?: string;
          email?: string;
        };
      };
    };
  }>(graphql`
    query SEOConfigQuery {
      site {
        siteMetadata {
          title
          description
          siteUrl
          author
          image
          social {
            twitter
            github
            linkedin
            email
          }
        }
      }
    }
  `);

  const meta = data.site.siteMetadata;
  const metaTitle = title ? `${title} — ${meta.title}` : meta.title;
  const metaDescription = description || meta.description || "";
  const siteUrl = meta.siteUrl?.replace(/\/$/, "");
  const ensureTrailingSlash = (p: string) => (p.endsWith("/") ? p : `${p}/`);
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const url = `${siteUrl}${ensureTrailingSlash(normalizedPath)}`;
  const defaultImage = meta.image || "/images/icon.png";
  const imageUrl = image?.startsWith("http") ? image : `${siteUrl}${image || defaultImage}`;

  // i18n alternates (hreflang) centralized here
  const { languages, language, originalPath, defaultLanguage } = useI18next();
  const normalizedOriginalPath = originalPath && originalPath !== "/" ? (originalPath.startsWith("/") ? originalPath : `/${originalPath}`) : "/";
  const computedAlternates: AlternateLink[] =
    alternates && alternates.length
      ? alternates
      : (languages || []).map((lng) => ({
          href: `${siteUrl}${ensureTrailingSlash(`/${lng}${normalizedOriginalPath}`)}`,
          hrefLang: lng,
        })).concat(
          defaultLanguage
            ? [
                {
                  href: `${siteUrl}${ensureTrailingSlash(`/${defaultLanguage}${normalizedOriginalPath}`)}`,
                  hrefLang: "x-default",
                },
              ]
            : []
        );

  // Open Graph locale helpers
  const ogLocaleMap: Record<string, string> = {
    en: "en_US",
    ga: "ga_IE",
  };
  const ogLocale = ogLocaleMap[language as string] || "en_US";

  // Build default JSON-LD graph
  const ldWebSite = {
    "@type": "WebSite",
    name: meta.title,
    url: siteUrl,
  } as Record<string, unknown>;

  const ldPerson = {
    "@type": "Person",
    name: meta.author || meta.title,
    url: siteUrl,
    image: imageUrl,
    sameAs: [
      meta.social?.twitter ? `https://twitter.com/${meta.social.twitter.replace(/^@/, "")}` : undefined,
      meta.social?.github ? `https://github.com/${meta.social.github}` : undefined,
      meta.social?.linkedin ? `https://www.linkedin.com/in/${meta.social.linkedin}/` : undefined,
      meta.social?.email ? `mailto:${meta.social.email}` : undefined,
    ].filter(Boolean),
  } as Record<string, unknown>;

  const ldBreadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: url,
      },
    ],
  } as Record<string, unknown>;

  const extra = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  const graph = [ldWebSite, ldPerson, ldBreadcrumb, ...extra];
  const ld = { "@context": "https://schema.org", "@graph": graph };

  return (
    <>
      {/* Document-level attributes */}
      <html lang={language as string} />

      {/* Viewport for responsive layout */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <title>{metaTitle}</title>
      {metaDescription && <meta name="description" content={metaDescription} />}
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow"} />
      <link rel="canonical" href={url} />
      <meta name="color-scheme" content="light dark" />

      {/* Open Graph */}
      <meta property="og:title" content={metaTitle} />
      {metaDescription && <meta property="og:description" content={metaDescription} />} 
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={meta.title} />
      <meta property="og:image" content={imageUrl} />
      {metaDescription && <meta property="og:image:alt" content={metaDescription} />}
      <meta property="og:locale" content={ogLocale} />
      {(languages || []).filter((lng) => lng !== language).map((lng) => (
        <meta key={`og:alt:${lng}`} property="og:locale:alternate" content={ogLocaleMap[lng] || lng} />
      ))}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {meta.social?.twitter && (
        <meta name="twitter:site" content={`@${meta.social.twitter.replace(/^@/, "")}`} />
      )}
      {meta.social?.twitter && (
        <meta name="twitter:creator" content={`@${meta.social.twitter.replace(/^@/, "")}`} />
      )}
      <meta name="twitter:title" content={metaTitle} />
      {metaDescription && <meta name="twitter:description" content={metaDescription} />}
      <meta name="twitter:image" content={imageUrl} />

      {/* Alternates */}
      {computedAlternates.map((alt) => (
        <link key={alt.href + alt.hrefLang} rel="alternate" href={alt.href} hrefLang={alt.hrefLang} />
      ))}

      {/* Structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
};

export default SEO;
