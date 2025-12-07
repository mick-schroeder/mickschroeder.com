import type { Language } from "../i18n/config";
import en from "./projects/en.json";
import ga from "./projects/ga.json";

export type ProjectLink = { label: string; url: string };
export type Project = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  screenshot?: string;
  links: ProjectLink[];
  repo?: string;
  homepage?: string;
  language?: string;
  license?: string;
};

const projectMap: Record<Language, Project[]> = {
  en,
  ga,
};

export function getProjects(lang: Language): Project[] {
  return projectMap[lang] || projectMap.en;
}

