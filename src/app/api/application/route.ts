import { NextResponse } from "next/server";
import { applicationSchema } from "@/lib/application-schema";

/**
 * Application submit endpoint. Validates the payload with the SAME zod schema
 * the client uses, then issues a radicado. In production it forwards the
 * application to the real backend (APPLICATION_ENDPOINT); the prototype's fake
 * 1.4s Promise is replaced by this real round-trip.
 *
 * Test hook: POST with `?forceError=1` returns 500 so the modal's error panel
 * (and draft-preservation) can be exercised — mirrors the prototype's
 * window.Credalia.__forceSubmitError.
 */
export async function POST(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("forceError") === "1") {
    return NextResponse.json(
      { error: "Forced error (test hook)." },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = applicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validación fallida.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const radicado = `CR-2026-${Math.floor(10000 + Math.random() * 89999)}`;

  // ⚠️ Wire the real backend here once APPLICATION_ENDPOINT is configured. The
  // prod-config guard (lib/config.ts) blocks a production build until the
  // placeholder endpoint is replaced. Until then we just return the radicado.
  //
  //   const res = await fetch(config.applicationEndpoint, { method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(parsed.data) });
  //   const data = await res.json(); return NextResponse.json({ radicado: data.id });

  return NextResponse.json({ radicado }, { status: 200 });
}
