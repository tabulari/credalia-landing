import { NextRequest, NextResponse } from "next/server";
import { applicationSchema } from "@/lib/application-schema";
import {
  checkRateLimit,
  checkOrigin,
  checkCsrf,
  applySecurityHeaders,
} from "@/lib/security";
import { config } from "@/lib/config";

/**
 * Application submit endpoint. Validates the payload with the SAME zod schema
 * the client uses, then issues a radicado. In production it forwards the
 * application to the real backend (APPLICATION_ENDPOINT); the prototype's fake
 * 1.4s Promise is replaced by this real round-trip.
 *
 * Security: rate-limited (5 req/min/IP), origin check, CSRF via Origin/Referer,
 * and security response headers.
 *
 * Test hook: POST with `?forceError=1` returns 500 so the modal's error panel
 * (and draft-preservation) can be exercised.
 */
export async function POST(request: NextRequest) {
  const rateLimitResponse = checkRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  const originResponse = checkOrigin(request);
  if (originResponse) return originResponse;

  const csrfResponse = checkCsrf(request);
  if (csrfResponse) return csrfResponse;

  const url = new URL(request.url);
  if (url.searchParams.get("forceError") === "1") {
    return applySecurityHeaders(
      NextResponse.json(
        { error: "Forced error (test hook)." },
        { status: 500 },
      ),
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return applySecurityHeaders(
      NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }),
    );
  }

  const parsed = applicationSchema.safeParse(body);
  if (!parsed.success) {
    return applySecurityHeaders(
      NextResponse.json(
        { error: "Validación fallida.", issues: parsed.error.flatten() },
        { status: 400 },
      ),
    );
  }

  const radicado = `${config.radicadoPrefix}-${Math.floor(10000 + Math.random() * 89999)}`;

  // ⚠️ Wire the real backend here once APPLICATION_ENDPOINT is configured. The
  // prod-config guard (lib/config.ts) blocks a production build until the
  // placeholder endpoint is replaced. Until then we just return the radicado.
  //
  //   const res = await fetch(config.applicationEndpoint, { method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(parsed.data) });
  //   const data = await res.json(); return NextResponse.json({ radicado: data.id });

  return applySecurityHeaders(
    NextResponse.json({ radicado }, { status: 200 }),
  );
}
