---
name: gsap-performance
description: "Official GSAP skill for performance — prefer transforms, avoid layout thrashing, will-change, batching. Use when: optimizing GSAP animations, reducing jank, animation performance, FPS, smooth 60fps, or ScrollTrigger performance in the Credalia landing page."
license: MIT
---

# GSAP Performance

## When to Use This Skill

Apply when optimizing GSAP animations for smooth 60fps, reducing layout/paint cost, or when the user asks about performance, jank, or best practices for fast animations.

**Related skills:** Build animations with **gsap-core** and **gsap-timeline**; for ScrollTrigger performance see **gsap-scrolltrigger**.

## Prefer Transform and Opacity

Animating **transform** and **opacity** keeps work on the compositor and avoids layout and most paint.

- ✅ Prefer: **x**, **y**, **scale**, **rotation**, **opacity**, **autoAlpha**
- ❌ Avoid when possible: **width**, **height**, **top**, **left**, **margin**, **padding** (they trigger layout and jank)

GSAP's **x** and **y** use transforms by default; use them instead of **left**/**top**.

## will-change

Use **will-change** in CSS on elements that will animate:

```css
.will-animate {
  will-change: transform;
}
```

Only apply to elements that are actually animating. Remove when animation is done.

## Batch Reads and Writes

GSAP batches updates internally. When mixing GSAP with direct DOM reads/writes, avoid interleaving reads and writes that cause layout thrashing. Do all reads first, then all writes.

## Many Elements — Stagger, Lists

- Use **stagger** instead of many separate tweens with manual delays
- For long lists, animate only visible items
- Reuse timelines where possible

## Frequently Updated Properties

Prefer **gsap.quickTo()** for properties updated often (e.g. mouse followers):

```javascript
let xTo = gsap.quickTo("#id", "x", { duration: 0.4, ease: "power3" }),
    yTo = gsap.quickTo("#id", "y", { duration: 0.4, ease: "power3" });

document.querySelector("#container").addEventListener("mousemove", (e) => {
  xTo(e.pageX);
  yTo(e.pageY);
});
```

## ScrollTrigger and Performance

- **pin: true** promotes the pinned element; pin only what's needed
- **scrub** with a small value (e.g. `scrub: 1`) reduces work during scroll
- Call **ScrollTrigger.refresh()** only when layout actually changes; debounce when possible

## Reduce Simultaneous Work

- Pause or kill off-screen animations
- Avoid animating many properties on many elements at once; sequence if needed
- For ScrollTrigger.batch, use `batchMax` to limit simultaneous animations

## Best Practices

- ✅ Animate **transform** and **opacity**; use **will-change** only on animating elements
- ✅ Use **stagger** instead of separate tweens with manual delays
- ✅ Use **gsap.quickTo()** for frequently updated properties
- ✅ Clean up or kill off-screen animations
- ✅ Debounce **ScrollTrigger.refresh()** after layout changes

## Do Not

- ❌ Animate `width`/`height`/`top`/`left` when `x`/`y`/`scale` achieve the same look
- ❌ Set `will-change` on every element "just in case"
- ❌ Create hundreds of overlapping tweens without testing on low-end devices
- ❌ Ignore cleanup; stray tweens and ScrollTriggers hurt performance
