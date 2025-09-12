import * as React from "react";
import { graphql, useStaticQuery } from "gatsby";
import { useI18next } from "gatsby-plugin-react-i18next";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

type SocialItem = { title: string; cta?: string; url: string; icon?: string };

export const Socials: React.FC<{ className?: string }> = ({ className }) => {
  const { language } = useI18next();
  const data = useStaticQuery(graphql`
    query SocialsJsonQuery {
      allSocialsJson { nodes { title cta url icon fields { locale } } }
    }
  `) as any;
  const all = (data?.allSocialsJson?.nodes || []) as Array<any>;
  const items: SocialItem[] = all.filter((n) => n?.fields?.locale === language);
  if (!items.length) return null;

  return (
    <div className={className}>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((it, idx) => (
          <Card key={`${it.title}-${idx}`} className="border-border overflow-hidden">
            <CardHeader className="flex items-center gap-3">
              <span className="inline-grid place-items-center w-9 h-9 rounded-full bg-primary text-primary-foreground ring-1 ring-border">
                {it.icon ? (
                  <img src={it.icon} alt="" aria-hidden="true" width={18} height={18} className="invert" />
                ) : (
                  <ExternalLink width={18} height={18} className="invert" />
                )}
              </span>
              <CardTitle className="text-lg">{it.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <a href={it.url} rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2">
                  {it.cta || 'Visit'} <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Socials;
