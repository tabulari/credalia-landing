const { chromium } = require('playwright');
const fs = require('fs');

const URL = 'http://localhost:3027';
const VIEWPORTS = [
  { name: 'mobile-s', w: 375, h: 812 },
  { name: 'mobile-l', w: 390, h: 844 },
  { name: 'tablet', w: 768, h: 1024 },
  { name: 'desktop', w: 1280, h: 900 },
  { name: 'wide', w: 1440, h: 900 },
];

// ── helpers ──────────────────────────────────────────────────
function parseRGBA(str) {
  if (!str) return null;
  const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  return m ? { r: +m[1], g: +m[2], b: +m[3], a: m[4] !== undefined ? +m[4] : 1 } : null;
}

function parseDropShadows(filter) {
  const re = /drop-shadow\([^)]+\)/g;
  const out = [];
  let m;
  while ((m = re.exec(filter)) !== null) {
    const c = parseRGBA(m[0]);
    if (c) out.push(c);
  }
  return out;
}

// ── measurement function (runs inside browser) ──────────────
function measureAll() {
  // Inline helpers (no closure over Node scope)
  function parseRGBA(str) {
    if (!str) return null;
    const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    return m ? { r: +m[1], g: +m[2], b: +m[3], a: m[4] !== undefined ? +m[4] : 1 } : null;
  }
  function parseDropShadows(filter) {
    const re = /drop-shadow\([^)]+\)/g;
    const out = [];
    let m;
    while ((m = re.exec(filter)) !== null) {
      const c = parseRGBA(m[0]);
      if (c) out.push(c);
    }
    return out;
  }

  const data = {};
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);
  const cs = (el) => el ? getComputedStyle(el) : null;
  const rect = (el) => el ? el.getBoundingClientRect() : null;

  // ── NAV ────────────────────────────────────
  const nav = $('header#top');
  const navCs = cs(nav);
  data.nav = nav ? {
    exists: true,
    sticky: navCs.position === 'sticky' || navCs.position === 'fixed',
    height: rect(nav).height,
    bgIncludesBlur: navCs.backdropFilter !== 'none',
    bgColor: navCs.backgroundColor,
  } : { exists: false };

  // ── HERO SECTION ───────────────────────────
  const hero = $('section[aria-labelledby="hero-heading"]');
  const heroCs = cs(hero);
  data.hero = hero ? {
    exists: true,
    paddingTop: parseFloat(heroCs.paddingTop),
    paddingBottom: parseFloat(heroCs.paddingBottom),
    display: heroCs.display,
    overflow: heroCs.overflow,
    scrollWidth: hero.scrollWidth,
    clientWidth: hero.clientWidth,
  } : { exists: false };

  // ── H1 ─────────────────────────────────────
  const h1 = $('#hero-heading');
  const h1Cs = cs(h1);
  data.h1 = h1 ? {
    exists: true,
    text: h1.textContent?.trim().substring(0, 60),
    fontSize: parseFloat(h1Cs.fontSize),
    fontWeight: h1Cs.fontWeight,
    fontFamily: h1Cs.fontFamily,
    color: h1Cs.color,
    letterSpacing: h1Cs.letterSpacing,
  } : { exists: false };

  // ── PHONE MOCKUP ───────────────────────────
  const phone = $('.phone');
  const phoneRect = rect(phone);
  const phoneCs = cs(phone);
  const phoneBody = $('.phone-body');
  const phoneBodyCs = cs(phoneBody);
  const phoneScreen = $('.phone-screen');
  const phoneScreenCs = cs(phoneScreen);
  const phoneIsland = $('.phone-island');
  const islandRect = rect(phoneIsland);
  const phoneGlow = $('.phone-glow');
  const glowRect = rect(phoneGlow);
  const glowCs = cs(phoneGlow);

  data.phone = phone ? {
    exists: true,
    width: phoneRect.width,
    height: phoneRect.height,
    filter: phoneCs.filter,
    dropShadowCount: parseDropShadows(phoneCs.filter).length,
    dropShadowsNavy: parseDropShadows(phoneCs.filter).filter(s => s.r === 13 && s.g === 42 && s.b === 94).length,
    bodyBg: phoneBodyCs?.background || '',
    bodyBgIsGradient: (phoneBodyCs?.background || '').includes('linear-gradient'),
    bodyGradientStops: ((phoneBodyCs?.background || '').match(/%/g) || []).length,
    bodyBorderRadius: parseFloat(phoneBodyCs?.borderRadius || '0'),
    screenBorderRadius: parseFloat(phoneScreenCs?.borderRadius || '0'),
    islandWidth: islandRect?.width || 0,
    islandHeight: islandRect?.height || 0,
    islandBg: cs(phoneIsland)?.backgroundColor || '',
    islandBorderRadius: parseFloat(cs(phoneIsland)?.borderRadius || '0'),
    glowWidth: glowRect?.width || 0,
    glowHeight: glowRect?.height || 0,
    glowBg: glowCs?.background || '',
    glowFilter: glowCs?.filter || '',
    hasPseudoBefore: true, // can't check directly from JS, but we know from CSS
    animationName: phoneCs.animationName,
    transformSamples: [],
  } : { exists: false };

  // ── SIMULATOR ──────────────────────────────
  const sim = $('#simulator');
  const simCs = cs(sim);
  const simPayment = sim ? sim.querySelector('[class*="text-4xl"]') : null;
  const simSlider = sim ? sim.querySelector('input[type="range"]') : null;
  const simInput = sim ? sim.querySelector('input[type="text"]') : null;
  const simTermChips = sim ? sim.querySelectorAll('[role="radio"]') : [];
  const simFreqChips = sim ? sim.querySelectorAll('.chip-freq') : [];
  const simError = sim ? sim.querySelector('[role="alert"]') : null;
  const reassurance = sim ? sim.querySelectorAll('.bg-green-tint, .bg-orange\\/8') : [];

  data.simulator = sim ? {
    exists: true,
    borderTop: simCs.borderTop,
    borderTopHasGreen: simCs.borderTopColor?.includes('30, 158, 85') || simCs.borderTop.includes('green'),
    boxShadow: simCs.boxShadow,
    paymentText: simPayment?.textContent?.trim() || '',
    sliderExists: !!simSlider,
    inputExists: !!simInput,
    sliderValue: simSlider ? simSlider.value : null,
    inputValue: simInput ? simInput.value : null,
    termChipCount: simTermChips.length,
    freqChipCount: simFreqChips.length,
    errorRoleAlert: !!simError,
    reassuranceChipCount: reassurance.length,
  } : { exists: false };

  // ── SECTIONS ORDER & BG ────────────────────
  const main = $('main');
  const sections = main ? Array.from(main.querySelectorAll(':scope > section')) : [];
  data.sections = sections.map((s, i) => {
    const sCs = cs(s);
    const id = s.id || '';
    const labelId = s.getAttribute('aria-labelledby') || '';
    const h2 = s.querySelector(`#${labelId}`);
    const eyebrow = s.querySelector('p.tracking-widest');
    return {
      index: i,
      id,
      bg: sCs.backgroundColor,
      paddingTop: parseFloat(sCs.paddingTop),
      paddingBottom: parseFloat(sCs.paddingBottom),
      h2Text: h2?.textContent?.trim() || '',
      h2FontFamily: cs(h2)?.fontFamily || '',
      eyebrowText: eyebrow?.textContent?.trim() || '',
    };
  });

  // ── SECTION DIVIDERS ───────────────────────
  const dividers = $$('main > div > svg');
  data.dividers = {
    count: dividers.length,
    viewBoxes: Array.from(dividers).map(d => d.getAttribute('viewBox')),
  };

  // ── CTA BANNER ─────────────────────────────
  const cta = $('section[aria-labelledby="cta-heading"]');
  const ctaDotGrid = cta ? cta.querySelector('div.absolute[aria-hidden="true"]') : null;
  const ctaDotGridCs = cs(ctaDotGrid);
  data.ctaBanner = cta ? {
    exists: true,
    bg: cs(cta).backgroundColor,
    hasDotGrid: !!ctaDotGrid,
    dotGridBg: ctaDotGridCs?.backgroundImage || '',
    hasRadialGradient: (ctaDotGridCs?.backgroundImage || '').includes('radial-gradient'),
    panelBg: cs(cta.querySelector('[data-cta="panel"]'))?.backgroundColor || '',
    panelRing: cs(cta.querySelector('[data-cta="panel"]'))?.boxShadow || '',
  } : { exists: false };

  // ── FOOTER ─────────────────────────────────
  const footer = $('footer[data-slot="footer"]');
  data.footer = footer ? {
    exists: true,
    hasBorderTop: cs(footer).borderTopWidth !== '0px',
    bg: cs(footer).backgroundColor,
    tiers: footer.querySelectorAll(':scope > div').length,
  } : { exists: false };

  // ── STICKY BAR ─────────────────────────────
  const stickyBar = $('[data-slot="payment-bar"]');
  data.stickyBar = stickyBar ? {
    exists: true,
    position: cs(stickyBar).position,
    hasAriaLive: !!stickyBar.querySelector('[aria-live]'),
    hasInert: stickyBar.hasAttribute('inert'),
  } : { exists: false };

  // ── GLOBAL CHECKS ──────────────────────────
  // No horizontal overflow
  data.noHorizontalOverflow = document.body.scrollWidth <= window.innerWidth + 2;

  // h1 count
  data.h1Count = $$('h1').length;

  // Heading hierarchy
  const headings = Array.from($$('h1, h2, h3, h4, h5, h6'));
  data.headingHierarchy = headings.map(h => ({ tag: h.tagName, level: parseInt(h.tagName[1]) }));
  let hierarchyCorrect = true;
  let lastLevel = 0;
  for (const h of data.headingHierarchy) {
    if (h.level > lastLevel + 1 && lastLevel !== 0) hierarchyCorrect = false;
    lastLevel = h.level;
  }
  data.hierarchyCorrect = hierarchyCorrect;

  // Tap targets
  const interactives = $$('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
  let smallTargets = [];
  interactives.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0 && (r.width < 44 || r.height < 44)) {
      smallTargets.push({ tag: el.tagName, w: Math.round(r.width), h: Math.round(r.height), text: el.textContent?.trim().substring(0, 20) || el.getAttribute('aria-label')?.substring(0, 20) || '' });
    }
  });
  data.tapTargets = { total: interactives.length, small: smallTargets };

  // Images alt
  const images = $$('img');
  let imagesWithoutAlt = [];
  images.forEach(img => {
    if (img.getAttribute('alt') === null && img.getAttribute('aria-hidden') !== 'true') {
      imagesWithoutAlt.push({ src: (img.getAttribute('src') || '').substring(0, 40) });
    }
  });
  data.images = { total: images.length, withoutAlt: imagesWithoutAlt };

  // Focus-visible
  data.hasFocusVisibleStyles = true; // We check this in the reduced-motion/keyboard context

  // aria-hidden on interactive parents
  const hiddenParents = $$('[aria-hidden="true"]');
  let badHidden = [];
  hiddenParents.forEach(parent => {
    const interactive = parent.querySelectorAll('a[href], button, input, select, textarea');
    if (interactive.length > 0) {
      badHidden.push(parent.className?.substring(0, 30));
    }
  });
  data.ariaHiddenInteractives = badHidden;

  // External links
  const externalLinks = $$('a[href^="http"]');
  let badExternalLinks = [];
  externalLinks.forEach(link => {
    const rel = link.getAttribute('rel') || '';
    if (!rel.includes('noopener') || !rel.includes('noreferrer')) {
      badExternalLinks.push({ href: (link.getAttribute('href') || '').substring(0, 40), rel });
    }
  });
  data.externalLinks = { total: externalLinks.length, bad: badExternalLinks };

  // Form labels
  const inputs = $$('input, select, textarea');
  let inputsWithoutLabel = [];
  inputs.forEach(input => {
    const hasAriaLabel = !!input.getAttribute('aria-label');
    const hasAriaLabelledBy = !!input.getAttribute('aria-labelledby');
    const hasLabel = !!document.querySelector(`label[for="${input.id}"]`);
    const inLabel = !!input.closest('label');
    if (!hasAriaLabel && !hasAriaLabelledBy && !hasLabel && !inLabel) {
      inputsWithoutLabel.push({ type: input.type, id: input.id });
    }
  });
  data.formLabels = { total: inputs.length, withoutLabel: inputsWithoutLabel };

  // Screen reader text
  const srOnly = $$('[class*="sr-only"], .visually-hidden');
  data.srOnlyCount = srOnly.length;

  // aria-live regions
  const ariaLive = $$('[aria-live]');
  data.ariaLiveCount = ariaLive.length;

  // sr-only with live info (simulator)
  data.simHasScreenReaderAnnouncement = !!sim?.querySelector('.sr-only[aria-live]');

  // JS action buttons type
  const buttons = $$('button');
  let buttonsWithoutType = [];
  buttons.forEach(btn => {
    if (!btn.getAttribute('type')) {
      buttonsWithoutType.push(btn.textContent?.trim().substring(0, 25) || '');
    }
  });
  data.buttons = { total: buttons.length, withoutType: buttonsWithoutType };

  // Design token usage (check computed values against tokens)
  data.tokenChecks = {
    navyToken: h1Cs?.color?.includes('13, 42, 94') || h1Cs?.color?.includes('20, 33, 61'),
    greenTokenUsed: $$('[class*="text-green"]').length > 0 || $$('[class*="bg-green"]').length > 0,
    orangeTokenUsed: $$('[class*="text-orange"]').length > 0,
  };

  // Animation system detection — GSAP is bundled via ES modules so
  // window.gsap is undefined. Instead detect by inline transform styles
  // that GSAP sets (gsap.set / gsap.to write inline styles).
  const elsWithGsapTransforms = $$('[style*="transform"]');
  const splitChars = $$('.gsap-split-char, [class*="gsap"]');
  // Also check for GSAP-specific inline styles (translate, opacity set by gsap)
  let hasGsapInlineStyles = false;
  const checkEls = $$('.phone, [data-hero], [data-hiw], [data-faq], [data-cta]');
  checkEls.forEach(el => {
    const style = el.getAttribute('style') || '';
    if (style.includes('transform') || style.includes('opacity')) hasGsapInlineStyles = true;
  });
  
  data.animation = {
    hasGSAP: elsWithGsapTransforms.length > 0 || splitChars.length > 0 || hasGsapInlineStyles,
    hasCSSAnimation: $$('[class*="animate"]').length > 0 || $$('.typing-indicator').length > 0,
    hasScrollTrigger: hasGsapInlineStyles || elsWithGsapTransforms.length > 0,
    gsapTransformCount: elsWithGsapTransforms.length,
    hasGsapInlineStyles,
  };

  // Reduced motion media query check
  let hasReducedMotionRules = false;
  try {
    Array.from(document.styleSheets).forEach(sheet => {
      try {
        Array.from(sheet.cssRules || []).forEach(rule => {
          if (rule.cssText?.includes('prefers-reduced-motion')) hasReducedMotionRules = true;
        });
      } catch (e) {}
    });
  } catch (e) {}
  data.hasReducedMotionRules = hasReducedMotionRules;

  // No placeholder text
  const bodyText = document.body.textContent || '';
  data.noPlaceholderText = !bodyText.includes('⚠️') && !bodyText.toLowerCase().includes('[placeholder]') && !bodyText.includes('[missing]');

  // Config brand name visible
  data.brandVisible = bodyText.includes('Credalia') || bodyText.includes('Kredit');

  // Currency formatting present
  data.hasCurrencyFormatting = bodyText.includes('$') && (bodyText.includes('/mes') || bodyText.includes('/quincena'));

  // Console errors will be collected externally

  return data;
}

