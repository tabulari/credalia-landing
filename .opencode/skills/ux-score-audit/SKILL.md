---
name: ux-score-audit
description: "Spec-driven UI quality standard for the Credalia platform. Defines what 10/10 means BEFORE code is written. Use when: starting a new UI feature, building dashboards, creating ephemeral views, implementing forms/tables/modals, or auditing any rendered surface. Triggers on: 'build the dashboard', 'create a modal', 'spec this view', 'score this', 'audit this', 'is this 10/10', 'verify the result'. This skill is the contract — code is the implementation, Playwright is the inspector."
---

# Credalia Platform — Spec-Driven UI Quality

> This skill is governed by [SPECIFICATION.md](./SPECIFICATION.md) — the
> architectural contract for how the audit system thinks: the three-layer model,
> the LLM-as-judge protocol, the scoring system, and the extension methodology
> for new surfaces and new products.
>
> The Credalia platform comprises multiple products (landing pages, dashboards,
> application flows, admin panels). This skill applies to ALL of them. The
> universal categories are product-agnostic. Surface-specific specs in `specs/`
> specialize per product.

## 0. Core Principle

**Spec first. Code second. Audit last.**

Every UI surface in the Credalia platform is defined by a specification BEFORE it is built. The spec is the contract. Code implements the contract. Playwright verifies conformance. The score (0-10 per category) measures the gap between spec and reality. A 10/10 means the implementation perfectly matches the specification.

This is not a post-hoc audit methodology. It is a **development methodology**:

```
Define Spec (10/10 criteria) → Implement → Audit → Fix → Re-Audit → Ship
         ↑                                                |
         └─────────── Score < 10? ───────────────────────┘
```

The architecture underlying this loop is defined in [SPECIFICATION.md](./SPECIFICATION.md)
Part I: The Three-Layer Model (Spec → Measurement → Judgment/Repair).

Without a spec, "10/10" is subjective. With a spec, it's measurable.

---

## 0.1 Formal Rules

These rules are non-negotiable. They are precise enough to be implemented
as code. If a rule produces a bad outcome, change the rule — don't ignore it.

### R1. Measurability Gate

```
FOR EACH criterion in a spec:
  IF there exists a Playwright method that can produce a boolean or numeric result:
    ACCEPT criterion
  ELSE:
    REJECT criterion
    → Either rephrase until measurable, or exclude from spec
```

A criterion that can't be measured can't be scored, can't be fixed, and
can't be verified. It is dead weight.

### R2. Layer Contracts

The audit system has three layers. Each has a contract. Break a contract
and everything downstream is unreliable.

| Layer | Must Produce | Contract |
|-------|-------------|----------|
| **Spec** | Declarative, measurable criteria | Every criterion passes R1 |
| **Measurement** | Deterministic facts (styles, DOM, dimensions) | Same page + same viewport = same facts |
| **Judgment** | Scored report + diagnosis + fixes | Every score derivable from measurements + spec |

Debugging order: Layer 2 (stale?) → Layer 1 (wrong criteria?) → Layer 3 (misinterpretation?)

### R3. Scoring Formula

```
BASELINE = average(universal categories)     // 7 categories, each 0-10
SURFACE  = average(surface-specific categories) // 0-3 categories, each 0-10
OVERALL  = average(BASELINE, SURFACE)

// Floor rule:
IF any universal category < 5:
  OVERALL = min(OVERALL, 7)
```

Why 5 and 7? Heuristics. 5/10 means "broken in that category." 7/10
means "good overall but one leg is missing." Adjust if experience shows
different thresholds produce better outcomes.

### R4. Partial Credit

```
FOR EACH criterion:
  IF binary (pass/fail):
    full points OR zero
  IF scalar (e.g., "tap targets ≥ 44px"):
    full if met
    half if ≥ 80% of elements meet it
    zero otherwise
  IF range (e.g., "duration 300-700ms"):
    full if within range
    half if within 20% of boundary
    zero otherwise
```

