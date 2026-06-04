"use client";

/**
 * Smooth-scroll CTA (the prototype's `data-scroll` buttons). Scrolls to the
 * target with ~80px offset for the sticky nav. `sim_cta_click` analytics for
 * the "#simula" targets is wired in Slice 5.
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
        const el = document.querySelector(target);
        if (el) {
          const y =
            el.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
