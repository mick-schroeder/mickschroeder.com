import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import vm from "node:vm";

const output = mkdtempSync(join(tmpdir(), "site-analytics-"));
try {
  const result = spawnSync(
    process.execPath,
    ["node_modules/astro/bin/astro.mjs", "build", "--outDir", output],
    {
      env: { ...process.env, PUBLIC_GTAG_ID: "G-TEST123" },
      encoding: "utf8",
    },
  );
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const html = readFileSync(join(output, "index.html"), "utf8");
  const scripts = [
    ...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g),
  ].filter(([, attrs]) => attrs.includes("text/partytown"));
  assert.equal(scripts.length, 2, "Expected GA loader and initialisation");
  assert.ok(scripts.some(([, attrs]) => attrs.includes("id=G-TEST123")));
  const context = vm.createContext({});
  context.window = context;
  for (const [, attrs, body] of scripts)
    if (!attrs.includes("src=")) vm.runInContext(body, context);
  const events = JSON.parse(
    JSON.stringify(context.dataLayer.map((event) => Array.from(event))),
  );
  assert.ok(
    events.some((event) => event[0] === "config" && event[1] === "G-TEST123"),
    "GA must receive the actual configured ID",
  );
  assert.ok(
    existsSync(join(output, "~partytown/partytown.js")),
    "Partytown assets must be included",
  );
  console.log(
    "Analytics-enabled build and measurement ID checks passed; no data sent to Google.",
  );
} finally {
  rmSync(output, { recursive: true, force: true });
}
