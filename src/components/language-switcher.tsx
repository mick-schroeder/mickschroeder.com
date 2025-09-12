import * as React from "react";
import { useI18next } from "gatsby-plugin-react-i18next";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Languages } from "lucide-react";

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className }) => {
  const { language: active, languages, changeLanguage } = useI18next();

  const displayNames = new Intl.DisplayNames([active], { type: "language" });
  return (
    <ToggleGroup
      type="single"
      size="lg"
      variant="outline"
      value={active}
      className={className}
      rovingFocus={false}
      aria-label="Language"
      onValueChange={(lng) => {
        if (lng && lng !== active) changeLanguage(lng);
      }}
    >
      {languages.map((lng) => {
        const label = displayNames.of(lng) ?? lng.toUpperCase();
        return (
          <ToggleGroupItem
            key={lng}
            value={lng}
            className="min-w-[120px] flex items-center justify-center gap-4"
          >
            <Languages className="h-4 w-4" />
            {label}
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
};

export default LanguageSwitcher;
