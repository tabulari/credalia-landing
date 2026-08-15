import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
await page.goto("http://localhost:3210/", { waitUntil: "networkidle", timeout: 120000 });
await page.waitForTimeout(2000);
const results = await new AxeBuilder({ page }).exclude("nextjs-portal").exclude(".phone").withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"]).analyze();
console.log("violations:", results.violations.length);
for (const v of results.violations) {
  console.log(`\n=== ${v.id} (${v.impact}) — ${v.nodes.length} nodes ===`);
  for (const n of v.nodes.slice(0, 8)) {
    const fg = n.any.find((x) => x.data?.fgColor)?.data;
    console.log(`  ${n.html.slice(0, 110)}`);
    console.log(`    fg=${fg?.fgColor} bg=${fg?.bgColor} ratio=${fg?.contrastRatio}`);
  }
}
await browser.close();
