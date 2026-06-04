"use client";

import { useSiteUi, type ApplyOrigin } from "./site-ui";

/**
 * Every "Solicitar crédito" CTA (the prototype's `data-action="solicitud"`).
 * Opens the application modal via the shared seam. `origin="simulator"` is the
 * high-intent path that shows the confirmation chip (wired in Slice 4).
 */
export function ApplyButton({
  origin = "direct",
  className,
  children,
  onClick,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  origin?: ApplyOrigin;
}) {
  const { openApply } = useSiteUi();
  return (
    <button
      type="button"
      className={className}
      onClick={(e) => {
        onClick?.(e);
        openApply(origin);
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