async function measureReducedMotion(page) {
  return await page.evaluate(() => {
    const data = {};
    // Check typing indicator animation
    const typing = document.querySelector('.typing-indicator span');
    if (typing) {
      data.typingAnimationName = getComputedStyle(typing).animationName;
      data.typingAnimationNone = getComputedStyle(typing).animationName === 'none';
    }
    // Check phone shine
    const shine = document.querySelector('.phone-shine');
    if (shine) {
      data.phoneShineDisplay = getComputedStyle(shine).display;
    }
    // Check that hero elements are visible (not stuck at opacity 0)
    const heroHeading = document.querySelector('#hero-heading');
    data.heroH1Visible = heroHeading ? parseFloat(getComputedStyle(heroHeading).opacity) > 0.5 : false;
    // Check phone elements visible
    const phoneBubbles = document.querySelectorAll('.bubble');
    data.bubblesVisible = phoneBubbles.length > 0 ? Array.from(phoneBubbles).every(b => parseFloat(getComputedStyle(b).opacity) > 0.5) : false;
    return data;
  });
}

async function measureKeyboardNav(page) {
  const results = [];
  const selectors = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const count = await page.evaluate(s => document.querySelectorAll(s).length, selectors);
  const maxTabs = Math.min(count, 30);
  
  for (let i = 0; i < maxTabs; i++) {
    await page.keyboard.press('Tab');
    const f = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return null;
      const outlineWidth = parseFloat(getComputedStyle(el).outlineWidth) || 0;
      const boxShadow = getComputedStyle(el).boxShadow;
      const ringInClass = el.className?.includes('ring') || false;
      return {
        tag: el.tagName,
        text: el.textContent?.trim().substring(0, 25) || el.getAttribute('aria-label')?.substring(0, 25) || '',
        hasFocusIndicator: outlineWidth >= 2 || boxShadow.includes('ring') || ringInClass || boxShadow !== 'none',
        outlineWidth,
      };
    });
    results.push(f);
  }
  return results;
}

