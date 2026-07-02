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
import { CONSENT_TEXT_SHA256 } from "@/lib/consent";

/**
 * Application submit endpoint. Validates the payload with the SAME zod schema
 * the client uses, then forwards it to Core's `POST /api/v1/intake/web-lead`
 * (APPLICATION_ENDPOINT). Core is the source of truth for the radicado — this
 * route no longer generates one locally.
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

  // Core's WebLeadIntakeRequest expects `terms: { amount, termMonths,
  // monthlyInterestRate }` — map from the frozen Simulation snapshot's
  // `term`/`monthlyRate` (and stringify the rate; Core stores it as Decimal).
  const terms = parsed.data.terms
    ? {
        amount: parsed.data.terms.amount,
        termMonths: parsed.data.terms.term,
        monthlyInterestRate: String(parsed.data.terms.monthlyRate),
      }
    : undefined;

  let coreResponse: Response;
  try {
    coreResponse = await fetch(config.applicationEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Landing-Api-Key": config.landingApiKey,
      },
      body: JSON.stringify({
        ...parsed.data,
        // Core requires exactly 10 digits, no spaces — the UI's phone input
        // allows spaces while typing (e.g. "300 123 4567").
        phone: parsed.data.phone.replace(/\D/g, ""),
        terms,
        clientIp: getClientIp(request),
        userAgent: request.headers.get("user-agent") ?? null,
        consentTextHash: CONSENT_TEXT_SHA256,
      }),
    });
  } catch {
    return applySecurityHeaders(
      NextResponse.json({ error: "Error al registrar la solicitud." }, { status: 502 }),
    );
  }

  if (!coreResponse.ok) {
    return applySecurityHeaders(
      NextResponse.json({ error: "Error al registrar la solicitud." }, { status: 502 }),
    );
  }

  const data: { radicado: string } = await coreResponse.json();

  return applySecurityHeaders(
    NextResponse.json({ radicado: data.radicado }, { status: 200 }),
  );
}
