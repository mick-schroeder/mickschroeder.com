import assert from "node:assert/strict";
import { mkdirSync, readFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { chromium } from "@playwright/test";

const base = "http://127.0.0.1:4323";
const server = spawn(
  process.execPath,
  [
    "node_modules/astro/bin/astro.mjs",
    "preview",
    "--ignore-lock",
    "--host",
    "127.0.0.1",
    "--port",
    "4323",
  ],
  { stdio: "ignore" },
);
const run = (args) =>
  new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      ["node_modules/lighthouse/cli/index.js", ...args],
      {
        stdio: "inherit",
        env: {
          ...process.env,
          CHROME_PATH: process.env.CHROME_PATH || chromium.executablePath(),
        },
      },
    );
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`Lighthouse exited ${code}`)),
    );
  });
try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      if ((await fetch(base)).ok) {
        ready = true;
        break;
      }
    } catch {
      /* Wait for startup. */
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  assert.ok(ready, "Preview server did not start on port 4323");
  mkdirSync("output/lighthouse", { recursive: true });
  for (const [lang, path] of [
    ["en", "/"],
    ["ga", "/ga/"],
  ]) {
    const output = `output/lighthouse/${lang}.json`;
    await run([
      `${base}${path}`,
      "--chrome-flags=--headless --no-sandbox",
      "--only-categories=performance,accessibility,best-practices,seo",
      "--output=json",
      `--output-path=${output}`,
      "--quiet",
    ]);
    const report = JSON.parse(readFileSync(output, "utf8"));
    const scores = Object.fromEntries(
      Object.entries(report.categories).map(([key, value]) => [
        key,
        value.score * 100,
      ]),
    );
    console.log(`${lang}: ${JSON.stringify(scores)}`);
    for (const [category, score] of Object.entries(scores))
      assert.ok(
        score >= 95,
        `${lang} ${category} scored ${score}; target is 95`,
      );
  }
} finally {
  server.kill();
}
