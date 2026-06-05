import { describe, it, expect } from "vitest";
import {
  PLACEHOLDER_KEYS,
  PLACEHOLDERS,
  findUnresolvedPlaceholders,
  assertProductionConfig,
} from "@/lib/config";

/**
 * The placeholder-in-prod guard. These assertions are the contract that blocks a
 * production build until every ⚠️ business value is real.
 */

const allRealEnv = (): Record<string, string> => {
  const env: Record<string, string> = {};
  for (const k of PLACEHOLDER_KEYS) env[k] = `real-${k}`;
  return env;
};

describe("production placeholder guard", () => {
  it("flags every key when all values are still placeholders", () => {
    const env: Record<string, string> = {};
    for (const k of PLACEHOLDER_KEYS) env[k] = PLACEHOLDERS[k];
    expect(findUnresolvedPlaceholders(env).sort()).toEqual(
      [...PLACEHOLDER_KEYS].sort(),
    );
  });

  it("flags missing and empty values", () => {
    expect(findUnresolvedPlaceholders({}).sort()).toEqual(
      [...PLACEHOLDER_KEYS].sort(),
    );
    const env = allRealEnv();
    env.NEXT_PUBLIC_SITE_URL = "";
    expect(findUnresolvedPlaceholders(env)).toContain("NEXT_PUBLIC_SITE_URL");
  });

  it("passes when every placeholder is replaced with a real value", () => {
    expect(findUnresolvedPlaceholders(allRealEnv())).toEqual([]);
    expect(() => assertProductionConfig(allRealEnv())).not.toThrow();
  });

  it("throws and names the unresolved keys", () => {
    const env = allRealEnv();
    env.NEXT_PUBLIC_WHATSAPP_PHONE = PLACEHOLDERS.NEXT_PUBLIC_WHATSAPP_PHONE;
    env.APPLICATION_ENDPOINT = PLACEHOLDERS.APPLICATION_ENDPOINT;
    expect(() => assertProductionConfig(env)).toThrow(
      /NEXT_PUBLIC_WHATSAPP_PHONE/,
    );
    expect(() => assertProductionConfig(env)).toThrow(/APPLICATION_ENDPOINT/);
  });
});