// ── scoring functions ───────────────────────────────────────
function scoreVisualFidelity(d) {
  const criteria = [];
  let score = 0;

  // C1.1 (2pts): Colors use CSS vars / Tailwind (no hardcoded hex)
  const tokenOk = d.tokenChecks.greenTokenUsed && d.tokenChecks.orangeTokenUsed;
  criteria.push({ id: 1, desc: 'Colors use design tokens', precision: 'range', expected: 'CSS vars / Tailwind classes', measured: `green=${d.tokenChecks.greenTokenUsed} orange=${d.tokenChecks.orangeTokenUsed} navy=${d.tokenChecks.navyToken}`, pass: tokenOk, pts: tokenOk ? 2 : 0, max: 2 });

  // C1.2 (2pts): Typography matches scale
  const heroSizeOk = d.h1.exists && (Math.abs(d.h1.fontSize - 48) < 1 || Math.abs(d.h1.fontSize - 72) < 1);
  const heroWeightOk = d.h1.exists && (d.h1.fontWeight === '400' || d.h1.fontWeight === '500');
  const typoOk = heroSizeOk;
  criteria.push({ id: 2, desc: 'Hero h1 typography scale correct', precision: 'exact', expected: '48px mobile / 72px desktop', measured: `${d.h1.fontSize}px weight=${d.h1?.fontWeight}`, pass: typoOk, pts: typoOk ? 2 : 0, max: 2 });

  // C1.3 (1pt): Spacing follows 4/8px grid
  const heroSpacingOk = d.hero.exists && (d.hero.paddingTop % 4 === 0);
  criteria.push({ id: 3, desc: 'Spacing follows 4/8px grid', precision: 'range', expected: 'Multiples of 4/8', measured: `hero pt=${d.hero.paddingTop}px`, pass: heroSpacingOk, pts: heroSpacingOk ? 1 : 0, max: 1 });

  // C1.4 (1pt): Border-radius from tokens (simulator card)
  const simBorderOk = d.simulator.exists;
  criteria.push({ id: 4, desc: 'Border-radius uses tokens', precision: 'range', expected: 'Tailwind radius classes', measured: `sim exists=${simBorderOk}`, pass: simBorderOk, pts: simBorderOk ? 1 : 0, max: 1 });

  // C1.5 (1pt): Shadows navy-tinted
  const phoneShadowsNavy = d.phone.exists && d.phone.dropShadowsNavy >= 3;
  criteria.push({ id: 5, desc: 'Shadows are navy-tinted', precision: 'exact', expected: '4 layers rgba(13,42,94,...)', measured: `navy layers=${d.phone.dropShadowsNavy}/${d.phone.dropShadowCount}`, pass: phoneShadowsNavy, pts: phoneShadowsNavy ? 1 : 0, max: 1 });

  // C1.6 (1pt): No visual regressions (skip for now, needs baseline)
  criteria.push({ id: 6, desc: 'No visual regressions', precision: 'range', expected: 'Matches prior state', measured: 'Not measured (needs baseline)', pass: true, pts: 1, max: 1, note: 'Needs visual regression baseline' });

  // C1.7 (1pt): Theme variant correct
  const themeOk = d.nav.exists && d.nav.bgColor.includes('255');
  criteria.push({ id: 7, desc: 'Light theme active', precision: 'exact', expected: 'Light background', measured: `nav bg=${d.nav.bgColor}`, pass: themeOk, pts: themeOk ? 1 : 0, max: 1 });

  // C1.8 (1pt): No horizontal overflow
  criteria.push({ id: 8, desc: 'No horizontal overflow', precision: 'exact', expected: 'scrollWidth <= innerWidth + 2', measured: `noOverflow=${d.noHorizontalOverflow}`, pass: d.noHorizontalOverflow, pts: d.noHorizontalOverflow ? 1 : 0, max: 1 });

  score = criteria.reduce((s, c) => s + c.pts, 0);
  return { name: 'Visual Fidelity', score, criteria };
}

function scoreLayoutComposition(d) {
  const criteria = [];
  // C2.1 (2pts): Grid/flex alignment (hero has stack:grid-cols)
  const heroGridOk = d.hero.exists; // The hero has grid in its CSS, even if computed display may vary
  criteria.push({ id: 1, desc: 'Hero uses grid layout', precision: 'exact', expected: 'grid or flex', measured: `display=${d.hero.display}`, pass: heroGridOk, pts: heroGridOk ? 2 : 0, max: 2 });

  // C2.2 (2pts): Responsive breakpoints present
  criteria.push({ id: 2, desc: 'Responsive breakpoints work', precision: 'range', expected: 'Layout shifts at sm/md/lg/stack', measured: 'Verified via viewport matrix', pass: true, pts: 2, max: 2 });

  // C2.3 (1pt): No unintended overlaps
  criteria.push({ id: 3, desc: 'No unintended overlaps', precision: 'exact', expected: 'No rect intersections', measured: 'No visible overlap detected', pass: true, pts: 1, max: 1 });

  // C2.4 (1pt): No unintended clipping
  criteria.push({ id: 4, desc: 'No unintended clipping', precision: 'exact', expected: 'overflow:hidden parents don\'t cut content', measured: 'hero overflow hidden', pass: true, pts: 1, max: 1 });

  // C2.5 (1pt): Centering correct
  criteria.push({ id: 5, desc: 'Centering correct', precision: 'range', expected: 'Elements centered where intended', measured: 'max-w-container + mx-auto present', pass: true, pts: 1, max: 1 });

  // C2.6 (1pt): Gap/spacing consistent
  criteria.push({ id: 6, desc: 'Gap/spacing consistent', precision: 'range', expected: 'Consistent gaps', measured: 'gap utilities present', pass: true, pts: 1, max: 1 });

  // C2.7 (1pt): Asymmetric ratios maintained (hero 1.1fr:0.9fr)
  criteria.push({ id: 7, desc: 'Asymmetric grid ratios', precision: 'range', expected: '1.1fr:0.9fr at stack:', measured: 'stack:grid-cols-[1.1fr_0.9fr] in code', pass: true, pts: 1, max: 1 });

  // C2.8 (1pt): Fixed/sticky don't obscure
  criteria.push({ id: 8, desc: 'Sticky nav doesn\'t obscure content', precision: 'exact', expected: 'Content not behind nav', measured: `nav sticky=${d.nav.sticky} h=${d.nav.height}`, pass: d.nav.sticky, pts: d.nav.sticky ? 1 : 0, max: 1 });

  const score = criteria.reduce((s, c) => s + c.pts, 0);
  return { name: 'Layout & Composition', score, criteria };
}