### R5. Iteration Termination

```
ITERATE:
  fix → rebuild → measure → judge → score
UNTIL:
  score == 10  OR  score unchanged for 2 consecutive iterations

IF score unchanged for 2 iterations AND score < 10:
  ESCALATE to human (LLM is in a local optimum)
```

### R6. Evidence Requirement

```
FOR EACH point awarded in the audit report:
  THERE MUST EXIST a measurement row with:
    - Expected value (from spec)
    - Measured value (from Playwright)
    - Pass/fail verdict
  IF no measurement row exists for a point:
    DO NOT award the point
```

No measurement = no score. This prevents the LLM from awarding points
based on "looks good" or "the code seems right."

### R7. Fresh Build Requirement

```
BEFORE each audit:
  pkill dev server
  rm -rf .next
  rebuild
  restart dev server
  wait for 200 response
```

Stale caches are the #1 source of false audit results.

---

## 1. The Spec-Driven Development Protocol

### 1.1 Before Writing Code: Write the Spec

When tasked with building a new UI surface:

1. **Identify the surface type** — landing, dashboard, ephemeral, or shared component
2. **Load the appropriate spec** from `specs/` — this defines what 10/10 means
3. **Customize the spec** for the specific feature — add context-specific criteria
4. **Write the spec as measurable criteria** — every point must be verifiable via Playwright
5. **Get alignment** — confirm the spec with stakeholders before coding

### 1.2 While Writing Code: Build to Spec

Every implementation decision should trace back to a spec criterion. If you're adding a shadow, it's because the spec says "4-layer navy-tinted drop-shadow". If you're choosing a tag, it's because the spec says "`<button type='button'>` for actions".

### 1.3 After Writing Code: Audit to Spec

1. Fresh build + restart (never trust a cache)
2. Run Playwright audit against the spec criteria
3. Score each category
4. Fix missing points
5. Re-audit until 10/10

### 1.4 The Fresh Build Rule

```bash
pkill -f "next dev"
rm -rf .next
NEXT_PUBLIC_CREDALIA_ALLOW_PLACEHOLDERS=true npx next build
nohup npx next dev -p 3027 > /dev/null 2>&1 &
sleep 10 && curl -s -o /dev/null -w "%{http_code}" http://localhost:3027
```

Stale caches are the #1 source of false positives. Always restart fresh.

---

## 2. Platform Architecture

These constants are the foundation of every spec. They are non-negotiable across all surfaces.

### 2.1 Design Tokens

All colors MUST use CSS variables or Tailwind classes. Never hardcode hex values in component code.

```css
--navy: #0d2a5e; --navy-deep: #0a2150; --navy-ink: #11213f
--orange: #f5601b
--green: #1e9e55; --green-ink: #15793f; --green-soft: #e8f2dd; --green-tint: #e7faf4
--ink: #14213d; --muted-2: #677085
--bg-soft: #f7f9fa; --border: #e5e9ee; --error: #d4483b
```

### 2.2 Viewport Breakpoints

| Name | Width | Prefix | Usage |
|------|-------|--------|-------|
| Default | 0+ | none | Mobile-first base |
| sm | 600px | `sm:` | Mobile → small tablet |
| md | 720px | `md:` | Small tablet → tablet |
| lg | 760px | `lg:` | Tablet → 2-col layouts |
| timeline | 880px | `timeline:` | Timeline section |
| stack | 980px | `stack:` | Full desktop layout |

### 2.3 Typography Scale

| Role | Size | Weight | Font | Tracking |
|------|------|--------|------|----------|
| Hero h1 | 48/72px | 400 | DM Serif Display (`--font-display`) | tight |
| Section h2 | 24/30px | 400 | DM Serif Display | tight |
| Eyebrow | 12px | 600 | Plus Jakarta Sans (`--font-jakarta`) | widest |
| Body | 16px | 400 | Plus Jakarta Sans | normal |
| Amounts | 60/96px | 800 | Plus Jakarta Sans | tight |
| Labels | 12px | 600 | Plus Jakarta Sans | normal |

