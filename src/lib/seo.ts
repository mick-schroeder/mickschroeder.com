import type { Project } from "@/data/projects";
import type { SiteConfig } from "@/config/site";

export type SoftwareProject = Pick<Project, "title" | "description" | "icon" | "links" | "repo" | "homepage" | "language" | "license">;

export function buildSoftwareSourceCodeJsonLd(
  projects: SoftwareProject[],
  siteUrl: string,
  authorName?: string
): Record<string, unknown>[] {
  const base = siteUrl.replace(/\/$/, "");
  return (projects || []).map((project) => {
    const links = Array.isArray(project.links) ? project.links.map((link) => link.url) : [];
    const repoLink = project.repo || undefined;
    const liveUrl = project.homepage || undefined;
    const icon = project.icon || "";
    const absoluteImage = icon.startsWith("http") ? icon : `${base}${icon}`;
    const sameAs = [...links, ...(repoLink ? [repoLink] : []), ...(liveUrl ? [liveUrl] : [])];
    return {
      "@type": "SoftwareSourceCode",
      name: project.title,
      description: project.description,
      url: liveUrl || repoLink || base,
      codeRepository: repoLink,
      programmingLanguage: project.language || "TypeScript",
      license: project.license,
      author: { "@type": "Person", name: authorName || "", url: base },
      image: absoluteImage,
      sameAs,
    } as Record<string, unknown>;
  });
}

export function buildPersonJsonLd(site: SiteConfig, siteUrl: string, languages: string[]): Record<string, unknown> {
  const langName: Record<string, string> = { en: "English", ga: "Irish" };
  const sameAs = [
    siteUrl,
    site.social.twitter ? `https://twitter.com/${site.social.twitter.replace(/^@/, "")}` : undefined,
    site.social.github ? `https://github.com/${site.social.github}` : undefined,
    site.social.linkedin ? `https://www.linkedin.com/in/${site.social.linkedin}/` : undefined,
    site.social.email ? `mailto:${site.social.email}` : undefined,
  ].filter(Boolean);

  return {
    "@type": "Person",
    name: site.person?.fullName || site.author || site.title,
    givenName: site.person?.givenName,
    familyName: site.person?.familyName,
    alternateName: site.person?.alternateName,
    url: siteUrl,
    image: site.image?.startsWith("http") ? site.image : `${siteUrl.replace(/\/$/, "")}${site.image}`,
    email: site.social.email ? `mailto:${site.social.email}` : undefined,
    jobTitle: site.person?.jobTitle,
    sameAs,
    knowsLanguage: languages.map((lng) => langName[lng] || lng),
    alumniOf: (site.person?.alumniOf || []).map((a) => ({
      "@type": "EducationalOrganization",
      name: a.name,
      url: a.url,
    })),
  } as Record<string, unknown>;
}
