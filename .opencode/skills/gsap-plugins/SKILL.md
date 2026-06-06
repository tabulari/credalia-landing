---
name: gsap-plugins
description: "Official GSAP skill for plugins — registration, SplitText, ScrollToPlugin, Flip, Draggable. Use when: using GSAP plugins, SplitText character/word animation, text reveals, plugin registration, or text animation in the Credalia landing page."
license: MIT
---

# GSAP Plugins

## When to Use This Skill

Apply when using GSAP plugins: registering plugins, SplitText for text animation, ScrollToPlugin, Flip for layout transitions, or other GSAP plugins.

**Related skills:** For core tweens use **gsap-core**; for ScrollTrigger use **gsap-scrolltrigger**; for React use **gsap-react**.

## Registering Plugins

Register each plugin once with **gsap.registerPlugin()** before using it:

```javascript
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);
```

- ✅ Register before using the plugin in any tween or API call
- ✅ In React, register at top level or in a provider; do not register inside components that re-render
- ✅ `useGSAP` is a plugin that needs to be registered before use

## SplitText — Character/Word/Line Animation

SplitText splits text into individual characters, words, and/or lines for granular animation. Free as of GSAP 3.12+.

```javascript
gsap.registerPlugin(SplitText);

// Create split instance
let split = SplitText.create(".headline", { type: "chars, words" });

// Animate characters
gsap.from(split.chars, {
  duration: 0.8,
  y: 80,
  autoAlpha: 0,
  stagger: 0.03,
  ease: "power3.out"
});

// Revert when done or on unmount
split.revert();
```

### SplitText vars

| Property | Type | Description |
|----------|------|-------------|
| **type** | String | `"chars"`, `"words"`, `"lines"`, or combination like `"chars, words"` |
| **tag** | String | HTML tag for wrapper elements. Default `"div"` |
| **wordsClass** | String | Class added to word wrappers |
| **charsClass** | String | Class added to character wrappers |
| **linesClass** | String | Class added to line wrappers |
| **reduceOpacity** | Boolean | If true, uses opacity instead of visibility for hidden state |
| **aria** | String | `"hidden"` (default) — adds aria-hidden to split elements for accessibility |

### SplitText Best Practices

- ✅ Always call `split.revert()` on component unmount to restore original DOM
- ✅ In React, create SplitText inside `useGSAP()` so it auto-reverts
- ✅ Use `type: "chars, words"` for character-by-character reveal with word-level grouping
- ✅ Add `aria: "hidden"` for accessibility (default)
- ✅ Stagger chars at 0.02-0.04s per character for readable reveals

## ScrollToPlugin

```javascript
gsap.registerPlugin(ScrollToPlugin);
gsap.to(window, { duration: 1, scrollTo: { y: "#section", offsetY: 80 } });
```

## Flip — Layout Transitions

```javascript
gsap.registerPlugin(Flip);
const state = Flip.getState(".elements");
// ... DOM change (add/remove classes, rearrange) ...
Flip.from(state, { duration: 0.5, ease: "power2.inOut" });
```

## Best Practices

- ✅ Register every plugin with `gsap.registerPlugin()` before first use
- ✅ Revert SplitText instances on component unmount
- ✅ Register once at app level, not per-component

## Do Not

- ❌ Use a plugin without registering it first
- ❌ Forget to revert SplitText on unmount (causes DOM leaks)
- ❌ Ship GSDevTools or dev-only plugins to production