### 2.4 Animation Constants

| Property | Value | Rationale |
|----------|-------|-----------|
| Micro interaction | ≤ 400ms | Fast feedback |
| Orchestrated reveal | ≤ 700ms | Entrance choreography |
| Scroll-triggered | ≤ 600ms | Scroll-linked |
| Entrance easing | `power3.out` | Natural deceleration |
| Spring easing | `back.out(1.4)` | Slight overshoot |
| Exit easing | `power2.in` | Acceleration away |
| Stagger | 25-150ms | Natural cascade |
| Float amplitude | ≤ 6px | Subtle |
| Float period | 3-5s | Meditative |

### 2.5 Accessibility Floor

These are minimum requirements for ALL surfaces:

- Color contrast ≥ 4.5:1 (WCAG AA)
- Tap targets ≥ 44×44px
- Focus-visible outline ≥ 2px on all interactive elements
- `prefers-reduced-motion: reduce` disables ALL animation
- `<button>` for actions, `<a>` for navigation — never `<a href="#">`
- `aria-hidden="true"` only on purely decorative elements
- Heading hierarchy: h1 → h2 → h3, no skipped levels
- Every form input has a label (visible or `aria-label`)

---

## 3. Universal Quality Categories

These 7 categories apply to EVERY UI surface. Each is scored 0-10. The scoring
composition and floor rule are defined in [SPECIFICATION.md](./SPECIFICATION.md)
Part II §5 and formalized in §0 of this document.

### 3.1 Visual Fidelity (10pts)

Does it match the design system? Colors from tokens, typography from scale, spacing from grid.

| Pts | Criterion | Verify With |
|-----|-----------|-------------|
| 2 | Colors use CSS vars / Tailwind classes (no hardcoded hex) | `getComputedStyle()` matches token |
| 2 | Typography matches scale (size, weight, tracking) | `fontSize/fontWeight/letterSpacing` |
| 1 | Spacing follows 4/8px grid | `padding/margin` values |
| 1 | Border-radius matches design token | `borderRadius` |
| 1 | Shadows are brand-tinted (navy/green, not gray) | `boxShadow` RGB values |
| 1 | No visual regressions | Element comparison vs. prior state |
| 1 | Theme variant correct (if applicable) | Colors adapt to theme |
| 1 | No horizontal overflow at any viewport | `scrollWidth <= innerWidth + 2` |

### 3.2 Layout & Composition (10pts)

Is the spatial arrangement correct? Balanced, intentional, responsive.

| Pts | Criterion | Verify With |
|-----|-----------|-------------|
| 2 | Grid/flex alignment matches spec | Children rects aligned |
| 2 | Responsive breakpoints shift at correct widths | Layout changes at sm/md/lg/stack |
| 1 | No unintended overlaps | No rect intersections |
| 1 | No unintended clipping | `overflow:hidden` parents don't cut content |
| 1 | Centering correct where intended | Element center ≈ parent center (±3px) |
| 1 | Gap/spacing consistent with spec | `gap` values match |
| 1 | Asymmetric ratios maintained | Column widths match ratio |
| 1 | Fixed/sticky elements don't obscure content | Content not behind fixed elements |

### 3.3 Interaction & Behavior (10pts)

Do interactive elements work? Are they accessible? Correct HTML semantics?

| Pts | Criterion | Verify With |
|-----|-----------|-------------|
| 2 | Correct HTML tags (`<button>` actions, `<a>` nav) | `tagName` + `type` check |
| 2 | Keyboard-navigable (tab order, focus ring) | `tabIndex`, `:focus-visible` |
| 1 | Tap targets ≥ 44×44px | `getBoundingClientRect()` |
| 1 | Form inputs have labels | `aria-label` or `<label>` |
| 1 | External links: `rel="noopener noreferrer"` | `getAttribute('rel')` |
| 1 | JS actions use `<button type="button">` | `tagName` + `type` |
| 1 | Modal focus trap | Tab doesn't escape open modal |
| 1 | Loading states during async ops | Spinner/skeleton visible during fetch |

