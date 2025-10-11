import * as React from "react";
import { withPrefix } from "gatsby";
import { useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { FolderKanban, Share2, Mail } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const baseHref = withPrefix("/");
  const { language, defaultLanguage, routed } = useI18next();
  const homeHref =
    routed && language !== defaultLanguage
      ? withPrefix(`/${language}/`)
      : baseHref;
  const navLogo = withPrefix("/images/icon-circle.svg");
  const navItems = [
    { href: "#projects", label: t("projects_heading"), icon: FolderKanban },
    { href: "#socials", label: t("socials_heading"), icon: Share2 },
    { href: "#contact", label: t("contact_heading"), icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        {t("skip_to_content")}
      </a>

      <header className="sticky top-0 z-50 border-b border-navbar-border/70 bg-navbar/80 text-navbar-foreground backdrop-blur supports-[backdrop-filter]:bg-navbar/60">
        <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center gap-3 px-4 py-4 sm:flex-nowrap sm:gap-4">
          <a
            href={homeHref}
            className="inline-flex items-center gap-2 text-xl font-black tracking-tighter text-navbar-foreground transition-colors hover:text-navbar-primary no-underline hover:no-underline"
          >
            <img
              src={navLogo}
              alt={t("logo_alt")}
              className="h-6 w-6"
              loading="lazy"
              decoding="async"
            />
            <span className="whitespace-nowrap">mick schroeder</span>
          </a>

          <div className="ml-auto w-full sm:w-auto">
            <NavigationMenu viewport={false} className="ml-auto justify-end sm:justify-center">
              <NavigationMenuList className="flex-wrap justify-end gap-2 sm:justify-center text-navbar-foreground">
                {navItems.map(({ href, label, icon: Icon }) => (
                  <NavigationMenuItem key={href}>
                    <Button
                      asChild
                      variant="default"
                      className="bg-navbar-accent text-navbar-accent-foreground hover:bg-navbar-primary/80 hover:text-navbar-primary-foreground focus-visible:ring-navbar-ring/60"
                    >
                      <NavigationMenuLink
                        href={href}
                        className="!flex-row !items-center !gap-2 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        <span>{label}</span>
                      </NavigationMenuLink>
                    </Button>
                  </NavigationMenuItem>
                ))}
                <NavigationMenuItem>
                  <LanguageSwitcher className="text-navbar-foreground" />
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </header>

      <main id="main-content" className="mx-auto w-full max-w-4xl px-6 py-10">
        <header className="mb-6 text-center">
          <img
            src={withPrefix("/images/logo-mick-schroeder.svg")}
            alt="Mick Schroeder"
            className="mx-auto h-20 md:h-24 dark:invert"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <h1 className="sr-only">Mick Schroeder</h1>
        </header>

        {children}
      </main>
    </div>
  );
};

export default Layout;
