---
name: gsap-timeline
description: "Official GSAP skill for timelines — gsap.timeline(), position parameter, labels, nesting, playback. Use when: sequencing animations, choreographing keyframes, animation order, hero entrance sequences, or multi-step animation in the Credalia landing page."
license: MIT
---

# GSAP Timeline

## When to Use This Skill

Apply when building multi-step animations, coordinating several tweens in sequence or parallel, or when the user asks about timelines, sequencing, or keyframe-style animation.

**Related skills:** For single tweens use **gsap-core**; for scroll-driven timelines use **gsap-scrolltrigger**; for React use **gsap-react**.

## Creating a Timeline

```javascript
const tl = gsap.timeline({ defaults: { duration: 0.5, ease: "power2.out" } });
tl.to(".a", { x: 100, duration: 1 })
  .to(".b", { y: 50, duration: 0.5 })
  .to(".c", { autoAlpha: 0, duration: 0.3 });
```

By default, tweens are **appended** one after another. Use the **position parameter** to place tweens at specific times.

## Position Parameter

Third argument controls placement:

- **Absolute**: `1` — start at 1 second
- **Relative**: `"+=0.5"` — 0.5s after last end; `"-=0.2"` — 0.2s before last end
- **Label**: `"labelName"` — at that label; `"labelName+=0.3"` — 0.3s after label
- **Placement**: `"<"` — start when recently-added animation starts; `">"` — start when recently-added animation ends (default); `"<0.2"` — 0.2s after recently-added animation start

```javascript
tl.to(".a", { x: 100 }, 0);           // at 0
tl.to(".b", { y: 50 }, "+=0.5");      // 0.5s after last end
tl.to(".c", { autoAlpha: 0 }, "<");   // same start as previous
tl.to(".d", { scale: 2 }, "<0.2");    // 0.2s after previous start
```

## Timeline Defaults

Pass defaults so all child tweens inherit:

```javascript
const tl = gsap.timeline({ defaults: { duration: 0.5, ease: "power2.out" } });
```

## Labels

```javascript
tl.addLabel("intro", 0);
tl.to(".a", { x: 100 }, "intro");
tl.addLabel("outro", "+=0.5");
tl.to(".b", { autoAlpha: 0 }, "outro");
tl.play("outro");
```

## Nesting Timelines

```javascript
const master = gsap.timeline();
const child = gsap.timeline();
child.to(".a", { x: 100 }).to(".b", { y: 50 });
master.add(child, 0);
```

## Controlling Playback

- `tl.play()` / `tl.pause()` / `tl.reverse()`
- `tl.restart()` — from start
- `tl.time(2)` — seek to 2 seconds
- `tl.progress(0.5)` — seek to 50%
- `tl.kill()` — kill timeline and children

## Best Practices

- ✅ Prefer timelines for sequencing over chained delays
- ✅ Use the **position parameter** for precise placement
- ✅ Add **labels** for readable, maintainable sequencing
- ✅ Pass **defaults** into the timeline constructor
- ✅ Put ScrollTrigger on the timeline, not on child tweens

## Do Not

- ❌ Chain animations with `delay` when a timeline can sequence them
- ❌ Forget to pass `defaults` when many tweens share duration/ease
- ❌ Put ScrollTrigger on child tweens inside a timeline