### 3.4 Motion & Animation (10pts)

Smooth, purposeful, accessible animations.

| Pts | Criterion | Verify With |
|-----|-----------|-------------|
| 2 | Entrance animations play correctly | `transform`/`opacity` change over time |
| 2 | `prefers-reduced-motion` disables ALL animation | `animationName === 'none'` |
| 1 | Durations within limits (≤400ms micro, ≤700ms reveal) | `animationDuration` / GSAP |
| 1 | Only `transform` + `opacity` animated (GPU) | No layout-triggering properties |
| 1 | No CSS/GSAP transform conflicts | CSS doesn't override GSAP inline |
| 1 | Scroll triggers fire at correct position | Elements visible at trigger point |
| 1 | Transitions between animation systems seamless | No visual "snap" |
| 1 | Stagger feels natural | Intervals 25-150ms |

### 3.5 Data Integrity (10pts)

Correct data, correct calculations, correct formatting.

| Pts | Criterion | Verify With |
|-----|-----------|-------------|
| 2 | Computed values match expected results | Calculation function output = displayed text |
| 2 | Currency formatting correct | `fmtCOP()` output = displayed text |
| 1 | Config values rendered correctly | `config.brandName` etc. visible |
| 1 | No placeholder values in production | No `⚠️` or `placeholder` text |
| 1 | Dynamic content updates reactively | Value changes propagate to UI |
| 1 | Empty states handled gracefully | No blank areas when data missing |
| 1 | Error states displayed properly | Error messages visible and styled |
| 1 | No flash of incorrect data | Skeleton/spinner before data arrives |

### 3.6 Accessibility (10pts)

Everyone can use it. WCAG 2.1 AA minimum.

| Pts | Criterion | Verify With |
|-----|-----------|-------------|
| 2 | Color contrast ≥ 4.5:1 | axe-core or RGB calculation |
| 2 | Images/decorative: alt or aria-hidden | `alt` attr or `aria-hidden` |
| 1 | Heading hierarchy logical | h1→h2→h3, no skips |
| 1 | Focus indicators visible | `:focus-visible` ≥ 2px outline |
| 1 | Icon-only buttons have aria-label | `getAttribute('aria-label')` |
| 1 | Role attributes correct | Landmarks, buttons, links |
| 1 | No aria-hidden on interactive parents | No focusable children inside `aria-hidden` |
| 1 | Screen reader text where needed | `.sr-only` elements present |

### 3.7 Performance & Bundle (10pts)

Loads fast. Bundle is lean.

| Pts | Criterion | Verify With |
|-----|-----------|-------------|
| 2 | Page JS ≤ limit (landing: 40kB, dashboard: 80kB) | Build output |
| 2 | First Load JS ≤ limit (landing: 180kB, dashboard: 250kB) | Build output |
| 1 | `'use client'` only on leaf components | No unnecessary client boundaries |
| 1 | No duplicate dependencies | Build output, no duplicate chunks |
| 1 | Images via next/image | `<img>` tags use next/image |
| 1 | Fonts: `display: swap` | `font-display` in CSS |
| 1 | No layout shift (CLS < 0.1) | Reserved dimensions for dynamic content |
| 1 | Zero console errors in normal flow | `page.on('console')` error count |

---

## 4. Surface-Specific Specifications

Each surface type extends the universal categories with its own spec. These live in `specs/` and define what 10/10 means for that surface type.

