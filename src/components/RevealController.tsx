"use client";

import { useEffect } from "react";

/**
 * Scroll-reveal, ported from `app.js` section 7. The `.reveal` opacity is gated
 * behind `<html class="js">` (set before paint in layout) so content is never
 * stranded hidden without JS. This reveals anything already in/above the
 * viewport at mount, observes the rest, honors prefers-reduced-motion, and has
 * a 2.5s failsafe so nothing stays hidden if the observer never fires.
 */
export function RevealController() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!els.length) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const revealAll = () => els.forEach((el) => el.classList.add("in"));

    if (reduced || !("IntersectionObserver" in window)) {
      revealAll();
      return;
    }

    const vh = window.innerHeight || document.documentElement.clientHeight;
    els.forEach((el) => {
      if (el.getBoundingClientRect().top < vh * 0.9) el.classList.add("in");
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );
    els.forEach((el) => {
      if (!el.classList.contains("in")) io.observe(el);
    });

    const failsafe = setTimeout(revealAll, 2500);
    return () => {
      io.disconnect();
      clearTimeout(failsafe);
    };
  }, []);

  return null;
}