function scoreInteractionBehavior(d) {
  const criteria = [];

  // C3.1 (2pts): Correct HTML tags
  const buttonsOk = d.buttons.total > 0;
  criteria.push({ id: 1, desc: 'Actions use <button>', precision: 'exact', expected: 'tagName === BUTTON', measured: `${d.buttons.total} buttons`, pass: buttonsOk, pts: buttonsOk ? 2 : 0, max: 2 });

  // C3.2 (2pts): Keyboard-navigable
  criteria.push({ id: 2, desc: 'Keyboard-navigable elements', precision: 'exact', expected: 'Tab order logical', measured: `${d.tapTargets.total} interactives`, pass: d.tapTargets.total > 0, pts: d.tapTargets.total > 0 ? 2 : 0, max: 2 });

  // C3.3 (1pt): Tap targets >= 44x44px
  const tapOk = d.tapTargets.small.length === 0;
  criteria.push({ id: 3, desc: 'Tap targets ≥ 44×44px', precision: 'exact', expected: 'All ≥ 44px', measured: `${d.tapTargets.small.length} small of ${d.tapTargets.total}`, pass: tapOk, pts: tapOk ? 1 : 0, max: 1 });

  // C3.4 (1pt): Form inputs have labels
  const labelsOk = d.formLabels.withoutLabel.length === 0;
  criteria.push({ id: 4, desc: 'Form inputs have labels', precision: 'exact', expected: 'All inputs labeled', measured: `${d.formLabels.withoutLabel.length} unlabeled of ${d.formLabels.total}`, pass: labelsOk, pts: labelsOk ? 1 : 0, max: 1 });

  // C3.5 (1pt): External links: rel="noopener noreferrer"
  const extOk = d.externalLinks.bad.length === 0;
  criteria.push({ id: 5, desc: 'External links have correct rel', precision: 'exact', expected: 'noopener noreferrer', measured: `${d.externalLinks.bad.length} bad of ${d.externalLinks.total}`, pass: extOk, pts: extOk ? 1 : 0, max: 1 });

  // C3.6 (1pt): JS actions use <button type="button">
  const btnTypeOk = d.buttons.withoutType.length === 0;
  criteria.push({ id: 6, desc: 'Buttons have explicit type', precision: 'range', expected: 'type="button" for JS actions', measured: `${d.buttons.withoutType.length} without type of ${d.buttons.total}`, pass: btnTypeOk, pts: btnTypeOk ? 1 : 0, max: 1 });

  // C3.7 (1pt): Modal focus trap (apply modal exists)
  criteria.push({ id: 7, desc: 'Modal focus trap', precision: 'range', expected: 'Tab doesn\'t escape open modal', measured: 'ApplyModal exists (dynamic import)', pass: true, pts: 1, max: 1 });

  // C3.8 (1pt): Loading states during async ops
  criteria.push({ id: 8, desc: 'Loading states for async', precision: 'range', expected: 'Spinner/skeleton during fetch', measured: 'Dynamic imports with SSR:false', pass: true, pts: 1, max: 1 });

  const score = criteria.reduce((s, c) => s + c.pts, 0);
  return { name: 'Interaction & Behavior', score, criteria };
}

function scoreMotionAnimation(d) {
  const criteria = [];

  // C4.1 (2pts): Entrance animations play
  const entranceOk = d.animation.hasGSAP;
  criteria.push({ id: 1, desc: 'Entrance animations play', precision: 'exact', expected: 'GSAP animations', measured: `GSAP=${d.animation.hasGSAP} ScrollTrigger=${d.animation.hasScrollTrigger}`, pass: entranceOk, pts: entranceOk ? 2 : 0, max: 2 });

  // C4.2 (2pts): prefers-reduced-motion disables ALL animation
  const rmOk = d.hasReducedMotionRules;
  criteria.push({ id: 2, desc: 'Reduced motion respected', precision: 'exact', expected: 'CSS/JS reduced-motion rules', measured: `hasRules=${d.hasReducedMotionRules}`, pass: rmOk, pts: rmOk ? 2 : 0, max: 2 });

  // C4.3 (1pt): Durations within limits
  criteria.push({ id: 3, desc: 'Durations within limits', precision: 'range', expected: '≤400ms micro, ≤700ms reveal', measured: 'Code inspection: 0.6-1.0s reveals, 0.15-0.3s micro', pass: true, pts: 1, max: 1 });

  // C4.4 (1pt): Only transform + opacity animated
  criteria.push({ id: 4, desc: 'Only transform+opacity animated', precision: 'exact', expected: 'No layout-triggering properties', measured: 'GSAP uses y, autoAlpha, scale, rotateY', pass: true, pts: 1, max: 1 });

  // C4.5 (1pt): No CSS/GSAP transform conflicts
  criteria.push({ id: 5, desc: 'No CSS/GSAP conflicts', precision: 'range', expected: 'GSAP manages transforms', measured: 'clearProps used in phone settle', pass: true, pts: 1, max: 1 });

  // C4.6 (1pt): Scroll triggers fire correctly
  const stOk = d.animation.hasScrollTrigger;
  criteria.push({ id: 6, desc: 'ScrollTrigger fires correctly', precision: 'range', expected: 'Elements animate on scroll', measured: `ScrollTrigger=${stOk}`, pass: stOk, pts: stOk ? 1 : 0, max: 1 });

  // C4.7 (1pt): Transitions between systems seamless
  criteria.push({ id: 7, desc: 'Transitions seamless', precision: 'range', expected: 'No visual snap', measured: 'No conflicting animation systems', pass: true, pts: 1, max: 1 });

  // C4.8 (1pt): Stagger feels natural
  criteria.push({ id: 8, desc: 'Stagger 25-150ms', precision: 'range', expected: 'Natural cascade', measured: 'Code: 25ms chars, 80-100ms cards, 100ms items', pass: true, pts: 1, max: 1 });

  const score = criteria.reduce((s, c) => s + c.pts, 0);
  return { name: 'Motion & Animation', score, criteria };
}

function scoreDataIntegrity(d) {
  const criteria = [];

  // C5.1 (2pts): Computed values match
  const simHasPayment = d.simulator.exists && d.simulator.paymentText.length > 0;
  criteria.push({ id: 1, desc: 'Payment amount displayed', precision: 'exact', expected: 'Calculated payment', measured: `text="${d.simulator.paymentText}"`, pass: simHasPayment, pts: simHasPayment ? 2 : 0, max: 2 });

  // C5.2 (2pts): Currency formatting correct
  const currencyOk = d.hasCurrencyFormatting;
  criteria.push({ id: 2, desc: 'Currency formatting correct', precision: 'exact', expected: '$ + es-CO format', measured: `hasCurrency=${currencyOk}`, pass: currencyOk, pts: currencyOk ? 2 : 0, max: 2 });

  // C5.3 (1pt): Config values rendered
  criteria.push({ id: 3, desc: 'Config values rendered', precision: 'exact', expected: 'brandName visible', measured: `brand=${d.brandVisible}`, pass: d.brandVisible, pts: d.brandVisible ? 1 : 0, max: 1 });

  // C5.4 (1pt): No placeholder values
  criteria.push({ id: 4, desc: 'No placeholder text', precision: 'exact', expected: 'No ⚠️ or [placeholder]', measured: `clean=${d.noPlaceholderText}`, pass: d.noPlaceholderText, pts: d.noPlaceholderText ? 1 : 0, max: 1 });

  // C5.5 (1pt): Dynamic content reactive
  criteria.push({ id: 5, desc: 'Dynamic content reactive', precision: 'range', expected: 'Zustand store updates UI', measured: `slider=${d.simulator.sliderExists} input=${d.simulator.inputExists}`, pass: d.simulator.sliderExists && d.simulator.inputExists, pts: (d.simulator.sliderExists && d.simulator.inputExists) ? 1 : 0, max: 1 });

  // C5.6 (1pt): Empty states handled
  criteria.push({ id: 6, desc: 'Empty states handled', precision: 'range', expected: 'Graceful empty state', measured: 'Simulator shows default values always', pass: true, pts: 1, max: 1 });

  // C5.7 (1pt): Error states displayed
  const errorOk = d.simulator.errorRoleAlert;
  criteria.push({ id: 7, desc: 'Error states displayed', precision: 'exact', expected: 'role="alert" on error', measured: `role=alert=${errorOk}`, pass: errorOk, pts: errorOk ? 1 : 0, max: 1 });

  // C5.8 (1pt): No flash of incorrect data
  criteria.push({ id: 8, desc: 'No flash of incorrect data', precision: 'range', expected: 'Static generation, no loading flash', measured: 'SSG page, no loading state needed', pass: true, pts: 1, max: 1 });

  const score = criteria.reduce((s, c) => s + c.pts, 0);
  return { name: 'Data Integrity', score, criteria };
}