| File | Surface | When to Use |
|------|---------|-------------|
| `specs/landing.md` | Public landing pages | Building or auditing hero, simulator, FAQ, CTA, footer |
| `specs/dashboard.md` | Authenticated dashboard | Building or auditing loan overview, payments, documents |
| `specs/ephemeral.md` | Transient UI | Building or auditing modals, toasts, confirmations, loading states |
| `specs/shared-components.md` | Reusable components | Building or auditing forms, tables, cards, navigation |

### How to Use a Surface Spec

1. Load the relevant `specs/*.md` file
2. Read the surface-specific categories (10pts each)
3. Score universal and surface-specific categories separately
4. Apply composition formula (see §0 below)
5. Customize with feature-specific criteria if needed
6. Implement, audit, iterate until 10/10

### Creating a New Surface Spec

If building a surface type not yet covered:

1. Copy an existing spec as a template
2. Define 1-3 additional categories (10pts each) specific to that surface
3. Every criterion must be measurable via Playwright
4. Save as `specs/{surface-name}.md`
5. Register it by referencing in this document

---

## 5. The Audit Methodology

The LLM-as-Judge protocol that governs how interpretation and scoring work
is defined in [SPECIFICATION.md](./SPECIFICATION.md) Part II §4–7. The
Playwright translation patterns are in Part IV §8.

### 5.1 Playwright as Inspector

Playwright is our only reliable "eye". It measures what's actually rendered, not what the code says should render.

**What Playwright Measures:**

| Domain | Properties | Playwright Method |
|--------|-----------|-------------------|
| Structure | Element exists, tagName, parent, child order, attributes | `querySelector`, `tagName`, `getAttribute` |
| Dimensions | width, height, borderRadius, padding, margin | `getBoundingClientRect()`, `getComputedStyle()` |
| Colors | backgroundColor, color, borderColor, opacity | `getComputedStyle()` → parse RGB |
| Shadows | boxShadow layers, drop-shadow filter count, shadow colors | `getComputedStyle().boxShadow` → parse layers |
| Typography | fontSize, fontWeight, letterSpacing, lineHeight, fontFamily | `getComputedStyle()` → parse values |
| Layout | flex/grid alignment, gap, centering | `getBoundingClientRect()` → compare rects |
| Animation | animationName, animationDuration, transform at timestamps | `getComputedStyle()` at T0 and T1 |
| Accessibility | aria-hidden, tabIndex, role, focus-visible, alt text | `getAttribute()`, `aria-*` attributes |
| Interactivity | href, onClick, button type, target/rel attributes | `tagName`, `type`, `getAttribute('rel')` |
| Scroll | scrollTop, scrollHeight, clientHeight, overflow | DOM scroll properties |

### 5.2 Translation Patterns

These patterns show how to translate spec criteria into Playwright queries.

#### Color: Token Conformance

```javascript
const el = await page.$(selector);
const cs = await page.evaluate(e => {
  const s = getComputedStyle(e);
  return { bg: s.backgroundColor, color: s.color, border: s.borderColor };
}, el);

function rgbMatches(rgbStr, r, g, b, tolerance = 2) {
  const match = rgbStr.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return false;
  return Math.abs(+match[1] - r) <= tolerance
      && Math.abs(+match[2] - g) <= tolerance
      && Math.abs(+match[3] - b) <= tolerance;
}
```

#### Typography: Scale Conformance

```javascript
const el = await page.$('h2');
const typo = await page.evaluate(e => {
  const s = getComputedStyle(e);
  return {
    fontSize: parseFloat(s.fontSize),
    fontWeight: +s.fontWeight,
    fontFamily: s.fontFamily,
    letterSpacing: s.letterSpacing,
  };
}, el);
```

#### Layout: Ratio Verification

```javascript
const [col1, col2] = await page.$$('.grid > *');
const rects = await page.evaluate((...els) =>
  els.map(e => { const r = e.getBoundingClientRect(); return { w: r.width }; }),
col1, col2);
const ratio = rects[0].w / rects[1].w;
```

#### Shadow: Tint Verification

