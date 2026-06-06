---
name: gsap-scrolltrigger
description: "Official GSAP skill for ScrollTrigger — scroll-linked animations, pinning, scrub, triggers, batch. Use when: scroll animations, parallax, pinned sections, scrub-linked progress, card reveal on scroll, or scroll-driven animation in the Credalia landing page."
license: MIT
---

# GSAP ScrollTrigger

## When to Use This Skill

Apply when implementing scroll-driven animations: triggering tweens/timelines on scroll, pinning elements, scrubbing animation to scroll position, or batch reveals.

**Related skills:** For tweens use **gsap-core**; for timelines use **gsap-timeline**; for React cleanup use **gsap-react**.

## Registering the Plugin

```javascript
gsap.registerPlugin(ScrollTrigger);
```

## Basic Trigger

```javascript
gsap.to(".box", {
  x: 500,
  scrollTrigger: {
    trigger: ".box",
    start: "top center",
    toggleActions: "play reverse play reverse"
  }
});
```

**start/end** format: `"triggerPosition viewportPosition"`. Examples: `"top top"`, `"center center"`, `"bottom 80%"`, numeric pixels, `"+=300"`, `"+=100%"`, or `"max"`.

## Key Config Options

| Property | Type | Description |
|----------|------|-------------|
| **trigger** | String \| Element | Element whose position defines where ScrollTrigger starts |
| **start** | String \| Number \| Function | When active. Default `"top bottom"` |
| **end** | String \| Number \| Function | When it ends. Default `"bottom top"` |
| **scrub** | Boolean \| Number | Link progress to scroll. `true` = direct; number = smooth delay in seconds |
| **toggleActions** | String | Four actions: onEnter, onLeave, onEnterBack, onLeaveBack. Each: `"play"`, `"pause"`, `"resume"`, `"reset"`, `"restart"`, `"complete"`, `"reverse"`, `"none"` |
| **pin** | Boolean \| String \| Element | Pin element while active. `true` = pin trigger. Don't animate the pinned element itself |
| **once** | Boolean | Kill trigger after end is reached once |
| **markers** | Boolean \| Object | Dev markers. Remove in production |
| **id** | String | Unique id for `ScrollTrigger.getById()` |
| **refreshPriority** | Number | Lower = refreshed first. Set for non-top-to-bottom order |

## Scrub — Scroll-Linked Progress

```javascript
gsap.to(".box", {
  x: 500,
  scrollTrigger: {
    trigger: ".box",
    start: "top center",
    end: "bottom center",
    scrub: 1  // 1 second smooth lag
  }
});
```

## Pinning

```javascript
scrollTrigger: {
  trigger: ".section",
  start: "top top",
  end: "+=1000",
  pin: true,
  scrub: 1
}
```

Don't animate the pinned element itself; animate children.

## ScrollTrigger.batch() — Coordinated Reveals

Creates one ScrollTrigger per target and batches callbacks within a short interval. Great for card reveal cascades:

```javascript
ScrollTrigger.batch(".card", {
  interval: 0.1,
  batchMax: 4,
  onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, stagger: 0.1, overwrite: true }),
  onLeaveBack: (batch) => gsap.set(batch, { autoAlpha: 0, y: 50, overwrite: true }),
  start: "top 85%"
});
```

## Timeline + ScrollTrigger

Put ScrollTrigger on the timeline, NOT on child tweens:

```javascript
// ✅ Correct
const tl = gsap.timeline({
  scrollTrigger: { trigger: ".container", start: "top top", scrub: 1 }
});
tl.to(".a", { x: 100 }).to(".b", { y: 50 });

// ❌ Wrong
gsap.timeline().to(".a", { scrollTrigger: {...} });
```

## Refresh and Cleanup

- **ScrollTrigger.refresh()** — recalculate after DOM/layout changes
- **Kill on unmount:** `ScrollTrigger.getAll().forEach(t => t.kill())`
- In React, use `useGSAP()` for automatic cleanup

## Best Practices

- ✅ Register `gsap.registerPlugin(ScrollTrigger)` once before use
- ✅ Call **ScrollTrigger.refresh()** after DOM/layout changes
- ✅ Use `useGSAP()` for automatic cleanup in React
- ✅ Use `scrub` OR `toggleActions`, never both on same trigger
- ✅ Create ScrollTriggers in page order (top-to-bottom) or set `refreshPriority`
- ✅ Remove `markers: true` before production

## Do Not

- ❌ Put ScrollTrigger on child tweens inside a timeline
- ❌ Use `scrub` and `toggleActions` together
- ❌ Create ScrollTriggers in random order without `refreshPriority`
- ❌ Leave `markers: true` in production
- ❌ Forget `ScrollTrigger.refresh()` after layout changes
