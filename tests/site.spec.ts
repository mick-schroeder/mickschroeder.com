import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const path of [
  "/",
  "/en/",
  "/ga/",
  "/privacy-policy/",
  "/en/privacy-policy/",
  "/ga/privacy-policy/",
]) {
  test(`route, metadata, and accessibility: ${path}`, async ({
    page,
    request,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("html")).toHaveAttribute(
      "lang",
      path.startsWith("/ga/") ? "ga" : "en",
    );
    const canonicalPath = path.replace(/^\/en\//, "/");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://www.mickschroeder.com${canonicalPath}`,
    );
    await expect(page.locator('link[hreflang="x-default"]')).toHaveCount(1);
    expect(errors).toEqual([]);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
    const graphs = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    for (const text of graphs) {
      for (const item of JSON.parse(text)["@graph"]) {
        if (item["@type"] === "SoftwareSourceCode") {
          const url = new URL(item.image);
          expect((await request.get(url.pathname)).ok()).toBeTruthy();
          expect(new Set(item.sameAs).size).toBe(item.sameAs.length);
        }
      }
    }
    if (path.includes("privacy-policy"))
      await expect(page.locator("time")).toHaveAttribute(
        "datetime",
        "2026-04-03",
      );
  });
}

test("theme cycle, persistence and system changes", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const toggle = page.locator("[data-theme-toggle]");
  await expect(toggle).toHaveAttribute("data-mode", "system");
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(toggle).toHaveAttribute("data-mode", "dark");
  await toggle.click();
  await expect(page.locator("html")).not.toHaveAttribute("data-theme");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("theme works with unavailable or corrupt storage", async ({ browser }) => {
  for (const blocked of [true, false]) {
    const context = await browser.newContext();
    await context.addInitScript((deny) => {
      if (deny)
        Object.defineProperty(window, "localStorage", {
          get() {
            throw new Error("Storage denied");
          },
        });
      else window.localStorage.setItem("theme-preference", "invalid");
    }, blocked);
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    const toggle = page.locator("[data-theme-toggle]");
    await expect(toggle).toHaveAttribute("data-mode", "system");
    await toggle.click();
    await expect(toggle).toHaveAttribute("data-mode", "light");
    expect(errors).toEqual([]);
    await context.close();
  }
});

test("language switching preserves section and translates controls", async ({
  page,
}) => {
  await page.goto("/#projects");
  await page
    .getByRole("combobox", { name: "Select language", exact: true })
    .selectOption("/ga/");
  await expect(page).toHaveURL("/ga/#projects");
  await expect(page.locator("[data-theme-toggle]")).toHaveAttribute(
    "aria-label",
    /Téama an chórais/,
  );
  await expect(page.locator("#projects")).not.toContainText("Archive");
  await page
    .getByRole("combobox", { name: "Roghnaigh teanga", exact: true })
    .selectOption("/");
  await expect(page).toHaveURL("/#projects");
});

test("static content and language links work without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Potato Game" }),
  ).toBeVisible();
  await page
    .locator("[data-language-links]")
    .getByRole("link", { name: "GA", exact: true })
    .click();
  await expect(page).toHaveURL("/ga/");
  await expect(
    page.getByRole("heading", { name: "Tionscadail", exact: true }),
  ).toBeVisible();
  await expect(page.locator("[data-theme-toggle]")).toBeHidden();
  await expect(
    page.locator('a[href="mailto:mick@mickschroeder.com"]').first(),
  ).toBeVisible();
  await context.close();
});

test("keyboard skip link and section navigation", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to main content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("/#main-content");
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Projects", exact: true })
    .click();
  await expect(page).toHaveURL("/#projects");
});

for (const width of [320, 375, 768, 1440]) {
  for (const theme of ["light", "dark"] as const) {
    test(`responsive ${width}px ${theme}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      for (const path of ["/", "/ga/"]) {
        await page.goto(path);
        await page.evaluate(() => document.fonts.ready);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        ).toBeTruthy();
        await expect(page.locator("h1")).toBeAttached();
        for (const img of await page.locator('img[loading="lazy"]').all()) {
          await img.scrollIntoViewIfNeeded();
          await expect(img).toHaveJSProperty("complete", true);
          await expect(img).not.toHaveJSProperty("naturalWidth", 0);
        }
        await page.evaluate(() =>
          window.scrollTo({ top: 0, behavior: "instant" }),
        );
        for (const icon of await page.locator("#projects img.h-10").all()) {
          const box = await icon.boundingBox();
          expect(box?.width).toBe(box?.height);
        }
        await page.screenshot({
          path: testInfo.outputPath(
            `${path === "/" ? "en" : "ga"}-${width}-${theme}.png`,
          ),
          fullPage: true,
        });
        await page.screenshot({
          path: testInfo.outputPath(
            `${path === "/" ? "en" : "ga"}-${width}-${theme}-viewport.png`,
          ),
        });
        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze();
        expect(results.violations).toEqual([]);
      }
    });
  }
}

test("200% text zoom stays readable without overflow", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("/ga/");
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
});

test("404, sitemap, and absent analytics", async ({ page, request }) => {
  const response = await page.goto("/missing-page/");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Page not found" }),
  ).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex,follow",
  );
  const sitemap = await (await request.get("/sitemap-0.xml")).text();
  expect(sitemap).not.toContain("/en/");
  expect(sitemap).not.toContain("404");
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto("/");
  await expect(page.locator('script[type="text/partytown"]')).toHaveCount(0);
  expect(
    requests.some((url) =>
      /google-analytics|googletagmanager|fonts.googleapis|fonts.gstatic/.test(
        url,
      ),
    ),
  ).toBeFalsy();
  const html = await page.content();
  expect(html).not.toContain("astro-island");
});
