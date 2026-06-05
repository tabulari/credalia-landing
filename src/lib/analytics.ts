/**
 * Centralized analytics — the single funnel-instrumentation surface (ported
 * from the prototype `analytics.js`). Every meaningful conversion event flows
 * through `track(name, props)`, which pushes to `window.dataLayer` (GTM/GA4
 * convention) and dispatches a `credalia:track` event. Wire one place, not a
 * vendor SDK in every handler. Set `window.credaliaDebugAnalytics = true` to log.
 *
 * Events: sim_interact · sim_cta_click · apply_start · apply_step_complete ·
 * apply_edit_monto · apply_resume · apply_resume_dismiss · apply_submit ·
 * apply_submit_success · apply_submit_error · whatsapp_click.
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    credaliaDebugAnalytics?: boolean;
  }
}

export function track(name: string, props: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  const payload = { event: name, ts: Date.now(), ...props };
  try {
    (window.dataLayer = window.dataLayer || []).push(payload);
  } catch {
    /* dataLayer unavailable */
  }
  try {
    document.dispatchEvent(new CustomEvent("credalia:track", { detail: payload }));
  } catch {
    /* CustomEvent unavailable */
  }
  if (window.credaliaDebugAnalytics && window.console) {
    console.debug("[analytics]", name, payload);
  }
}
