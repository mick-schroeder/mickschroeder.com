import type { APIRoute } from "astro";

const buildRobots = (site: URL) => {
  const sitemap = new URL("sitemap-index.xml", site);
  return `Sitemap: ${sitemap.href}\nUser-agent: *\nAllow: /`;
};

export const GET: APIRoute = ({ site }) => {
  const body = buildRobots(site);
  return new Response(body, { status: 200, headers: { "Content-Type": "text/plain" } });
};
