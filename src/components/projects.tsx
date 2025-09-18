import * as React from "react";
import { graphql, useStaticQuery } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

export type ProjectLink = { label: string; url: string };
export type Project = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  links: ProjectLink[];
  // Optional metadata to avoid heuristics
  repo?: string; // e.g., https://github.com/user/repo
  homepage?: string; // live URL if different from slug
  language?: string; // primary programming language
  license?: string; // SPDX or text
};

type Props = {
  projects: Project[];
  className?: string;
};

export const Projects: React.FC<Props> = ({ projects, className }) => {
  const data = useStaticQuery(graphql`
    query ProjectIconsQuery {
      allFile(filter: {extension: {in: ["png", "jpg", "jpeg", "webp"]}}) {
        nodes {
          base
          childImageSharp {
            gatsbyImageData(width: 32, height: 32, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
          }
        }
      }
    }
  `) as any;
  const iconMap = React.useMemo(() => {
    const m = new Map<string, any>();
    for (const n of data?.allFile?.nodes || []) {
      if (n.base && n.childImageSharp) m.set(n.base, n.childImageSharp);
    }
    return m;
  }, [data]);
  return (
    <div className={cn("grid gap-6 md:grid-cols-2", className)}>
      {projects.map((p) => (
        <Card key={p.slug} className="border-border overflow-hidden">
          <CardHeader className="flex items-center gap-3">
            {/* Decorative icon; empty alt for a11y if the title is right next to it */}
            {(() => {
              const base = (p.icon || "").split("/").pop() || "";
              const imgNode = iconMap.get(base);
              if (imgNode) {
                const image = getImage(imgNode);
                if (image) return <GatsbyImage image={image} alt="" className="rounded-md" />;
              }
              return <img src={p.icon} alt="" width={32} height={32} className="rounded-md" />;
            })()}
            <CardTitle className="text-lg">{p.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-muted-foreground">{p.description}</p>
            <div className="flex flex-wrap gap-3">
              {p.links.map((l) => (
                <Button key={l.url} asChild variant="outline">
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    {l.label}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
