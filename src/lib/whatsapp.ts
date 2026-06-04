import { config } from "./config";
import { fmtCOP, type Simulation } from "./credit";

/**
 * WhatsApp deep links (`https://wa.me/<PHONE>?text=<message>`). PHONE comes from
 * config (⚠️ placeholder 573001234567 until set). Messages vary by context;
 * sim-aware contexts (hero) embed the live simulación. Click analytics
 * (`whatsapp_click`) is wired at the call sites in Slice 5.
 */

export type WaContext = "hero" | "footer" | "contact" | "pqrs";

export function buildWhatsAppMessage(
  ctx: WaContext,
  sim: Pick<Simulation, "amount" | "term" | "payment" | "unit">,
): string {
  if (ctx === "pqrs") return "Hola, quiero radicar una PQRS con Credalia.";
  if (ctx === "contact" || ctx === "footer")
    return "Hola, quiero información sobre un crédito en Credalia.";
  // hero + any sim-aware entry point
  return (
    `Hola, simulé un crédito de $${fmtCOP(sim.amount)} a ${sim.term} meses ` +
    `(cuota $${fmtCOP(sim.payment)} ${sim.unit}) y quiero más información.`
  );
}

export function buildWhatsAppUrl(
  ctx: WaContext,
  sim: Pick<Simulation, "amount" | "term" | "payment" | "unit">,
): string {
  return `https://wa.me/${config.whatsappPhone}?text=${encodeURIComponent(
    buildWhatsAppMessage(ctx, sim),
  )}`;
}
