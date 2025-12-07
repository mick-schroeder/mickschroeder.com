import en from "../locales/en/common.json";
import ga from "../locales/ga/common.json";

export const languages = ["en", "ga"] as const;
export type Language = (typeof languages)[number];
export const defaultLanguage: Language = "en";

export type Dictionary = Record<string, string>;

const dictionaries: Record<Language, Dictionary> = {
  en,
  ga,
};

export function getDictionary(lang: string | undefined | null): Dictionary {
  if (!lang) return dictionaries[defaultLanguage];
  const match = languages.includes(lang as Language)
    ? (lang as Language)
    : defaultLanguage;
  return dictionaries[match] || dictionaries[defaultLanguage];
}

export function translate(
  dict: Dictionary,
  key: string,
  fallback?: string
): string {
  if (dict[key]) return dict[key];
  return fallback ?? key;
}

const trailingSlash = (path: string) => (path.endsWith("/") ? path : `${path}/`);
const normalizePath = (path: string) => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized === "" ? "/" : normalized;
};

export function stripLangFromPath(path: string): string {
  const normalized = normalizePath(path);
  const segments = normalized.split("/").filter(Boolean);
  const maybeLang = segments[0];
  const hasLang = languages.includes(maybeLang as Language);
  const rest = hasLang ? segments.slice(1) : segments;
  if (!rest.length) return "/";
  return `/${rest.join("/")}${normalized.endsWith("/") ? "/" : ""}`;
}

export function pathWithLang(lang: Language, path: string): string {
  const stripped = stripLangFromPath(path);
  const normalized = normalizePath(stripped);
  if (lang === defaultLanguage) return trailingSlash(normalized);
  if (normalized === "/") return `/${lang}/`;
  return trailingSlash(`/${lang}${normalized}`);
}
