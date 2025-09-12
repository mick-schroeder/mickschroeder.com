import * as React from "react";
import { graphql, type HeadFC, type PageProps } from "gatsby";
import { useTranslation, Trans } from "gatsby-plugin-react-i18next";
import { Projects, type Project } from "@/components/projects";
import { Flag } from "@/components/flag";
//
import Socials from "@/components/socials";
import Contact from "@/components/contact";
import { SEO, buildSoftwareSourceCodeJsonLd } from "@/components/seo";
import { LanguageSwitcher } from "@/components/language-switcher";

const IndexPage: React.FC<PageProps<{ allProjectsJson: { nodes: Project[] } }>> = ({ data }) => {
  const { t } = useTranslation();
  
  return (
    <>
      <div className="text-center mb-6">
        <div className="my-3 flex justify-center">
          <LanguageSwitcher />
        </div>
        <p className="text-muted-foreground text-xl md:px-10">
          <Trans i18nKey="hero_line" components={{ b: <b className="pop-plus" /> }} />
        </p>
      </div>

      <Flag />

      <Projects projects={data.allProjectsJson.nodes as Project[]} className="mt-10" />

      <section className="mt-10">
        <h3 className="text-2xl font-bold mb-4">{t("socials_heading")}</h3>
        <Socials />
      </section>

      <section className="mt-10">
        <h3 className="text-2xl font-bold mb-4">{t("contact_heading")}</h3>
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
  }
`;