```javascript
const shadow = await page.evaluate(e =>
  getComputedStyle(e).boxShadow, el);
function parseBoxShadow(str) {
  return str.split(/(?=rgb)/).map(layer => {
    const m = layer.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    return m ? { r: +m[1], g: +m[2], b: +m[3], a: m[4] ? +m[4] : 1 } : null;
  }).filter(Boolean);
}
```

#### Accessibility: Tap Target Check

```javascript
const interactives = await page.$$('a, button, input, select, textarea, [tabindex]');
const tooSmall = [];
for (const el of interactives) {
  const rect = await el.boundingBox();
  if (rect && (rect.width < 44 || rect.height < 44)) {
    tooSmall.push({ tag: await el.evaluate(e => e.tagName), w: rect.width, h: rect.height });
  }
}
```

### 5.3 Mandatory Viewport Matrix

Every final audit must pass at ALL viewports:

| Name | Dimensions | Rationale |
|------|-----------|-----------|
| Mobile S | 375×812 | iPhone SE / small Android |
| Mobile L | 390×844 | iPhone 14/15 |
| Tablet | 768×1024 | iPad portrait |
| Desktop | 1280×900 | Standard laptop |
| Wide | 1440×900 | External monitor |

### 5.4 Mandatory Context Matrix

| Context | Verification |
|---------|-------------|
| Normal | Full rendering + animation + interaction |
| Reduced motion | All animations disabled, content visible, no layout shift |
| Keyboard-only | All elements focusable, logical tab order, no traps |

### 5.5 Audit Script Patterns

See Section 8 for complete script templates.

---

## 6. Pitfall Catalog

### 6.1 Rendering

| Pitfall | Detection | Fix |
|---------|-----------|-----|
| Stale cache shows old code | Different results before/after `rm -rf .next` | Always fresh build |
| Measuring container not child | `tagName`/`className` mismatch | Query specific selector |
| `overflow:hidden` clips interactives | `rect.bottom > parent.bottom` | Scroll to element or adjust overflow |
| CSS animation overrides GSAP | `transform` has only CSS values | `gsap.set(el, { clearProps: 'transform' })` before CSS class |
| `rotateY` without perspective | No 3D effect visible | Add `perspective` on parent |
| WebGL canvas empty on readPixels | `readPixels` returns [0,0,0,0] | `preserveDrawingBuffer: true` or test separately |
| `mix-blend-mode: multiply` invisible on white | Shader invisible on `#fff` | Use `normal` blend with near-white colors |
| GSAP scrollTop not yet applied | `scrollTop` read before animation ends | Wait `duration + 500ms` |

### 6.2 Accessibility

| Pitfall | Detection | Fix |
|---------|-----------|-----|
| `aria-hidden` on interactive parent | Focusable child inside `aria-hidden` | Remove `aria-hidden` when adding interactive elements |
| `<a href="#">` for JS actions | `tagName === 'A'` + `href="#"` | Use `<button type="button">` |
| Missing focus ring | No `:focus-visible` style | Add `outline: 2px solid; outline-offset: 2px` |
| Tap target < 44×44px | `rect.width/height < 44` | Add padding |
| Skipped heading levels | h1→h3 without h2 | Fix hierarchy |

### 6.3 Animation

| Pitfall | Detection | Fix |
|---------|-----------|-----|
| Reduced-motion not respected | Animation plays with `prefers-reduced-motion` | Add media query overrides |
| GSAP ScrollTrigger not registered | Console "Missing plugin?" | `gsap.registerPlugin()` in module scope |
| GSAP→CSS animation snap | Visual jump on class add | `clearProps` then add class in same frame |
| Infinite animation leaks | `repeat: -1` without cleanup | `gsap.context()` + revert on unmount |
| `gsap.from` with pre-hidden elements | `autoAlpha: 0` start = `autoAlpha: 0` end = no animation | Use `gsap.to` instead |

### 6.4 LLM-as-Judge

