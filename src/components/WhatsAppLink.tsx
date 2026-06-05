"use client";

import { buildWhatsAppUrl, type WaContext } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { useSimulator } from "./simulator-store";

/**
 * WhatsApp deep link with the live simulación baked in (the href recomputes
 * whenever the simulation changes) and a `whatsapp_click` analytics event.
 * Sim-aware contexts (hero) embed the current amount/term/payment; footer/
 * contact/pqrs use a static message but still track the click.
 */
export function WhatsAppLink({
  ctx,
  className,
  children,
}: {
  ctx: WaContext;
  className?: string;
  children: React.ReactNode;
}) {
  const { sim } = useSimulator();
  return (
    <a
      className={className}
      href={buildWhatsAppUrl(ctx, sim)}
      target="_blank"
      rel="noopener"
      data-wa-ctx={ctx}
      onClick={() => track("whatsapp_click", { ctx })}
    >
      {children}
    </a>
  );
}
