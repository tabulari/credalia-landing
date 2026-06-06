---
name: gsap-core
description: "Official GSAP skill for the core API — gsap.to(), from(), fromTo(), easing, duration, stagger, defaults, gsap.matchMedia() (responsive, prefers-reduced-motion). Use when: writing GSAP animations, tweens, easing, stagger, responsive animation, reduced-motion animation, or animating DOM/SVG with GSAP in the Credalia landing page."
license: MIT
---

# GSAP Core

## When to Use This Skill

Apply when writing or reviewing GSAP animations that use the core engine: single tweens, eases, staggers, or when explaining how GSAP tweens work.

**Related skills:** For sequencing use **gsap-timeline**; for scroll-linked animation use **gsap-scrolltrigger**; for React use **gsap-react**; for plugins (SplitText, etc.) use **gsap-plugins**; for performance use **gsap-performance**.

## Core Tween Methods

- **gsap.to(targets, vars)** — animate from current state to `vars`. Most common.
- **gsap.from(targets, vars)** — animate from `vars` to current state (good for entrances).
- **gsap.fromTo(targets, fromVars, toVars)** — explicit start and end; no reading of current values.
- **gsap.set(targets, vars)** — apply immediately (duration 0).

Always use **property names in camelCase** in the vars object (e.g. `backgroundColor`, `rotationX`, `scaleY`).

## Common vars

- **duration** — seconds (default 0.5).
- **delay** — seconds before start.
- **ease** — string or function. Prefer built-in: `"power1.out"` (default), `"power3.inOut"`, `"back.out(1.7)"`, `"elastic.out(1, 0.3)"`, `"none"`.
- **stagger** — number (seconds between) like `0.1` or object: `{ amount: 0.3, from: "center" }`, `{ each: 0.1, from: "random" }`.
- **overwrite** — `false` (default), `true`, or `"auto"`.
- **repeat** — number or `-1` for infinite.
- **yoyo** — boolean; with repeat, alternates direction.
- **immediateRender** — When `true` (default for **from()** and **fromTo()**), start state applied immediately. When **multiple from()/fromTo()** target the same property, set **immediateRender: false** on later ones.

## Transforms and CSS Properties

Prefer GSAP's **transform aliases** over raw `transform` string:

| GSAP property | Equivalent |
|---------------|-----------|
| `x`, `y`, `z` | translateX/Y/Z (default unit: px) |
| `xPercent`, `yPercent` | translateX/Y in % |
| `scale`, `scaleX`, `scaleY` | scale |
| `rotation` | rotate (deg or rad string) |
| `rotationX`, `rotationY` | 3D rotate |
| `skewX`, `skewY` | skew |

- **autoAlpha** — Prefer over `opacity`. When `0`, also sets `visibility: hidden` (no pointer events); when non-zero, `visibility: inherit`.
- **clearProps** — Remove inline styles after animation. Clearing any transform property clears the entire transform.

## Easing

```javascript
ease: "power1.out"     // default feel
ease: "power3.inOut"   // smooth acceleration/deceleration
ease: "back.out(1.7)"  // overshoot (good for entrances)
ease: "elastic.out(1, 0.3)" // springy
ease: "none"           // linear
```

Built-in: `power1-4`, `back`, `bounce`, `circ`, `elastic`, `expo`, `sine` — each with `.in`, `.out`, `.inOut`.

## gsap.matchMedia() — Responsive + Reduced Motion

```javascript
let mm = gsap.matchMedia();
mm.add(
  {
    isDesktop: "(min-width: 760px)",
    isMobile: "(max-width: 759px)",
    reduceMotion: "(prefers-reduced-motion: reduce)"
  },
  (context) => {
    const { isDesktop, reduceMotion } = context.conditions;
    gsap.to(".box", {
      rotation: isDesktop ? 360 : 180,
      duration: reduceMotion ? 0 : 2
    });
  }
);
```

Respecting **prefers-reduced-motion** is critical for accessibility. Use `duration: 0` or skip animation when `reduceMotion` is true.

## Best Practices

- ✅ Prefer **transform aliases** and **autoAlpha** over raw CSS
- ✅ Use documented built-in eases
- ✅ Prefer timelines over chained delays
- ✅ Use **gsap.matchMedia()** for responsive + reduced-motion
- ✅ Store tween/timeline return value for playback control

## Do Not

- ❌ Animate layout properties (`width`, `height`, `top`, `left`) when transforms work
- ❌ Use both `svgOrigin` and `transformOrigin` on same SVG element
- ❌ Stack `from()` on same property without `immediateRender: false`
- ❌ Use invalid ease names
