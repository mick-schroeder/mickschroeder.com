import './src/styles/global.css';
import * as React from 'react';
import Layout from './src/components/layout';

export const wrapRootElement = ({ element }: { element: React.ReactNode }) => (
  <Layout>{element}</Layout>
);
