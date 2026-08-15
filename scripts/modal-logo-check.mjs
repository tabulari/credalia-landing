import { chromium } from "@playwright/test";

// Contrast ratio helper (WCAG)
function luminance(hex) {
  const c = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return ((l1 + 0.05) / (l2 + 0.05)).toFixed(2);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3210/", { waitUntil: "domcontentloaded", timeout: 120000 });
await page.waitForTimeout(2000);
await page.getByRole("button", { name: "Solicitar crédito" }).first().click();
await page.getByRole("dialog").waitFor();
await page.waitForTimeout(800);

const info = await page.evaluate(async () => {
  const sidebar = document.querySelector('aside[aria-label="Resumen de simulación"]');
  const img = sidebar?.querySelector("img");
  let svg = null;
  if (img) {
    const res = await fetch(img.getAttribute("src"));
    svg = await res.text();
  }
  return {
    src: img?.getAttribute("src") ?? null,
    alt: img?.getAttribute("alt") ?? null,
    width: img ? img.getBoundingClientRect().width : null,
    height: img ? img.getBoundingClientRect().height : null,
    visible: img ? getComputedStyle(img).visibility !== "hidden" && img.getBoundingClientRect().width > 0 : false,
    navbarBg: getComputedStyle(sidebar).backgroundColor,
    svgHasWhiteDiamond: !!svg && svg.includes('#ffffff'),
    svgHasNavyDiamond: !!svg && svg.includes('#0d2c51'),
  };
});

console.log(JSON.stringify(info, null, 2));
console.log("white diamond vs navy-deep contrast:", info.navbarBg === "rgb(10, 33, 80)" ? contrast("#ffffff", "#0a2150") : `unknown bg ${info.navbarBg}`);
await browser.close();
