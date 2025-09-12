import * as React from "react";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ExternalLink } from 'lucide-react';

export type ProjectLink = { label: string; url: string };
export type Project = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  links: ProjectLink[];
};

type Props = {
  projects: Project[];
  className?: string;
};

export const Projects: React.FC<Props> = ({ projects, className }) => {
  const { t } = useTranslation();
  return (
    <section className={className ?? "mt-10"}>
      <h3 className="text-2xl font-bold mb-4">{t("projects_heading")}</h3>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((p) => (
          <Card key={p.slug} className="border-border overflow-hidden">
            <CardHeader className="flex items-center gap-3">
              {/* Decorative icon; empty alt for a11y if the title is right next to it */}
              <img src={p.icon} alt="" width={32} height={32} className="rounded-md" />
              <CardTitle className="text-lg">{p.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{p.description}</p>
              <div className="flex flex-wrap gap-3">
                {p.links.map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    className="underline text-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="inline-flex items-center gap-1">
                      {l.label}
                      <ExternalLink className="w-4 h-4" />
                    </span>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
