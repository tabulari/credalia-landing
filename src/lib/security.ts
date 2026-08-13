import { NextRequest, NextResponse } from "next/server";
import { config } from "./config";

const RATE_LIMIT_WINDOW = 60_000;
// Sourced from config (env: `WEB_LEAD_RATE_LIMIT_PER_MIN`, default 5) so this
// side can't drift from Core's `RATE_LIMIT_MAX_REQUESTS` in
// `apps/core/src/api/intake.py`. See config.webLeadRateLimitPerMinute.
const RATE_LIMIT_MAX = config.webLeadRateLimitPerMinute;

const ipTimestamps = new Map<string, number[]>();

export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function checkRateLimit(request: NextRequest): NextResponse | null {
  const ip = getClientIp(request);
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  const timestamps = (ipTimestamps.get(ip) || []).filter((t) => t > windowStart);
  timestamps.push(now);
  ipTimestamps.set(ip, timestamps);

  if (timestamps.length > RATE_LIMIT_MAX) {
    // Compute when the oldest in-window timestamp will age out so the caller
    // can surface a truthful `Retry-After` (and the UI a wait hint) instead of
    // telling the user "connection problem".
    const oldestInWindow = timestamps[0];
    const retryAfterMs = Math.max(0, oldestInWindow + RATE_LIMIT_WINDOW - now);
    const retryAfterSec = Math.max(1, Math.ceil(retryAfterMs / 1000));
    return NextResponse.json(
      {
        error: "Demasiadas solicitudes. Intenta de nuevo en unos segundos.",
        code: "rate_limited",
        retryAfterSeconds: retryAfterSec,
      },
      { status: 429, headers: { "Retry-After": String(retryAfterSec) } },
    );
  }

  if (ipTimestamps.size > 10_000) {
    const cutoff = now - RATE_LIMIT_WINDOW;
    for (const [key, ts] of ipTimestamps) {
      if (ts[ts.length - 1] < cutoff) ipTimestamps.delete(key);
    }
  }

  return null;
}

/**
 * Local dev/test runs on http://localhost:<port>, which never equals the
 * configured (production) site origin. Outside production we accept loopback
 * origins so the apply flow is exercisable end-to-end without overriding
 * NEXT_PUBLIC_SITE_URL (which would corrupt canonical/OG URLs). Production is
 * unaffected: the strict siteOrigin comparison still applies.
 */
function isAllowedDevOrigin(origin: string): boolean {
  if (process.env.NODE_ENV === "production") return false;
  try {
    return new URL(origin).hostname === "localhost";
  } catch {
    return false;
  }
}

export function checkOrigin(request: NextRequest): NextResponse | null {
  const origin = request.headers.get("origin");
  const siteOrigin = config.siteUrl.replace(/\/$/, "");

  if (origin && origin !== siteOrigin && !isAllowedDevOrigin(origin)) {
    return NextResponse.json(
      { error: "Origen no permitido." },
      { status: 403 },
    );
  }

  return null;
}

export function checkCsrf(request: NextRequest): NextResponse | null {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const siteOrigin = config.siteUrl.replace(/\/$/, "");

  if (origin) return null;
  if (referer && referer.startsWith(siteOrigin)) return null;
  if (referer && isAllowedDevOrigin(referer)) return null;

  return NextResponse.json(
    { error: "Solicitud no permitida." },
    { status: 403 },
  );
}

export function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}
