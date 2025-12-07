import * as React from "react";

import { Button } from "@/components/ui/button";

const IconMoon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
  </svg>
);

const IconSun = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const IconMonitor = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 3H3c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2h7v3H8" />
    <path d="M7 21h10" />
    <path d="M22 13V5c0-1.1-.9-2-2-2" />
  </svg>
);

type ThemeMode = "system" | "light" | "dark";

const storageKey = "theme-preference";

const nextTheme = (mode: ThemeMode): ThemeMode => {
  if (mode === "system") return "light";
  if (mode === "light") return "dark";
  return "system";
};

const applyTheme = (target: ThemeMode) => {
  if (typeof window === "undefined") return;
  const root = window.document.documentElement;
  const systemPrefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolved =
    target === "system" ? (systemPrefersDark ? "dark" : "light") : target;

  if (target === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", target);
  }

  if (resolved === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  root.style.colorScheme = resolved === "dark" ? "dark" : "light";
};

export const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const [mode, setMode] = React.useState<ThemeMode>("system");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(storageKey) as ThemeMode | null;
    const initial = stored ?? "system";
    setMode(initial);
    applyTheme(initial);
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    applyTheme(mode);
    if (typeof window === "undefined") return;
    if (mode === "system") {
      window.localStorage.removeItem(storageKey);
    } else {
      window.localStorage.setItem(storageKey, mode);
    }
  }, [mode, mounted]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const syncSystem = () => {
      if (mode === "system") applyTheme("system");
    };
    mediaQuery.addEventListener("change", syncSystem);
    return () => mediaQuery.removeEventListener("change", syncSystem);
  }, [mode]);

  const Icon =
    mode === "dark" ? IconMoon : mode === "light" ? IconSun : IconMonitor;

  const label =
    mode === "dark"
      ? "Dark mode"
      : mode === "light"
        ? "Light mode"
        : "System mode";

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      type="button"
      onClick={() => setMode((prev) => nextTheme(prev))}
      aria-label={`${label} toggle`}
      title="Cycle light / dark / system"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </Button>
  );
};

export default ThemeToggle;
