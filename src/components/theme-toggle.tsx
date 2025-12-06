import * as React from "react";
import { Moon, SunMedium, MonitorSmartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

type ThemeMode = "system" | "light" | "dark";

const storageKey = "theme-preference";

const nextTheme = (mode: ThemeMode): ThemeMode => {
  if (mode === "system") return "light";
  if (mode === "light") return "dark";
  return "system";
};

export const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const [mode, setMode] = React.useState<ThemeMode>("system");
  const [mounted, setMounted] = React.useState(false);

  const applyTheme = React.useCallback((target: ThemeMode) => {
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
    root.style.colorScheme = resolved === "dark" ? "dark" : "light";
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const stored =
      (window.localStorage.getItem(storageKey) as ThemeMode | null) || "system";
    setMode(stored);
    applyTheme(stored);
    setMounted(true);
  }, [applyTheme]);

  React.useEffect(() => {
    if (!mounted) return;
    applyTheme(mode);
    if (typeof window === "undefined") return;
    if (mode === "system") {
      window.localStorage.removeItem(storageKey);
    } else {
      window.localStorage.setItem(storageKey, mode);
    }
  }, [mode, applyTheme, mounted]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const syncSystem = () => {
      if (mode === "system") applyTheme("system");
    };
    mediaQuery.addEventListener("change", syncSystem);
    return () => mediaQuery.removeEventListener("change", syncSystem);
  }, [mode, applyTheme]);

  const Icon =
    mode === "dark" ? Moon : mode === "light" ? SunMedium : MonitorSmartphone;

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
