import * as React from "react";
import { graphql, type HeadFC, type PageProps } from "gatsby";
import { useTranslation, Trans } from "gatsby-plugin-react-i18next";
import { Projects, type Project } from "@/components/projects";
import Socials, { type SocialItem } from "@/components/socials";
import Contact from "@/components/contact";
import { SEO, buildSoftwareSourceCodeJsonLd } from "@/components/seo";
import { FolderKanban, Share2, Mail } from "lucide-react";
import Layout from "@/components/layout";

type IndexPageData = {
  allProjectsJson: { nodes: Project[] };
  allSocialsJson: { nodes: SocialItem[] };
};

const IndexPage: React.FC<PageProps<IndexPageData>> = ({ data }) => {
  const { t } = useTranslation();
  
  return (
    <Layout>
      <div className="mb-6 text-center">


        {/* Hero */}
        <p className="text-muted-foreground text-xl md:px-10">
          <Trans i18nKey="hero_line" components={{ b: <b className="pop-plus" /> }} />
        </p>

      </div>

      <section id="projects" className="mt-10 scroll-mt-32">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold">
          <FolderKanban className="h-6 w-6 text-primary" aria-hidden="true" />
          {t("projects_heading")}
        </h2>
        <Projects projects={data.allProjectsJson.nodes as Project[]} />
      </section>

      <section id="socials" className="mt-10 scroll-mt-32">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold">
          <Share2 className="h-6 w-6 text-primary" aria-hidden="true" />
          {t("socials_heading")}
        </h2>
        <Socials items={data.allSocialsJson.nodes} />
      </section>

      <section id="contact" className="mt-10 scroll-mt-32">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold">
          <Mail className="h-6 w-6 text-primary" aria-hidden="true" />
          {t("contact_heading")}
        </h2>
        <Contact />
      </section>

      <footer className="mt-12 text-center text-xs opacity-80">
        <Trans
          i18nKey="footer_copy_html"
          components={{
            a1: <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer" />,
            a2: <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" />,
          }}
        />
      </footer>
    </Layout>
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
