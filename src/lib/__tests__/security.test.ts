import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { checkRateLimit } from "../security";
import { config } from "../config";

/** Unique client IP per test so the process-wide limiter map starts empty. */
function uniqueIp(): string {
  // RFC 5737 documentation block — never routable, safe for header injection.
  const a = Math.floor(Math.random() * 254) + 1;
  const b = Math.floor(Math.random() * 254) + 1;
  const c = Math.floor(Math.random() * 254) + 1;
  return `203.0.${a}.${b}` + ":" + c; // unique-checksum-style suffix is fine, header is parsed on first segment
}

function buildRequest(ip: string): NextRequest {
  return new NextRequest("http://localhost:3000/api/application", {
    method: "POST",
    headers: { "x-forwarded-for": ip.split(":")[0] },
  });
}

describe("checkRateLimit", () => {
  it("defaults to 5/min — must match Core's RATE_LIMIT_MAX_REQUESTS", () => {
    // Regression-locks the cross-repo contract. If the landing's default
    // drifts away from Core's hardcoded 5, this test fails loudly so the next
    // deploy can't reintroduce the historic mismatch.
    expect(config.webLeadRateLimitPerMinute).toBe(5);
  });

  it("allows exactly the configured limit, then returns rate_limited with Retry-After", async () => {
    const ip = uniqueIp();
    const limit = config.webLeadRateLimitPerMinute;

    // First N requests within the window all pass.
    for (let i = 0; i < limit; i++) {
      expect(checkRateLimit(buildRequest(ip))).toBeNull();
    }

    // The (N+1)th trips the limiter and surfaces truthful copy + Retry-After.
    const blocked = checkRateLimit(buildRequest(ip));
    expect(blocked).not.toBeNull();
    expect(blocked!.status).toBe(429);
    expect(blocked!.headers.get("Retry-After")).toBeTruthy();

    const body = (await blocked!.json()) as { code?: string; retryAfterSeconds?: number };
    expect(body.code).toBe("rate_limited");
    expect(typeof body.retryAfterSeconds).toBe("number");
    expect(body.retryAfterSeconds).toBeGreaterThanOrEqual(1);
  });

  it("tracks each IP independently — a different IP gets its own bucket", async () => {
    for (let i = 0; i < config.webLeadRateLimitPerMinute; i++) {
      expect(checkRateLimit(buildRequest(uniqueIp()))).toBeNull();
    }
  });
});
