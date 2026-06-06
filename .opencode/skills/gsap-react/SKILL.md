---
name: gsap-react
description: "Official GSAP skill for React — useGSAP hook, refs, gsap.context(), cleanup, SSR. Use when: writing GSAP animations in React or Next.js components, useGSAP hook, cleanup on unmount, or SSR-safe GSAP usage in the Credalia landing page."
license: MIT
---

# GSAP with React

## When to Use This Skill

Apply when writing or reviewing GSAP code in React (or Next.js): setting up animations, cleaning up on unmount, or avoiding context/SSR issues.

**Related skills:** For tweens use **gsap-core**; for timelines use **gsap-timeline**; for scroll-based animation use **gsap-scrolltrigger**.

## Installation

```bash
npm install gsap @gsap/react
```

## Prefer the useGSAP() Hook

Use **useGSAP()** instead of `useEffect()` for GSAP setup. It handles cleanup automatically and provides scope and **contextSafe** for callbacks.

```javascript
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP);

const containerRef = useRef(null);

useGSAP(() => {
  gsap.to(".box", { x: 100 });
  gsap.from(".item", { autoAlpha: 0, stagger: 0.1 });
}, { scope: containerRef });
```

- ✅ Pass a **scope** (ref or element) so selectors are scoped to that root
- ✅ Cleanup (reverting animations and ScrollTriggers) runs automatically on unmount
- ✅ Use **contextSafe** from the hook's return value for callbacks

## Dependency Array, Scope, and revertOnUpdate

```javascript
useGSAP(() => {
  // gsap code here
}, {
  dependencies: [endX],  // re-run when endX changes
  scope: container,      // scope selector text
  revertOnUpdate: true   // revert and re-run on dependency change
});
```

## Context-Safe Callbacks

For GSAP code in event handlers that run AFTER useGSAP, wrap in **contextSafe**:

```javascript
useGSAP((context, contextSafe) => {
  // ✅ safe — created during execution
  gsap.to(goodRef.current, { x: 100 });

  // ✅ safe — wrapped in contextSafe
  const onClickGood = contextSafe(() => {
    gsap.to(goodRef.current, { rotation: 180 });
  });

  goodRef.current.addEventListener('click', onClickGood);
  return () => goodRef.current.removeEventListener('click', onClickGood);
}, { scope: container });
```

## Server-Side Rendering (Next.js App Router)

GSAP runs in the browser only. Do not call gsap or ScrollTrigger during SSR.

- ✅ Use **useGSAP** (or useEffect) so all GSAP code runs only on the client
- ✅ Components using GSAP must have `"use client"` directive
- ✅ Register plugins at top level or in a provider, not inside components that re-render
- ✅ Dynamic import inside useEffect is an option if tree-shaking is a concern

## gsap.context() in useEffect (when useGSAP isn't used)

```javascript
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.to(".box", { x: 100 });
  }, containerRef);
  return () => ctx.revert();
}, []);
```

## Best Practices

- ✅ Prefer **useGSAP()** over `useEffect()`/`useLayoutEffect()`
- ✅ Use refs for targets and pass **scope**
- ✅ Run GSAP only on the client (useGSAP or useEffect)
- ✅ Register plugins once at app level, not per-component

## Do Not

- ❌ Target by selector without a scope
- ❌ Skip cleanup — always revert context or kill tweens in effect return
- ❌ Run GSAP during SSR
- ❌ Register plugins inside components that re-render
