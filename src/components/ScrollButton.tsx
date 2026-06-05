"use client";

import { track } from "@/lib/analytics";

/**
 * Smooth-scroll CTA (the prototype's `data-scroll` buttons). Scrolls to the
 * target with ~80px offset for the sticky nav, and fires `sim_cta_click` for
 * the "#simula" targets (matching the prototype).
 */
export function ScrollButton({
  target,
  className,
  children,
  onClick,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { target: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={(e) => {
        onClick?.(e);
        if (target === "#simula") {
          track("sim_cta_click", { label: e.currentTarget.textContent?.trim() });
        }
        const el = document.querySelector(target);
        if (el) {
          const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
