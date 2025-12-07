import type { Language } from "../i18n/config";
import en from "./socials/en.json";
import ga from "./socials/ga.json";

export type SocialItem = { title: string; cta?: string; url: string; icon?: string };

const socialMap: Record<Language, SocialItem[]> = {
  en,
  ga,
};

export function getSocials(lang: Language): SocialItem[] {
  return socialMap[lang] || socialMap.en;
}

