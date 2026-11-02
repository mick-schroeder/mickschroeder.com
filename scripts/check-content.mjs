import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
const read = (file) =>
  JSON.parse(readFileSync(new URL(`../${file}`, import.meta.url), "utf8"));
const localFile = (file) => existsSync(new URL(`../${file}`, import.meta.url));
const en = read("src/locales/en/common.json");
const ga = read("src/locales/ga/common.json");
assert.deepEqual(
  Object.keys(ga).sort(),
  Object.keys(en).sort(),
  "Translation keys must match",
);
for (const [lang, dict] of Object.entries({ en, ga })) {
  for (const [key, value] of Object.entries(dict))
    assert.ok(
      typeof value === "string" && value.trim(),
      `${lang}.${key} needs a translation`,
    );
}
function checkUrl(url) {
  assert.ok(
    ["https:", "mailto:"].includes(new URL(url).protocol),
    `Unsupported link: ${url}`,
  );
}
let identities;
for (const lang of ["en", "ga"]) {
  const projects = read(`src/data/projects/${lang}.json`);
  const slugs = projects.map((p) => p.slug);
  assert.equal(
    new Set(slugs).size,
    slugs.length,
    `${lang}: duplicate projects`,
  );
  if (identities)
    assert.deepEqual(
      slugs,
      identities,
      "Project identities and order must match",
    );
  identities = slugs;
  for (const project of projects) {
    for (const key of ["slug", "title", "description", "icon"])
      assert.ok(project[key]?.trim(), `${lang}: missing project ${key}`);
    for (const image of [project.icon, project.screenshot].filter(Boolean))
      assert.ok(
        localFile(`src/assets/projects/${image}`),
        `Missing project image: ${image}`,
      );
    for (const url of [
      project.slug,
      project.repo,
      project.homepage,
      ...project.links.map((l) => l.url),
    ].filter(Boolean))
      checkUrl(url);
    for (const link of project.links)
      assert.ok(link.label.trim(), "Links need labels");
  }
  for (const social of read(`src/data/socials/${lang}.json`)) {
    checkUrl(social.url);
    if (social.icon?.startsWith("/"))
      assert.ok(
        localFile(`public${social.icon}`),
        `Missing social image: ${social.icon}`,
      );
  }
}
const manifest = read("public/site.webmanifest");
for (const icon of manifest.icons)
  assert.ok(
    localFile(`public${icon.src}`),
    `Missing manifest icon: ${icon.src}`,
  );
console.log(
  "Content checks passed: translations, project parity, links, images, and manifest.",
);
