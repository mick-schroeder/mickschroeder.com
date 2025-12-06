import * as React from "react";
import { graphql, type HeadFC, type PageProps } from "gatsby";
import { useTranslation, Trans } from "gatsby-plugin-react-i18next";
import { Projects, type Project } from "@/components/projects";
import Socials, { type SocialItem } from "@/components/socials";
import Contact from "@/components/contact";
import { Button } from "@/components/ui/button";
import { SEO, buildSoftwareSourceCodeJsonLd } from "@/components/seo";
import { FolderKanban, Share2, Mail } from "lucide-react";
import Layout from "@/components/layout";

type IndexPageData = {
  allProjectsJson: { nodes: Project[] };
  allSocialsJson: { nodes: SocialItem[] };
};

const IndexPage: React.FC<PageProps<IndexPageData>> = ({ data }) => {
  const { t } = useTranslation();
  const social = (data as any).site.siteMetadata.social || {};
  
  return (
    <Layout>
      <div className="relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-b from-emerald-900/75 via-emerald-950/75 to-emerald-900/75 p-6 text-center md:p-10 ring-1 ring-emerald-800/50">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="animate-drift-slow absolute left-1/2 top-[-30%] h-60 w-60 -translate-x-1/2 rounded-full bg-lime-500/15 blur-3xl" />
          <div className="animate-drift-slower absolute -left-6 bottom-[-10%] h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="animate-glow absolute right-[-8%] top-[-12%] h-56 w-56 rotate-6 rounded-full bg-teal-500/14 blur-3xl" />
          <div className="animate-shimmer absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(190,242,100,0.7),transparent)]" />
        </div>
        {/* Hero */}
        <p className="relative z-10 text-muted-foreground text-xl md:px-10 animate-rise" style={{ animationDelay: "0.05s" }}>
          <Trans i18nKey="hero_line" components={{ b: <b className="pop-plus" /> }} />
        </p>
        <p className="relative z-10 mt-3 text-sm text-emerald-100/90 md:text-base animate-rise" style={{ animationDelay: "0.15s" }}>
          <Trans i18nKey="hero_sub_line" />
        </p>
        <div className="relative z-10 mt-6 flex flex-col items-center justify-center gap-3 md:flex-row animate-rise" style={{ animationDelay: "0.25s" }}>
          <Button asChild size="lg">
            <a href="#projects"><Trans i18nKey="cta_projects" /></a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#contact"><Trans i18nKey="cta_email" /></a>
          </Button>
        </div>
        <div className="relative z-10 mt-4 flex flex-wrap justify-center gap-4 text-sm font-medium text-emerald-50 animate-rise" style={{ animationDelay: "0.35s" }}>
          {social.linkedin && (
            <a href={`https://www.linkedin.com/in/${social.linkedin}/`} target="_blank" rel="noopener noreferrer" className="underline decoration-emerald-300 underline-offset-4 hover:text-emerald-700">
          <Trans i18nKey="cta_linkedin" />
            </a>
          )}
          {social.github && (
            <a href={`https://github.com/${social.github}`} target="_blank" rel="noopener noreferrer" className="underline decoration-emerald-300 underline-offset-4 hover:text-emerald-700">
          <Trans i18nKey="cta_github" />
            </a>
          )}
        </div>
      </div>
      
     {/* Projects */}
      <section id="projects" className="mt-10 scroll-mt-32">
        <h2 className="animate-rise mb-4 flex items-center gap-2 text-2xl font-bold" style={{ animationDelay: "0.1s" }}>
          <FolderKanban className="h-6 w-6 text-primary" aria-hidden="true" />
          {t("projects_heading")}
        </h2>
        <Projects projects={data.allProjectsJson.nodes as Project[]} />
      </section>

     {/* Socials */}

      <section id="socials" className="mt-10 scroll-mt-32">
        <h2 className="animate-rise mb-4 flex items-center gap-2 text-2xl font-bold" style={{ animationDelay: "0.1s" }}>
          <Share2 className="h-6 w-6 text-primary" aria-hidden="true" />
          {t("socials_heading")}
        </h2>
        <Socials items={data.allSocialsJson.nodes} />
      </section>

     {/* Contact */}

      <section id="contact" className="mt-10 scroll-mt-32">
        <h2 className="animate-rise mb-4 flex items-center gap-2 text-2xl font-bold" style={{ animationDelay: "0.1s" }}>
          <Mail className="h-6 w-6 text-primary" aria-hidden="true" />
          {t("contact_heading")}
        </h2>
        <Contact />
      </section>
      
     {/* Footer */}

      <footer className="mt-12 text-center text-xs opacity-80">
        <Trans
          i18nKey="footer_copy_html"
          components={{
            a1: <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer" />,
            a2: <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noopener noreferrer" />,
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
        screenshot
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
