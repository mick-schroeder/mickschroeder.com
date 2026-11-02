import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: "http://127.0.0.1:4322", trace: "retain-on-failure" },
  webServer: {
    command: "npm run preview -- --ignore-lock --host 127.0.0.1 --port 4322",
    url: "http://127.0.0.1:4322",
    reuseExistingServer: !process.env.CI,
  },
});
