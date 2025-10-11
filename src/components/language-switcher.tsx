import * as React from "react";
import { useI18next, useTranslation } from "gatsby-plugin-react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Languages } from "lucide-react";
import { cn } from "@/lib/utils";

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className }) => {
  const { t } = useTranslation();
  const { language: active, languages, changeLanguage } = useI18next();

  const displayNames = React.useMemo(() => {
    if (typeof Intl !== "undefined" && typeof Intl.DisplayNames === "function") {
      try {
        return new Intl.DisplayNames([active], { type: "language" });
      } catch {
        return null;
      }
    }
    return null;
  }, [active]);

  const labelFor = React.useCallback(
    (lng: string) => displayNames?.of(lng) ?? lng.toUpperCase(),
    [displayNames]
  );

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium",
              "bg-navbar-accent text-navbar-accent-foreground border-navbar-border/60",
              "hover:bg-navbar-primary/80 hover:text-navbar-primary-foreground",
              "focus-visible:ring-navbar-ring/60 focus-visible:ring-offset-background"
            )}
            aria-label={String(t("language_switcher_label"))}
          >
            <Languages aria-hidden="true" className="h-4 w-4" />
            <span>{labelFor(active)}</span>
            <ChevronDown aria-hidden="true" className="h-4 w-4 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-44 border-navbar-border/60 bg-navbar text-navbar-foreground shadow-lg"
        >
          <DropdownMenuRadioGroup
            value={active}
            onValueChange={(lng) => {
              if (lng && lng !== active) {
                changeLanguage(lng);
              }
            }}
          >
            {languages.map((lng) => (
              <DropdownMenuRadioItem
                key={lng}
                value={lng}
                className="flex items-center gap-3"
              >
                <Languages aria-hidden="true" className="h-4 w-4 text-primary" />
                <span className="flex-1">{labelFor(lng)}</span>
                {lng === active && (
                  <span className="sr-only">{t("language_switcher_current")}</span>
                )}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageSwitcher;