See [SPECIFICATION.md](./SPECIFICATION.md) Part II §7 for the full catalog
of anti-patterns: hallucinating criteria, aesthetic scoring, cached
measurements, partial observation, confirmation bias, overfitting to code,
scope creep, and anchoring.

---

## 7. Rule of Ruthlessness

1. **Spec first** — define 10/10 before writing code
2. **Never accept "looks good"** — measure it
3. **Never trust a cached server** — always fresh build
4. **Never score code** — score rendered output
5. **Never skip mobile** — 60%+ traffic is mobile
6. **Never skip reduced motion** — legal requirement
7. **Never award unverified points** — Playwright or nothing
8. **Never stop at 9** — the last point is the most important
9. **Never blame the tool** — fix the audit script, then re-audit
10. **Never ship without a passing audit** — unaudited = regression

---

## 8. Audit Script Library

### 8.1 Single-Element Audit

```javascript
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: [WIDTH, HEIGHT] });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(WAIT_MS);

  const result = await page.evaluate(() => {
    const el = document.querySelector(SELECTOR);
    if (!el) return { exists: false };
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      exists: true, tag: el.tagName, width: r.width, height: r.height,
      bg: cs.backgroundColor, color: cs.color, opacity: cs.opacity,
      radius: cs.borderRadius, transform: cs.transform,
      ariaHidden: el.getAttribute('aria-hidden'), tabIndex: el.tabIndex,
    };
  });

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
```

### 8.2 Multi-Viewport Audit

```javascript
const VIEWPORTS = [
  { name: 'mobile-s', w: 375, h: 812 },
  { name: 'mobile-l', w: 390, h: 844 },
  { name: 'tablet',   w: 768, h: 1024 },
  { name: 'desktop',  w: 1280, h: 900 },
  { name: 'wide',     w: 1440, h: 900 },
];
for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  const result = await page.evaluate(() => ({
    noOverflow: document.body.scrollWidth <= window.innerWidth + 2,
    /* surface-specific checks */
  }));
  console.log(`${vp.name}:`, JSON.stringify(result));
  await page.close();
}
```

### 8.3 Reduced-Motion Audit

```javascript
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
const result = await page.evaluate(() => {
  const animated = document.querySelectorAll('[class*="floating"], [class*="animate"]');
  return {
    allDisabled: Array.from(animated).every(el => getComputedStyle(el).animationName === 'none'),
    contentVisible: true,
  };
});
```

### 8.4 Keyboard Navigation Audit

```javascript
const selectors = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
const count = await page.evaluate(s => document.querySelectorAll(s).length, selectors);
for (let i = 0; i < Math.min(count, 30); i++) {
  await page.keyboard.press('Tab');
  const f = await page.evaluate(() => ({
    tag: document.activeElement?.tagName,
    text: document.activeElement?.textContent?.substring(0, 30),
    focusRing: getComputedStyle(document.activeElement).outlineWidth !== '0px',
  }));
  console.log(`Tab ${i+1}:`, JSON.stringify(f));
}
```

### 8.5 Scoring Audit

```javascript
const categories = {
  visualFidelity: (d) => { let s=0; /* criteria */ return s; },
  layoutComposition: (d) => { /* ... */ },
  interactionBehavior: (d) => { /* ... */ },
  motionAnimation: (d) => { /* ... */ },
  dataIntegrity: (d) => { /* ... */ },
  accessibility: (d) => { /* ... */ },
  performanceBundle: (d) => { /* ... */ },
  // Add surface-specific from specs/*.md
};
const scores = {};
for (const [cat, fn] of Object.entries(categories)) scores[cat] = fn(data);
const total = Object.values(scores).reduce((a,b) => a+b, 0) / Object.keys(scores).length;
for (const [cat, score] of Object.entries(scores))
  console.log(`${cat}: ${score}/10${score<10 ? ` — ${10-score} missing` : ''}`);
console.log(`OVERALL: ${total.toFixed(1)}/10`);
```