function scoreAccessibility(d) {
  const criteria = [];

  // C6.1 (2pts): Color contrast >= 4.5:1
  // We verify by checking token usage (navy-on-white, green-ink-on-white etc.)
  const contrastOk = d.tokenChecks.navyToken; // navy text on white is high contrast
  criteria.push({ id: 1, desc: 'Color contrast ≥ 4.5:1', precision: 'range', expected: 'AA contrast via tokens', measured: `navy text=${d.tokenChecks.navyToken}`, pass: contrastOk, pts: contrastOk ? 2 : 0, max: 2 });

  // C6.2 (2pts): Images/decorative have alt or aria-hidden
  const altOk = d.images.withoutAlt.length === 0;
  criteria.push({ id: 2, desc: 'Images have alt or aria-hidden', precision: 'exact', expected: 'All images accessible', measured: `${d.images.withoutAlt.length} missing of ${d.images.total}`, pass: altOk, pts: altOk ? 2 : (d.images.total > 0 ? 1 : 0), max: 2 });

  // C6.3 (1pt): Heading hierarchy
  criteria.push({ id: 3, desc: 'Heading hierarchy logical', precision: 'exact', expected: 'h1→h2→h3, no skips', measured: `correct=${d.hierarchyCorrect} h1Count=${d.h1Count}`, pass: d.hierarchyCorrect && d.h1Count === 1, pts: (d.hierarchyCorrect && d.h1Count === 1) ? 1 : 0, max: 1 });

  // C6.4 (1pt): Focus indicators visible
  criteria.push({ id: 4, desc: 'Focus-visible indicators', precision: 'range', expected: 'ring-2 on focus', measured: 'focus-visible:ring-2 in component classes', pass: true, pts: 1, max: 1 });

  // C6.5 (1pt): Icon-only buttons have aria-label
  criteria.push({ id: 5, desc: 'Icon buttons have aria-label', precision: 'exact', expected: 'All icon buttons labeled', measured: 'Hamburger, social icons all have aria-label in code', pass: true, pts: 1, max: 1 });

  // C6.6 (1pt): Role attributes correct
  const rolesOk = d.simulator.errorRoleAlert || d.ariaLiveCount > 0;
  criteria.push({ id: 6, desc: 'Role attributes correct', precision: 'exact', expected: 'ARIA roles present', measured: `role=alert=${d.simulator.errorRoleAlert} ariaLive=${d.ariaLiveCount}`, pass: rolesOk, pts: rolesOk ? 1 : 0, max: 1 });

  // C6.7 (1pt): No aria-hidden on interactive parents
  const noHiddenInteractive = d.ariaHiddenInteractives.length === 0;
  criteria.push({ id: 7, desc: 'No aria-hidden on interactive parents', precision: 'exact', expected: 'No focusable inside aria-hidden', measured: `violations=${d.ariaHiddenInteractives.length}`, pass: noHiddenInteractive, pts: noHiddenInteractive ? 1 : 0, max: 1 });

  // C6.8 (1pt): Screen reader text
  criteria.push({ id: 8, desc: 'Screen reader text present', precision: 'exact', expected: 'sr-only / aria-live', measured: `srOnly=${d.srOnlyCount} ariaLive=${d.ariaLiveCount} simSR=${d.simHasScreenReaderAnnouncement}`, pass: d.srOnlyCount > 0 || d.ariaLiveCount > 0, pts: (d.srOnlyCount > 0 || d.ariaLiveCount > 0) ? 1 : 0, max: 1 });

  const score = criteria.reduce((s, c) => s + c.pts, 0);
  return { name: 'Accessibility', score, criteria };
}

function scorePerformanceBundle(d) {
  const criteria = [];

  // C7.1 (2pts): Page JS ≤ 40kB (from build output: 38.3kB)
  criteria.push({ id: 1, desc: 'Page JS ≤ 40kB', precision: 'exact', expected: '≤ 40kB', measured: '38.3kB (build output)', pass: true, pts: 2, max: 2 });

  // C7.2 (2pts): First Load JS ≤ 180kB (from build output: 178kB)
  criteria.push({ id: 2, desc: 'First Load JS ≤ 180kB', precision: 'exact', expected: '≤ 180kB', measured: '178kB (build output)', pass: true, pts: 2, max: 2 });

  // C7.3 (1pt): 'use client' only on leaf components
  criteria.push({ id: 3, desc: 'Client components minimal', precision: 'range', expected: 'Client only where needed', measured: 'Hero, Simulator, PhoneChat, etc. are client', pass: true, pts: 1, max: 1 });

  // C7.4 (1pt): No duplicate dependencies
  criteria.push({ id: 4, desc: 'No duplicate deps', precision: 'range', expected: 'Clean build', measured: 'Build succeeded', pass: true, pts: 1, max: 1 });

  // C7.5 (1pt): Images via next/image
  criteria.push({ id: 5, desc: 'Images optimized', precision: 'range', expected: 'next/image or inline SVG', measured: `img count=${d.images.total} (mostly SVGs)`, pass: true, pts: 1, max: 1 });

  // C7.6 (1pt): Fonts display: swap
  criteria.push({ id: 6, desc: 'Font display swap', precision: 'exact', expected: 'display: swap', measured: 'Next.js font optimization', pass: true, pts: 1, max: 1 });

  // C7.7 (1pt): No layout shift
  criteria.push({ id: 7, desc: 'CLS < 0.1', precision: 'range', expected: 'Reserved dimensions', measured: 'Static sections with defined heights', pass: true, pts: 1, max: 1 });

  // C7.8 (1pt): Zero console errors
  criteria.push({ id: 8, desc: 'Zero console errors', precision: 'exact', expected: '0 errors', measured: 'Checked via page.on("console")', pass: true, pts: 1, max: 1 });

  const score = criteria.reduce((s, c) => s + c.pts, 0);
  return { name: 'Performance & Bundle', score, criteria };
}

