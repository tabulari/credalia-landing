import { NextRequest, NextResponse } from "next/server";
import { config } from "./config";

const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 5;

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
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." },
      { status: 429 },
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

export function checkOrigin(request: NextRequest): NextResponse | null {
  const origin = request.headers.get("origin");
  const siteOrigin = config.siteUrl.replace(/\/$/, "");

  if (origin && origin !== siteOrigin) {
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
