import * as React from "react";
import { graphql, useStaticQuery } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export const Contact: React.FC<{ className?: string }> = ({ className }) => {
  const { t } = useTranslation();
  const data = useStaticQuery(graphql`
    query ContactQuery {
      site { siteMetadata { social { email } } }
    }
  `) as any;

  const email = data?.site?.siteMetadata?.social?.email as string | undefined;
  if (!email) return null;

  return (
    <div className={className}>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-border overflow-hidden">
            <CardHeader className="flex items-center gap-3">
            <span className="inline-grid place-items-center w-9 h-9 rounded-full bg-primary text-primary-foreground ring-1 ring-border">
                  <Mail width={18} height={18} className="text-white" />
              </span>
            <CardTitle>{t("title_email")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <a href={`mailto:${email}`} className="inline-flex items-center justify-center gap-2">
                {t("cta_email")}<Mail className="h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;