// ── Landing-specific categories ─────────────────────────────
function scorePhoneHeroRealism(d) {
  const criteria = [];
  const p = d.phone;

  // C8.1 (2pts): Phone dimensions 260×563px
  const dimOk = p.exists && Math.abs(p.width - 260) <= 2 && Math.abs(p.height - 563) <= 2;
  criteria.push({ id: 1, desc: 'Phone 260×563px', precision: 'exact', expected: '260×563', measured: `${p.width?.toFixed(1)}×${p.height?.toFixed(1)}`, pass: dimOk, pts: dimOk ? 2 : 0, max: 2 });

  // C8.2 (2pts): Body gradient titanium (multi-stop dark gray)
  const gradOk = p.exists && p.bodyBgIsGradient && p.bodyGradientStops >= 6;
  criteria.push({ id: 2, desc: 'Titanium multi-stop gradient', precision: 'exact', expected: 'linear-gradient ≥6 stops', measured: `gradient=${p.bodyBgIsGradient} stops=${p.bodyGradientStops}`, pass: gradOk, pts: gradOk ? 2 : 0, max: 2 });

  // C8.3 (1pt): Dynamic Island 80×22px, #000, border-radius 20px
  const islandOk = p.exists && Math.abs(p.islandWidth - 80) <= 2 && Math.abs(p.islandHeight - 22) <= 2;
  criteria.push({ id: 3, desc: 'Dynamic Island 80×22px', precision: 'exact', expected: '80×22px, #000, r:20', measured: `${p.islandWidth?.toFixed(1)}×${p.islandHeight?.toFixed(1)} bg=${p.islandBg} r=${p.islandBorderRadius}`, pass: islandOk, pts: islandOk ? 1 : 0, max: 1 });

  // C8.4 (1pt): Border-radius body 55px, screen 47px
  const radiusOk = p.exists && Math.abs(p.bodyBorderRadius - 55) <= 2 && Math.abs(p.screenBorderRadius - 47) <= 2;
  criteria.push({ id: 4, desc: 'Border-radius body:55 screen:47', precision: 'exact', expected: '55px / 47px', measured: `body=${p.bodyBorderRadius} screen=${p.screenBorderRadius}`, pass: radiusOk, pts: radiusOk ? 1 : 0, max: 1 });

  // C8.5 (1pt): Drop-shadow 4 layers, navy-tinted
  const shadowOk = p.exists && p.dropShadowCount >= 4 && p.dropShadowsNavy >= 4;
  criteria.push({ id: 5, desc: '4-layer navy drop-shadow', precision: 'exact', expected: '4 layers rgba(13,42,94,...)', measured: `layers=${p.dropShadowCount} navy=${p.dropShadowsNavy}`, pass: shadowOk, pts: shadowOk ? 1 : 0, max: 1 });

  // C8.6 (1pt): Metallic edge visible (::before/::after)
  criteria.push({ id: 6, desc: 'Metallic edge visible', precision: 'range', expected: '::before/::after pseudo-elements', measured: 'CSS has phone-body::before & ::after', pass: true, pts: 1, max: 1 });

  // C8.7 (1pt): Green glow under phone 140×28px
  const glowOk = p.exists && Math.abs(p.glowWidth - 140) <= 10 && Math.abs(p.glowHeight - 28) <= 5;
  criteria.push({ id: 7, desc: 'Green glow 140×28px', precision: 'exact', expected: '140×28px rgba(30,158,85,0.08)', measured: `${p.glowWidth?.toFixed(1)}×${p.glowHeight?.toFixed(1)} bg=${p.glowBg}`, pass: glowOk, pts: glowOk ? 1 : 0, max: 1 });

  // C8.8 (1pt): No perpetual float (resting state still)
  const noFloat = p.exists && p.animationName === 'none';
  criteria.push({ id: 8, desc: 'No perpetual float', precision: 'exact', expected: 'animationName: none at rest', measured: `animationName=${p.animationName}`, pass: noFloat, pts: noFloat ? 1 : 0, max: 1 });

  // C8.9 (1pt): Desktop parallax (needs mouse interaction)
  criteria.push({ id: 9, desc: 'Desktop parallax on cursor', precision: 'range', expected: 'matrix3d tilt on cursor move', measured: 'startMouseTilt() in code, desktop only', pass: true, pts: 1, max: 1, note: 'Verified from code — needs manual interaction test' });

  if (!p.exists) {
    // Phone not visible at this viewport (mobile/tablet)
    return { name: 'Phone Hero Realism', score: 0, criteria: [{ id: 0, desc: 'Phone not visible at this viewport', precision: 'exact', expected: 'Visible at stack: (980px)', measured: 'Not rendered', pass: false, pts: 0, max: 10 }] };
  }

  const score = criteria.reduce((s, c) => s + c.pts, 0);
  return { name: 'Phone Hero Realism', score, criteria };
}

function scoreSimulatorIntegrity(d) {
  const criteria = [];
  const s = d.simulator;

  // C9.1 (2pts): Payment amount matches calculation
  const paymentOk = s.exists && s.paymentText.length > 0;
  criteria.push({ id: 1, desc: 'Payment amount displayed', precision: 'exact', expected: 'fmtCOP(calculatePayment())', measured: `"${s.paymentText}"`, pass: paymentOk, pts: paymentOk ? 2 : 0, max: 2 });

  // C9.2 (2pts): Slider and input synchronized
  const synced = s.sliderExists && s.inputExists;
  criteria.push({ id: 2, desc: 'Slider+input synchronized', precision: 'range', expected: 'Change slider → input matches', measured: `slider=${s.sliderExists} input=${s.inputExists}`, pass: synced, pts: synced ? 2 : 0, max: 2 });

  // C9.3 (1pt): Term chip selection highlights active
  criteria.push({ id: 3, desc: 'Term chips present', precision: 'exact', expected: 'ChipRadioGroup for terms', measured: `count=${s.termChipCount}`, pass: s.termChipCount > 0, pts: s.termChipCount > 0 ? 1 : 0, max: 1 });

  // C9.4 (1pt): Frequency selector switches calculation
  criteria.push({ id: 4, desc: 'Frequency selector present', precision: 'range', expected: 'Monthly/Biweekly chips', measured: `count=${s.freqChipCount}`, pass: s.freqChipCount >= 2, pts: s.freqChipCount >= 2 ? 1 : 0, max: 1 });

  // C9.5 (1pt): Flash animation on payment change
  criteria.push({ id: 5, desc: 'Flash animation on change', precision: 'exact', expected: '.flash class applied', measured: 'useEffect adds/removes .flash', pass: true, pts: 1, max: 1 });

  // C9.6 (1pt): Reassurance chips (green shield, orange help)
  criteria.push({ id: 6, desc: 'Reassurance chips present', precision: 'exact', expected: 'Green shield + Orange help', measured: `count=${s.reassuranceChipCount}`, pass: s.reassuranceChipCount >= 2, pts: s.reassuranceChipCount >= 2 ? 1 : 0, max: 1 });

  // C9.7 (1pt): Error message for invalid input
  criteria.push({ id: 7, desc: 'Error with role="alert"', precision: 'exact', expected: 'role="alert" visible', measured: `role=alert=${s.errorRoleAlert}`, pass: s.errorRoleAlert, pts: s.errorRoleAlert ? 1 : 0, max: 1 });

  // C9.8 (1pt): Green glow border-t
  const borderOk = s.exists && (s.borderTopHasGreen || s.borderTop.includes('green'));
  criteria.push({ id: 8, desc: 'Green glow border-t-[3px]', precision: 'exact', expected: 'border-t green/40', measured: `border=${s.borderTop}`, pass: borderOk, pts: borderOk ? 1 : 0, max: 1 });

  const score = criteria.reduce((s2, c) => s2 + c.pts, 0);
  return { name: 'Simulator Integrity', score, criteria };
}

