import * as React from "react";
import { graphql, type HeadFC, type PageProps } from "gatsby";
import { useTranslation, Trans } from "gatsby-plugin-react-i18next";
import { Projects, type Project } from "@/components/projects";
import { Flag } from "@/components/flag";
//
import Socials, { type SocialItem } from "@/components/socials";
import Contact from "@/components/contact";
import { SEO, buildSoftwareSourceCodeJsonLd } from "@/components/seo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { FolderKanban, Share2, Mail } from "lucide-react";

type IndexPageData = {
  allProjectsJson: { nodes: Project[] };
  allSocialsJson: { nodes: SocialItem[] };
};

const IndexPage: React.FC<PageProps<IndexPageData>> = ({ data }) => {
  const { t } = useTranslation();
  
  return (
    <>
      <div className="text-center mb-6">

        {/* Translation Buttons */}
        <div className="my-3 flex justify-center">
          <LanguageSwitcher />
        </div>

        {/* Hero */}
        <p className="text-muted-foreground text-xl md:px-10">
          <Trans i18nKey="hero_line" components={{ b: <b className="pop-plus" /> }} />
        </p>

        {/* CTA Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" variant="secondary">
            <a href="#projects" className="inline-flex items-center gap-2">
              <FolderKanban className="h-5 w-5" aria-hidden="true" />
              {t("projects_heading")}
            </a>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <a href="#socials" className="inline-flex items-center gap-2">
              <Share2 className="h-5 w-5" aria-hidden="true" />
              {t("socials_heading")}
            </a>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <a href="#contact" className="inline-flex items-center gap-2">
              <Mail className="h-5 w-5" aria-hidden="true" />
              {t("contact_heading")}
            </a>
          </Button>
        </div>
      </div>

      <Flag />

      <section id="projects" className="mt-10">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold">
          <FolderKanban className="h-6 w-6 text-primary" aria-hidden="true" />
          {t("projects_heading")}
        </h2>
        <Projects projects={data.allProjectsJson.nodes as Project[]} />
      </section>

      <section id="socials" className="mt-10">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold">
          <Share2 className="h-6 w-6 text-primary" aria-hidden="true" />
          {t("socials_heading")}
        </h2>
        <Socials items={data.allSocialsJson.nodes} />
      </section>

      <section id="contact" className="mt-10">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold">
          <Mail className="h-6 w-6 text-primary" aria-hidden="true" />
          {t("contact_heading")}
        </h2>
        <Contact />
      </section>

      <footer className="mt-8 text-xs text-center opacity-80">
        <Trans
          i18nKey="footer_copy_html"
          components={{
            a1: <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer" />,
            a2: <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" />,
          }}
        />
      </footer>
    </>
  );
};

export default IndexPage;

export const Head: HeadFC = ({ location, data }) => {
  const siteUrl = (data as any).site.siteMetadata.siteUrl.replace(/\/$/, "");
  const authorName = (data as any).site.siteMetadata.person?.fullName || (data as any).site.siteMetadata.author;
  const projects = (data as any).allProjectsJson.nodes as Project[];

  const jsonLd = buildSoftwareSourceCodeJsonLd(projects as any, siteUrl, authorName);

  return <SEO pathname={location.pathname} jsonLd={jsonLd} />;
};

export const query = graphql`
  query IndexPageI18nAndProjects($language: String!) {
    site { siteMetadata { siteUrl author person { fullName } social { linkedin github email } } }
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges { node { ns data language } }
    }
    allProjectsJson(filter: { fields: { locale: { eq: $language } } }) {
      nodes {
        slug
        title
        description
        icon
        repo
        homepage
        language
        license
        links { label url }
      }
    }
    allSocialsJson(filter: { fields: { locale: { eq: $language } } }) {
      nodes {
        title
        cta
        url
        icon
      }
    }
  }
`;
