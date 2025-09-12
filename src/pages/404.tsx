import * as React from "react";
import { Link, HeadFC, PageProps, graphql } from "gatsby";
import SEO from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "gatsby-plugin-react-i18next";

const NotFoundPage: React.FC<PageProps> = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="text-center mb-6">
        <div className="mt-3 flex justify-center">
          <LanguageSwitcher />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mt-4">{t("not_found_heading")}</h1>
        <p className="text-muted-foreground mt-2 md:px-10">
          {t("not_found_body")}
        </p>
      </div>

      <Card className="border-border">
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="inline-flex items-center gap-2">
              <Link to="/">
                <Home className="h-4 w-4" />
                {t("not_found_cta_home")}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="inline-flex items-center gap-2"
            >
              <Link
                to={typeof window !== "undefined" && window.history.length > 1 ? "#" : "/"}
                onClick={(e) => {
                  if (typeof window !== "undefined" && window.history.length > 1) {
                    e.preventDefault();
                    window.history.back();
                  }
                }}
              >
                <ArrowLeft className="h-4 w-4" />
                {t("not_found_cta_back")}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <footer className="mt-8 text-xs text-center opacity-80">
        {t("footer_copy")}
      </footer>
    </>
  );
};

export default NotFoundPage;

export const Head: HeadFC = ({ location }) => (
  <SEO noindex title="Not found" pathname={location.pathname} />
);

export const query = graphql`
  query NotFoundI18n($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges { node { ns data language } }
    }
  }
`;