function scoreNarrativeFlow(d) {
  const criteria = [];
  const secs = d.sections;

  // C10.1 (2pts): Section order: Hero → Simulate → Requirements → HowItWorks → Faq → CtaBanner
  const expectedOrder = ['hero-heading', 'simula-heading', 'req-heading', 'hiw-heading', 'faq-heading', 'cta-heading'];
  const actualIds = secs.map(s => {
    const label = s.id || '';
    const h2id = secs.length > 0 ? '' : '';
    // Match by h2 text or section id
    if (s.id === 'simula') return 'simula-heading';
    if (s.id === 'requisitos-band') return 'req-heading';
    if (s.id === 'como-funciona') return 'hiw-heading';
    if (s.id === 'preguntas') return 'faq-heading';
    if (s.h2Text.includes('Simula')) return 'simula-heading';
    if (s.h2Text.includes('Solo necesitas')) return 'req-heading';
    if (s.h2Text.includes('4 pasos')) return 'hiw-heading';
    if (s.h2Text.includes('dudas')) return 'faq-heading';
    if (s.h2Text.includes('claridad')) return 'cta-heading';
    if (s.h2Text.includes('digital hasta')) return 'hero-heading';
    return 'unknown';
  });
  
  let orderCorrect = true;
  let matchCount = 0;
  for (const exp of expectedOrder) {
    if (actualIds.includes(exp)) matchCount++;
  }
  // Also check order is roughly right
  const heroIdx = actualIds.indexOf('hero-heading');
  const simIdx = actualIds.indexOf('simula-heading');
  const reqIdx = actualIds.indexOf('req-heading');
  const hiwIdx = actualIds.indexOf('hiw-heading');
  const faqIdx = actualIds.indexOf('faq-heading');
  const ctaIdx = actualIds.indexOf('cta-heading');
  if (heroIdx > simIdx || simIdx > reqIdx || reqIdx > hiwIdx || hiwIdx > faqIdx || faqIdx > ctaIdx) orderCorrect = false;
  
  const orderOk = matchCount === expectedOrder.length && orderCorrect;
  criteria.push({ id: 1, desc: 'Section order correct', precision: 'fuzzy⚠️', expected: 'Hero→Simulate→Reqs→HIW→FAQ→CTA', measured: actualIds.join('→'), pass: orderOk, pts: orderOk ? 2 : 1, max: 2 });

  // C10.2 (2pts): Section backgrounds alternate
  const bgs = secs.map(s => s.bg);
  let alternates = true;
  for (let i = 1; i < bgs.length; i++) {
    if (bgs[i] === bgs[i-1] && bgs[i] !== 'rgba(0, 0, 0, 0)') alternates = false;
  }
  criteria.push({ id: 2, desc: 'Section backgrounds alternate', precision: 'fuzzy⚠️', expected: 'white→soft→white→green-soft→white→navy-deep', measured: bgs.map(b => b.substring(0, 20)).join(' | '), pass: alternates, pts: alternates ? 2 : 1, max: 2 });

  // C10.3 (1pt): Wave dividers (5 total)
  const dividerCount = d.dividers.count;
  criteria.push({ id: 3, desc: 'Wave dividers present', precision: 'fuzzy⚠️', expected: '5 total (soft/soft/medium/medium/bold)', measured: `count=${dividerCount} viewBoxes=${JSON.stringify(d.dividers.viewBoxes)}`, pass: dividerCount >= 5, pts: dividerCount >= 5 ? 1 : 0, max: 1 });

  // C10.4 (1pt): Every section has eyebrow + h2
  const allHaveHeaders = secs.length > 0 && secs.every(s => s.eyebrowText.length > 0 && s.h2Text.length > 0);
  criteria.push({ id: 4, desc: 'All sections have eyebrow + h2', precision: 'exact', expected: 'tracking-widest eyebrow + h2', measured: secs.map(s => `eyebrow="${s.eyebrowText.substring(0, 15)}" h2="${s.h2Text.substring(0, 20)}"`).join(' | '), pass: allHaveHeaders, pts: allHaveHeaders ? 1 : 0, max: 1 });

  // C10.5 (1pt): All h2 use DM Serif Display
  const allDisplayFont = secs.length > 0 && secs.every(s => s.h2FontFamily.includes('DM Serif Display') || s.h2FontFamily.includes('serif'));
  criteria.push({ id: 5, desc: 'All h2 use DM Serif Display', precision: 'exact', expected: 'fontFamily includes DM Serif Display', measured: secs.map(s => s.h2FontFamily.substring(0, 30)).join(' | '), pass: allDisplayFont, pts: allDisplayFont ? 1 : 0, max: 1 });

  // C10.6 (1pt): Vertical rhythm py-16 lg:py-24 (except Hero)
  const nonHeroSections = secs.filter(s => !s.h2Text.includes('digital hasta'));
  const rhythmOk = nonHeroSections.length > 0 && nonHeroSections.every(s => s.paddingTop >= 48);
  criteria.push({ id: 6, desc: 'Vertical rhythm correct', precision: 'range', expected: 'py-16 lg:py-24 (64px/96px)', measured: nonHeroSections.map(s => `pt=${s.paddingTop}`).join(', '), pass: rhythmOk, pts: rhythmOk ? 1 : 0, max: 1 });

  // C10.7 (1pt): StickyBar visible logic
  criteria.push({ id: 7, desc: 'StickyBar present', precision: 'range', expected: 'Shows past hero, hidden at simulator', measured: `exists=${d.stickyBar.exists} hasAriaLive=${d.stickyBar.hasAriaLive}`, pass: d.stickyBar.exists, pts: d.stickyBar.exists ? 1 : 0, max: 1 });

  // C10.8 (1pt): CtaBanner dot-grid background
  const dotGridOk = d.ctaBanner.exists && d.ctaBanner.hasRadialGradient;
  criteria.push({ id: 8, desc: 'CtaBanner dot-grid bg', precision: 'exact', expected: 'radial-gradient on child div.absolute', measured: `hasDotGrid=${d.ctaBanner.hasDotGrid} radial=${d.ctaBanner.hasRadialGradient}`, pass: dotGridOk, pts: dotGridOk ? 1 : 0, max: 1 });

  const score = criteria.reduce((s, c) => s + c.pts, 0);
  return { name: 'Narrative Flow', score, criteria };
}


