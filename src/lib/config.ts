/**
 * Credalia — centralized runtime configuration.
 *
 * Every business value flagged ⚠️ in the design handoff README (WhatsApp number,
 * canonical domain, legal name, NIT, domicilio, contact phone, social URLs, and
 * the application submit endpoint) is sourced from the environment here and
 * NOWHERE ELSE. Components import from this module; they never hardcode a value.
 *
 * `PLACEHOLDERS` holds the prototype's stand-in values. They double as dev-time
 * fallbacks AND as the sentinels the production guard rejects: if any survives a
 * production build, `assertProductionConfig()` throws so we cannot ship the page
 * with fake business data. See `.env.example` for the contract.
 */

/** The ⚠️ env keys that must be replaced with real values before production. */
export const PLACEHOLDER_KEYS = [
  "NEXT_PUBLIC_WHATSAPP_PHONE",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_COMPANY_LEGAL_NAME",
  "NEXT_PUBLIC_COMPANY_NIT",
  "NEXT_PUBLIC_COMPANY_ADDRESS",
  "NEXT_PUBLIC_CONTACT_PHONE",
  "NEXT_PUBLIC_SOCIAL_FACEBOOK",
  "NEXT_PUBLIC_SOCIAL_INSTAGRAM",
  "NEXT_PUBLIC_SOCIAL_LINKEDIN",
  "NEXT_PUBLIC_SOCIAL_YOUTUBE",
  "APPLICATION_ENDPOINT",
] as const;

export type PlaceholderKey = (typeof PLACEHOLDER_KEYS)[number];

/** Prototype stand-ins — dev fallbacks AND production-guard sentinels. */
export const PLACEHOLDERS: Record<PlaceholderKey, string> = {
  NEXT_PUBLIC_WHATSAPP_PHONE: "573001234567",
  NEXT_PUBLIC_SITE_URL: "https://www.credalia.co",
  NEXT_PUBLIC_COMPANY_LEGAL_NAME: "Credalia S.A.S.",
  NEXT_PUBLIC_COMPANY_NIT: "XXX.XXX.XXX-X",
  NEXT_PUBLIC_COMPANY_ADDRESS: "Domicilio pendiente, Colombia",
  NEXT_PUBLIC_CONTACT_PHONE: "+573001234567",
  NEXT_PUBLIC_SOCIAL_FACEBOOK: "https://facebook.com/credalia",
  NEXT_PUBLIC_SOCIAL_INSTAGRAM: "https://instagram.com/credalia",
  NEXT_PUBLIC_SOCIAL_LINKEDIN: "https://www.linkedin.com/company/credalia",
  NEXT_PUBLIC_SOCIAL_YOUTUBE: "https://www.youtube.com/@credalia",
  APPLICATION_ENDPOINT: "https://example.invalid/applications",
};

type Env = Record<string, string | undefined>;

function read(key: PlaceholderKey, env: Env = process.env): string {
  const v = env[key];
  return v && v.length > 0 ? v : PLACEHOLDERS[key];
}

/**
 * Returns the ⚠️ keys whose value is missing or still equal to the placeholder.
 * Pure — accepts an injected env so the production guard can be unit-tested.
 */
export function findUnresolvedPlaceholders(env: Env = process.env): PlaceholderKey[] {
  return PLACEHOLDER_KEYS.filter((key) => {
    const v = env[key];
    return !v || v.length === 0 || v === PLACEHOLDERS[key];
  });
}

/**
 * Throws if any ⚠️ placeholder survives. Intended to run during a production
 * build so we cannot ship with fake business data. Pure/injectable for tests.
 */
export function assertProductionConfig(env: Env = process.env): void {
  const unresolved = findUnresolvedPlaceholders(env);
  if (unresolved.length > 0) {
    throw new Error(
      "Refusing to build for production: unresolved placeholder config. " +
        "Set real values for the following env vars (see .env.example):\n  - " +
        unresolved.join("\n  - "),
    );
  }
}

/** Typed, resolved configuration consumed by the app. */
export const config = {
  whatsappPhone: read("NEXT_PUBLIC_WHATSAPP_PHONE"),
  siteUrl: read("NEXT_PUBLIC_SITE_URL"),
  company: {
    legalName: read("NEXT_PUBLIC_COMPANY_LEGAL_NAME"),
    nit: read("NEXT_PUBLIC_COMPANY_NIT"),
    address: read("NEXT_PUBLIC_COMPANY_ADDRESS"),
    contactPhone: read("NEXT_PUBLIC_CONTACT_PHONE"),
  },
  social: {
    facebook: read("NEXT_PUBLIC_SOCIAL_FACEBOOK"),
    instagram: read("NEXT_PUBLIC_SOCIAL_INSTAGRAM"),
    linkedin: read("NEXT_PUBLIC_SOCIAL_LINKEDIN"),
    youtube: read("NEXT_PUBLIC_SOCIAL_YOUTUBE"),
  },
  /** Server-only: where app/api/application forwards the submitted application. */
  applicationEndpoint: read("APPLICATION_ENDPOINT"),
  /**
   * Gates the "Vigilados por Superfinanciera" / "Entidad vigilada" claims.
   * Compliance-sensitive: the seal and regulator copy render ONLY when this is
   * explicitly "true". Defaults to false (claim hidden) until legal signs off.
   */
  regulatorVerified: process.env.NEXT_PUBLIC_REGULATOR_VERIFIED === "true",
} as const;

// Fail a production build if any ⚠️ value is still a placeholder. Dev and test
// runtimes are intentionally exempt so the page renders from `.env.example`.
// Server-only: server-secret keys (e.g. APPLICATION_ENDPOINT) are never inlined
// into the client bundle, so the guard must not run in the browser.
if (
  process.env.NODE_ENV === "production" &&
  typeof window === "undefined" &&
  process.env.NEXT_PUBLIC_CREDALIA_ALLOW_PLACEHOLDERS !== "true"
) {
  assertProductionConfig();
}
