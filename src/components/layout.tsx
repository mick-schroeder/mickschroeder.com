import * as React from "react";
import { withPrefix } from "gatsby";

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <div id="main" className="md:max-w-3xl w-full px-6 py-10 mx-auto">
        <header className="text-center mb-6">
          <img
            src={withPrefix("/images/logo-mick-schroeder.svg")}
            alt="Mick Schroeder"
            className="mx-auto h-20 md:h-24 invert"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <h1 className="sr-only">Mick Schroeder</h1>
        </header>

        {children}
      </div>
    </main>
  );
};

export default Layout;
