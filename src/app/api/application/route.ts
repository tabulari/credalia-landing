import { NextRequest, NextResponse } from "next/server";
import { applicationSchema } from "@/lib/application-schema";
import {
  checkRateLimit,
  checkOrigin,
  checkCsrf,
  applySecurityHeaders,
  getClientIp,
} from "@/lib/security";
import { config } from "@/lib/config";
import {
  CoreLeadError,
  forwardApplicationToCore,
} from "@/lib/core-lead";

/**
 * Application submit endpoint. Validates the payload with the SAME zod schema
 * the client uses, forwards it to Core, and returns Core's radicado. The
 * prototype's fake 1.4s Promise is replaced by this real round-trip.
 *
 * Security: rate-limited (5 req/min/IP), origin check, CSRF via Origin/Referer,
 * security response headers, and a shared `X-Landing-Api-Key` secret on the
 * outbound call to Core.
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

  const userAgent = request.headers.get("user-agent") || "unknown";

  try {
    const coreResponse = await forwardApplicationToCore(parsed.data, {
      applicationEndpoint: config.applicationEndpoint,
      landingApiKey: config.landingApiKey,
      clientIp: getClientIp(request),
      userAgent,
    });

    return applySecurityHeaders(
      NextResponse.json({ radicado: coreResponse.radicado }, { status: 200 }),
    );
  } catch (error) {
    const upstreamStatus = error instanceof CoreLeadError ? error.status : undefined;
    console.error("Core web-lead forwarding failed", { upstreamStatus });
    return applySecurityHeaders(
      NextResponse.json(
        { error: "No pudimos registrar la solicitud. Intenta nuevamente." },
        { status: 502 },
      ),
    );
  }
}