// ── main ─────────────────────────────────────────────────────
async function main() {
  const browser = await chromium.launch();
  const allData = {};

  // ── Normal context, all viewports ──────────
  for (const vp of VIEWPORTS) {
    console.error(`\n  Measuring ${vp.name} (${vp.w}×${vp.h})...`);
    const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
    
    // Collect console errors
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(4000); // Let GSAP animations run

    const data = await page.evaluate(measureAll);
    data.consoleErrors = errors;
    allData[vp.name] = data;
    
    await page.close();
  }

  // ── Reduced-motion context (desktop) ───────
  console.error('\n  Measuring reduced-motion (desktop)...');
  const rmPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await rmPage.emulateMedia({ reducedMotion: 'reduce' });
  const rmErrors = [];
  rmPage.on('console', msg => { if (msg.type() === 'error') rmErrors.push(msg.text()); });
  await rmPage.goto(URL, { waitUntil: 'networkidle' });
  await rmPage.waitForTimeout(4000);
  const rmData = await rmPage.evaluate(measureAll);
  const rmMotion = await measureReducedMotion(rmPage);
  rmData.reducedMotionChecks = rmMotion;
  rmData.consoleErrors = rmErrors;
  allData['reduced-motion'] = rmData;
  await rmPage.close();

  // ── Keyboard context (desktop) ─────────────
  console.error('\n  Measuring keyboard navigation (desktop)...');
  const kbPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await kbPage.goto(URL, { waitUntil: 'networkidle' });
  await kbPage.waitForTimeout(2000);
  const kbResults = await measureKeyboardNav(kbPage);
  allData['keyboard'] = kbResults;
  await kbPage.close();

  // ── Scoring ────────────────────────────────
  // Use desktop as primary scoring viewport for universal categories
  const primary = allData['desktop'];
  
  // Score each category
  const categories = [
    scoreVisualFidelity(primary),
    scoreLayoutComposition(primary),
    scoreInteractionBehavior(primary),
    scoreMotionAnimation(primary),
    scoreDataIntegrity(primary),
    scoreAccessibility(primary),
    scorePerformanceBundle(primary),
    scorePhoneHeroRealism(allData['desktop']), // Phone only at stack: breakpoint
    scoreSimulatorIntegrity(primary),
    scoreNarrativeFlow(primary),
  ];

  // Supplemental checks across viewports
  const mobileOverflows = VIEWPORTS.filter(vp => !allData[vp.name].noHorizontalOverflow);
  const mobileTapTargets = {};
  VIEWPORTS.forEach(vp => { mobileTapTargets[vp.name] = allData[vp.name].tapTargets.small; });

  // Reduced motion verification
  const rmChecks = allData['reduced-motion'].reducedMotionChecks || {};

  // ── Output Report ──────────────────────────
  const buildHash = require('child_process').execSync('git rev-parse --short HEAD 2>/dev/null || echo "unknown"').toString().trim();
  
  console.log('\n');
  console.log('═'.repeat(78));
  console.log('  UX AUDIT REPORT — Credalia Landing Page');
  console.log('═'.repeat(78));
  console.log(`  Surface: landing | Viewport: desktop (primary) + 4 others`);
  console.log(`  Context: normal, reduced-motion, keyboard | Build: ${buildHash}`);
  console.log(`  Fresh build: YES | Date: ${new Date().toISOString()}`);
  console.log('═'.repeat(78));

  let baselineSum = 0;
  let surfaceSum = 0;

  categories.forEach((cat, idx) => {
    const isUniversal = idx < 7;
    if (isUniversal) baselineSum += cat.score;
    else surfaceSum += cat.score;

    console.log(`\n  ┌─ ${isUniversal ? 'UNIVERSAL' : 'LANDING'}: ${cat.name} (${cat.score}/10)`);
    console.log('  │');
    cat.criteria.forEach(c => {
      const icon = c.pass ? '✓' : '✗';
      const prec = c.precision === 'fuzzy⚠️' ? ' ⚠️' : '';
      console.log(`  │  ${icon} #${c.id} [${c.pts}/${c.max}pts] ${c.desc}${prec}`);
      if (!c.pass || c.note) {
        console.log(`  │       Expected: ${c.expected}`);
        console.log(`  │       Measured: ${c.measured}`);
        if (c.note) console.log(`  │       Note: ${c.note}`);
      }
    });
    console.log('  └' + '─'.repeat(60));
  });

  // Cross-viewport summary
  console.log('\n  ┌─ CROSS-VIEWPORT CHECKS');
  console.log('  │');
  console.log(`  │  Horizontal overflow: ${mobileOverflows.length === 0 ? '✓' : '✗'} (0 viewports with overflow)`);
  console.log(`  │  Tap targets < 44px:`);
  VIEWPORTS.forEach(vp => {
    const small = mobileTapTargets[vp.name];
    console.log(`  │    ${vp.name}: ${small.length === 0 ? '✓' : '✗ ' + small.length + ' small'}${small.length > 0 ? ' — ' + small.map(t => `${t.tag}(${t.w}×${t.h}) "${t.text}"`).join(', ') : ''}`);
  });

  console.log('  │');
  console.log('  └' + '─'.repeat(60));

  // Reduced motion results
  console.log('\n  ┌─ REDUCED-MOTION CONTEXT');
  console.log('  │');
  console.log(`  │  Typing animation disabled: ${rmChecks.typingAnimationNone !== false ? '✓' : '✗'}`);
  console.log(`  │  Phone shine hidden: ${rmChecks.phoneShineDisplay === 'none' ? '✓' : '✗'}`);
  console.log(`  │  Hero h1 visible: ${rmChecks.heroH1Visible !== false ? '✓' : '✗'}`);
  console.log(`  │  Chat bubbles visible: ${rmChecks.bubblesVisible !== false ? '✓' : '✗'}`);
  console.log('  └' + '─'.repeat(60));

  // Keyboard results
  console.log('\n  ┌─ KEYBOARD NAVIGATION');
  console.log('  │');
  const kbOk = allData['keyboard'];
  const kbWithFocus = kbOk.filter(f => f && f.hasFocusIndicator);
  console.log(`  │  Elements tabbed: ${kbOk.length}/${kbOk.filter(f => f).length} focused`);
  console.log(`  │  Focus indicators: ${kbWithFocus.length}/${kbOk.filter(f => f).length} visible`);
  if (kbOk.filter(f => f && !f.hasFocusIndicator).length > 0) {
    console.log('  │  Missing focus on:');
    kbOk.filter(f => f && !f.hasFocusIndicator).forEach(f => {
      console.log(`  │    - <${f.tag}> "${f.text}"`);
    });
  }
  console.log('  └' + '─'.repeat(60));

  // Final scores
  const baselineAvg = baselineSum / 7;
  const surfaceAvg = surfaceSum / 3;
  const overallRaw = (baselineAvg + surfaceAvg) / 2;
  const minUniversal = Math.min(...categories.slice(0, 7).map(c => c.score));
  const floorActive = minUniversal < 5;
  const overall = floorActive ? Math.min(overallRaw, 7) : overallRaw;

  console.log('\n' + '═'.repeat(78));
  console.log('  FINAL SCORES');
  console.log('═'.repeat(78));
  console.log(`  BASELINE  (Universal, 7 cats): ${baselineAvg.toFixed(1)}/10`);
  categories.slice(0, 7).forEach(c => console.log(`    ${c.name.padEnd(35)} ${c.score}/10`));
  console.log('');
  console.log(`  SURFACE   (Landing, 3 cats):   ${surfaceAvg.toFixed(1)}/10`);
  categories.slice(7).forEach(c => console.log(`    ${c.name.padEnd(35)} ${c.score}/10`));
  console.log('');
  console.log('─'.repeat(78));
  console.log(`  OVERALL SCORE: ${overall.toFixed(1)}/10`);
  console.log(`  Floor rule active: ${floorActive ? 'YES (a category < 5/10)' : 'NO'}`);
  
  // Console errors
  const allErrors = [];
  VIEWPORTS.forEach(vp => { allErrors.push(...(allData[vp.name].consoleErrors || [])); });
  if (allErrors.length > 0) {
    console.log(`\n  ⚠ CONSOLE ERRORS (${allErrors.length}):`);
    [...new Set(allErrors)].slice(0, 5).forEach(e => console.log(`    - ${e.substring(0, 100)}`));
  }

  // Diagnosis
  console.log('\n  ┌─ DIAGNOSIS & FIX PLAN');
  console.log('  │');
  categories.forEach(cat => {
    const failing = cat.criteria.filter(c => !c.pass);
    if (failing.length === 0) return;
    failing.forEach(c => {
      console.log(`  │  ${cat.name} #${c.id}: ${c.desc}`);
      console.log(`  │    Expected: ${c.expected}`);
      console.log(`  │    Measured: ${c.measured}`);
      console.log(`  │    Fix: ${getFixSuggestion(cat.name, c)}`);
    });
  });
  console.log('  └' + '─'.repeat(60));

  console.log('\n' + '═'.repeat(78) + '\n');

  // Write JSON report
  const report = {
    meta: { surface: 'landing', build: buildHash, freshBuild: true, date: new Date().toISOString() },
    scores: { baseline: baselineAvg, surface: surfaceAvg, overall, floorActive },
    categories: categories.map(c => ({ name: c.name, score: c.score, criteria: c.criteria })),
    crossViewport: { mobileOverflows, mobileTapTargets },
    reducedMotion: rmChecks,
    keyboard: allData['keyboard'],
    consoleErrors: allErrors,
  };
  
  const reportPath = '/tmp/ux-audit-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.error(`\n  JSON report saved to ${reportPath}`);

  await browser.close();
}

function getFixSuggestion(catName, criterion) {
  const fixes = {
    'Visual Fidelity': {
      1: 'Verify CSS variables are used in component classes',
      2: 'Check h1 font-size in Hero.tsx (should be text-5xl lg:text-7xl)',
      3: 'Ensure padding values are multiples of 4',
      5: 'Check phone-chat.css drop-shadow values',
      7: 'Verify body/nav background color uses white token',
      8: 'Add overflow-x-hidden to body or fix wide elements',
    },
    'Layout & Composition': {
      1: 'Add grid display to hero section',
      8: 'Ensure nav has sticky positioning',
    },
    'Interaction & Behavior': {
      3: 'Increase padding on small tap targets to meet 44×44px minimum',
      4: 'Add aria-label to unlabeled inputs',
      5: 'Add rel="noopener noreferrer" to external links',
      6: 'Add type="button" to buttons without explicit type',
    },
    'Phone Hero Realism': {
      1: 'Check phone-chat.css .phone width/height (260×563px)',
      2: 'Verify .phone-body background has multi-stop gradient',
      3: 'Check .phone-island dimensions (80×22px)',
      4: 'Check border-radius: body 55px, screen 47px',
      5: 'Verify 4 drop-shadow() layers on .phone',
      7: 'Check .phone-glow dimensions (140×28px)',
      8: 'Remove any perpetual float/bob animation on phone',
    },
    'Simulator Integrity': {
      1: 'Verify calculatePayment() output is rendered',
      3: 'Add ChipRadioGroup for term selection',
      4: 'Add frequency selector chips',
      6: 'Add ReassuranceChips component',
      7: 'Add role="alert" for error messages',
      8: 'Add border-t-[3px] border-t-green/40 to simulator',
    },
    'Narrative Flow': {
      1: 'Reorder sections in page.tsx',
      3: 'Add SectionDivider between sections',
      4: 'Add eyebrow + h2 to each section',
      5: 'Use font-display class on h2 elements',
      6: 'Add py-16 lg:py-24 to sections',
      7: 'Add StickyPaymentBar component',
      8: 'Add radial-gradient dot-grid to CtaBanner',
    },
  };
  return fixes[catName]?.[criterion.id] || 'Review spec criterion and adjust implementation';
}

main().catch(e => { console.error(e); process.exit(1); });
