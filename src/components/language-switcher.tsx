import * as React from "react";
import { useI18next, Link } from "gatsby-plugin-react-i18next";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Languages } from "lucide-react";

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className }) => {
  const { language: active, languages, originalPath } = useI18next();

  const displayNames = new Intl.DisplayNames([active], { type: "language" });

  return (
    <ToggleGroup type="single" size="lg" variant="outline" value={active} className={className}>
      {languages.map((lng) => {
        const label = displayNames.of(lng) ?? lng.toUpperCase();
        return (
          <ToggleGroupItem key={lng} value={lng} asChild>
            <Link
              className="min-w-[120px] flex items-center justify-center gap-4"
              to={originalPath}
              language={lng}
            >
              <Languages className="h-4 w-4" />
              {label}
            </Link>
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
};

export default LanguageSwitcher;