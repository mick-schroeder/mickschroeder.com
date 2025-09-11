import * as React from "react";
import { graphql, withPrefix, type HeadFC, type PageProps } from "gatsby";
import { useTranslation, Link } from "gatsby-plugin-react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Projects, type Project } from "@/components/projects";
import { Flag } from "@/components/flag";
import { ExternalLink, Mail } from 'lucide-react';
import { LanguageSwitcher } from "@/components/language-switcher";

const IndexPage: React.FC<PageProps<{ allProjectsJson: { nodes: Project[] } }>> = ({ data }) => {
  const { t } = useTranslation();
  
  return (
    <main className="bg-background text-foreground min-h-screen grid place-items-center">
      <div className="md:max-w-3xl w-full px-6 py-10">
        <div className="text-center mb-6">
            <div className="mt-3 flex justify-center">
            <LanguageSwitcher />
          </div>
          <img src={withPrefix("/images/logo-mick-schroeder.svg")} alt="Schroeder Logo" className="mx-auto h-20 md:h-24 dark:invert" />
          <h1 className="sr-only">mickschroeder.com</h1>
          <p className="text-muted-foreground text-xl md:px-10">
            <span dangerouslySetInnerHTML={{ __html: t("hero_line") }} />
          </p>
        </div>

        <Flag />
        
        <Projects projects={data.allProjectsJson.nodes as Project[]} className="mt-10" />

        <section className="mt-10">
        <h3 className="text-2xl font-bold mb-4">{t("socials_heading")}</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-border">
            <CardHeader><CardTitle>{t("title_linkedin")}</CardTitle></CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <a href="https://www.linkedin.com/in/schroedermick/">{t("cta_linkedin")}<ExternalLink /></a>
              </Button>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader><CardTitle>{t("title_github")}</CardTitle></CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <a href="https://github.com/mick-schroeder">{t("cta_github")}<ExternalLink /></a>
              </Button>
            </CardContent>
          </Card>
           </div>
        </section>

      <section className="mt-10">
        <h3 className="text-2xl font-bold mb-4">{t("contact_heading")}</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-border">
            <CardHeader><CardTitle>{t("title_email")}</CardTitle></CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <a href="mailto:mick@mickschroeder.com" className="inline-flex items-center justify-center gap-2">
                  {t("cta_email")}<Mail className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
           </div>
        </section>
        <footer className="mt-8 text-xs text-center opacity-80">
          {t("footer_copy")}
        </footer>
      </div>
    </main>
  );
};

export default IndexPage;

export const Head: HeadFC = () => (
  <>
    <title>Mick Schroeder — Indie Software Developer & Pharmacist</title>
    <meta name="description" content="Design-forward, interactive poster with Irish-inspired geometry." />
    <link rel="canonical" href="https://mickschroeder.com/en/" />
    <meta name="color-scheme" content="light dark" />
    <link rel="alternate" href="https://mickschroeder.com/en/" hrefLang="en" />
    <link rel="alternate" href="https://mickschroeder.com/ga/" hrefLang="ga" />
    <link rel="alternate" href="https://mickschroeder.com/en/" hrefLang="x-default" />
  </>
);

export const query = graphql`
  query IndexPageI18nAndProjects($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges { node { ns data language } }
    }
    allProjectsJson(filter: { fields: { locale: { eq: $language } } }) {
      nodes {
        slug
        title
        description
        icon
        links { label url }
      }
    }
  }
`;