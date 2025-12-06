import * as React from "react";
import { graphql, useStaticQuery } from "gatsby";
import { GatsbyImage, type IGatsbyImageData } from "gatsby-plugin-image";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

export type ProjectLink = { label: string; url: string };
export type Project = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  screenshot?: string;
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
      allFile(filter: {relativeDirectory: {regex: "/projects/"}, extension: {in: ["png", "jpg", "jpeg", "webp"]}}) {
        nodes {
          base
          childImageSharp {
            icon: gatsbyImageData(width: 32, height: 32, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
            screenshot: gatsbyImageData(width: 960, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
          }
        }
      }
    }
  `) as any;

  const screenshotMap = React.useMemo(() => {
    const m = new Map<string, IGatsbyImageData>();
    for (const n of data?.allFile?.nodes || []) {
      if (n.base && n.childImageSharp?.screenshot) m.set(n.base, n.childImageSharp.screenshot);
    }
    return m;
  }, [data]);

  const iconMap = React.useMemo(() => {
    const m = new Map<string, IGatsbyImageData>();
    for (const n of data?.allFile?.nodes || []) {
      if (n.base && n.childImageSharp?.icon) m.set(n.base, n.childImageSharp.icon);
    }
    return m;
  }, [data]);
  return (
    <div className={cn("grid gap-6 md:grid-cols-2", className)}>
      {projects.map((p, idx) => (
        <Card
          key={p.slug}
          className="border-border overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:shadow-md animate-rise"
          style={{ animationDelay: `${idx * 60}ms` }}
        >
          <CardHeader className="flex items-center gap-3 px-6">
            {/* Decorative icon; empty alt for a11y if the title is right next to it */}
            {(() => {
              const base = (p.icon || "").split("/").pop() || "";
              const imgData = iconMap.get(base);
              if (imgData) return <GatsbyImage image={imgData} alt="" className="rounded-md" />;
              return <img src={p.icon} alt="" width={32} height={32} className="rounded-md" />;
            })()}
            <CardTitle className="text-xl">{p.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {p.screenshot &&
              (() => {
                const base = (p.screenshot || "").split("/").pop() || "";
                const imgData = screenshotMap.get(base);
                const sharedClasses = "h-full w-full object-cover object-top";
                if (imgData) {
                  return (
                    <div className="-mx-6 mb-3 overflow-hidden">
                      <GatsbyImage
                        image={imgData}
                        alt={`${p.title} screenshot`}
                        className="aspect-[16/9] h-auto w-full"
                        imgClassName={sharedClasses}
                      />
                    </div>
                  );
                }
                return (
                  <div className="-mx-6 mb-3 overflow-hidden">
                    <img
                      src={p.screenshot}
                      alt={`${p.title} screenshot`}
                      className={`aspect-[16/9] h-auto w-full ${sharedClasses}`}
                    />
                  </div>
                );
              })()}
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
          </CardContent>
          <CardFooter className="border-t border-border/60 px-6 pt-4">
            <div className="flex flex-wrap gap-3">
              {p.links.map((l) => (
                <Button key={l.url} asChild variant="outline">
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-medium"
                  >
                    {l.label}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
