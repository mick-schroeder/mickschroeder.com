import * as React from 'react';
import Layout from './src/components/layout';

// Minimal, best-practice: wrap the app once with Layout on SSR too
export const wrapRootElement = ({ element }: { element: React.ReactNode }) => (
  <Layout>{element}</Layout>
);
