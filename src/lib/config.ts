/**
 * Credalia — centralized runtime configuration.
 *
 * Every business value flagged ⚠️ in the design handoff README is sourced from
 * the environment here and NOWHERE ELSE. Components import from this module;
 * they never hardcode a value.
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
  "NEXT_PUBLIC_CORE_API_URL",
] as const;

export type PlaceholderKey = (typeof PLACEHOLDER_KEYS)[number];

/** Prototype stand-ins — dev fallbacks AND production-guard sentinels. */
export const PLACEHOLDERS: Record<PlaceholderKey, string> = {
  NEXT_PUBLIC_WHATSAPP_PHONE: "15556589627",
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
  NEXT_PUBLIC_CORE_API_URL: "https://example.invalid",
};

type Env = Record<string, string | undefined>;

/**
 * NOTE on the `read*` helpers below: they take the ALREADY-accessed env value
 * (`value`), not a key to look up dynamically. This is required for Next.js to
 * inline NEXT_PUBLIC_ vars into the client bundle — its compiler only replaces
 * literal `process.env.NEXT_PUBLIC_X` expressions, never a dynamic/computed
 * lookup like `process.env[key]`. Every call site below must therefore pass
 * `process.env.NEXT_PUBLIC_X` literally. (Server-only keys, e.g.
 * APPLICATION_ENDPOINT/LANDING_API_KEY, aren't bundled client-side so this
 * doesn't matter for them, but the same call pattern is used for consistency.)
 */

function read(key: PlaceholderKey, value: string | undefined): string {
  return value && value.length > 0 ? value : PLACEHOLDERS[key];
}

function readNum(value: string | undefined, fallback: number): number {
  if (!value || value.length === 0) return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function readStr(value: string | undefined, fallback: string): string {
  return value && value.length > 0 ? value : fallback;
}

function readStrList(value: string | undefined, fallback: string[]): string[] {
  if (!value || value.trim().length === 0) return fallback;
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

function readNumList(value: string | undefined, fallback: number[]): number[] {
  if (!value || value.trim().length === 0) return fallback;
  const parsed = value.split(",").map((s) => Number(s.trim())).filter(Number.isFinite);
  return parsed.length > 0 ? parsed : fallback;
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
  whatsappPhone: read("NEXT_PUBLIC_WHATSAPP_PHONE", process.env.NEXT_PUBLIC_WHATSAPP_PHONE),
  siteUrl: read("NEXT_PUBLIC_SITE_URL", process.env.NEXT_PUBLIC_SITE_URL),
  company: {
    legalName: read("NEXT_PUBLIC_COMPANY_LEGAL_NAME", process.env.NEXT_PUBLIC_COMPANY_LEGAL_NAME),
    nit: read("NEXT_PUBLIC_COMPANY_NIT", process.env.NEXT_PUBLIC_COMPANY_NIT),
    address: read("NEXT_PUBLIC_COMPANY_ADDRESS", process.env.NEXT_PUBLIC_COMPANY_ADDRESS),
    contactPhone: read("NEXT_PUBLIC_CONTACT_PHONE", process.env.NEXT_PUBLIC_CONTACT_PHONE),
  },

  /** Brand display name — used in nav, footer, legal pages, WhatsApp messages, etc. */
  brandName: readStr(process.env.NEXT_PUBLIC_BRAND_NAME, "Credalia"),

  /** Contact email shown in footer. */
  contactEmail: readStr(process.env.NEXT_PUBLIC_CONTACT_EMAIL, "hola@credalia.co"),

  /** Contact hours shown in footer. */
  contactHours: readStr(process.env.NEXT_PUBLIC_CONTACT_HOURS, "Lun a Vie, 8:00–18:00"),

  /** Regulator display name (e.g. "Superintendencia Financiera de Colombia"). */
  regulatorName: readStr(process.env.NEXT_PUBLIC_REGULATOR_NAME, "Superintendencia Financiera de Colombia"),

  /** Short regulator name (e.g. "Superfinanciera"). */
  regulatorShortName: readStr(process.env.NEXT_PUBLIC_REGULATOR_SHORT_NAME, "Superfinanciera"),

  social: {
    facebook: read("NEXT_PUBLIC_SOCIAL_FACEBOOK", process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK),
    instagram: read("NEXT_PUBLIC_SOCIAL_INSTAGRAM", process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM),
    linkedin: read("NEXT_PUBLIC_SOCIAL_LINKEDIN", process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN),
    youtube: read("NEXT_PUBLIC_SOCIAL_YOUTUBE", process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE),
  },
  /** Server-only: where app/api/application forwards the submitted application. */
  applicationEndpoint: read("APPLICATION_ENDPOINT", process.env.APPLICATION_ENDPOINT),
  /**
   * Public: Core's base API URL. Used client-side by the simulator to fetch
   * `GET /api/v1/sessions/rates-config` on mount (no secret required — public
   * pricing-config read). Falls back to the static `credit`/`simulator`
   * values below if the fetch fails.
   */
  coreApiUrl: read("NEXT_PUBLIC_CORE_API_URL", process.env.NEXT_PUBLIC_CORE_API_URL),
  /**
   * Server-only: shared static secret sent as `X-Landing-Api-Key` when
   * forwarding to Core's `POST /api/v1/intake/web-lead`. Not a placeholder
   * gated by the production guard — an empty value simply fails auth on
   * Core's side, which is safe-by-default for a prototype deploy.
   */
  landingApiKey: readStr(process.env.LANDING_API_KEY, ""),
  /**
   * Gates the "Vigilados por Superfinanciera" / "Entidad vigilada" claims.
   * Compliance-sensitive: the seal and regulator copy render ONLY when this is
   * explicitly "true". Defaults to false (claim hidden) until legal signs off.
   */
  regulatorVerified: process.env.NEXT_PUBLIC_REGULATOR_VERIFIED === "true",

  /** --- Simulator / product parameters --- */
  simulator: {
    amountMin: readNum(process.env.NEXT_PUBLIC_SIM_AMOUNT_MIN, 50000),
    amountMax: readNum(process.env.NEXT_PUBLIC_SIM_AMOUNT_MAX, 1000000),
    amountStep: readNum(process.env.NEXT_PUBLIC_SIM_AMOUNT_STEP, 10000),
    amountStepBig: readNum(process.env.NEXT_PUBLIC_SIM_AMOUNT_STEP_BIG, 50000),
    defaultAmount: readNum(process.env.NEXT_PUBLIC_SIM_DEFAULT_AMOUNT, 500000),
    defaultTerm: readNum(process.env.NEXT_PUBLIC_SIM_DEFAULT_TERM, 12),
    /** Comma-separated term options in months. */
    termOptions: readNumList(process.env.NEXT_PUBLIC_SIM_TERM_OPTIONS, [3, 6, 9, 12, 18, 24]),
  },

  /** --- Credit rate (interim — will come from Credalia dashboard API) --- */
  credit: {
    /** Monthly interest rate as decimal (e.g. 0.026 = 2.6%). */
    monthlyRate: readNum(process.env.NEXT_PUBLIC_CREDIT_MONTHLY_RATE, 0.026),
    /** Eligibility: small-amount threshold below which long terms aren't offered. */
    smallAmountThreshold: readNum(process.env.NEXT_PUBLIC_CREDIT_SMALL_AMOUNT_THRESHOLD, 200000),
    /** Eligibility: max term (months) for amounts below smallAmountThreshold. */
    smallAmountMaxTerm: readNum(process.env.NEXT_PUBLIC_CREDIT_SMALL_AMOUNT_MAX_TERM, 18),
    /** Eligibility: high-amount threshold above which a minimum term applies. */
    highAmountThreshold: readNum(process.env.NEXT_PUBLIC_CREDIT_HIGH_AMOUNT_THRESHOLD, 800000),
    /** Eligibility: min term (months) for amounts above highAmountThreshold. */
    highAmountMinTerm: readNum(process.env.NEXT_PUBLIC_CREDIT_HIGH_AMOUNT_MIN_TERM, 6),
  },

  /** --- Application form options --- */
  application: {
    /** Comma-separated bank names for the bank dropdown. */
    banks: readStrList(
      process.env.NEXT_PUBLIC_APPLICATION_BANKS,
      ["Bancolombia", "Davivienda", "BBVA", "Banco de Bogotá", "Nequi", "Daviplata"],
    ),
    /** Comma-separated employment types for the employment dropdown. */
    employmentTypes: readStrList(
      process.env.NEXT_PUBLIC_APPLICATION_EMPLOYMENT_TYPES,
      ["Empleado", "Independiente", "Pensionado"],
    ),
  },

  /** --- Brand colors (CSS hex, used for manifest/theme-color) --- */
  colors: {
    navy: readStr(process.env.NEXT_PUBLIC_COLOR_NAVY, "#0d2a5e"),
    orange: readStr(process.env.NEXT_PUBLIC_COLOR_ORANGE, "#f5601b"),
    green: readStr(process.env.NEXT_PUBLIC_COLOR_GREEN, "#1e9e55"),
  },

  /** --- Disbursement time claim (e.g. "24 horas"). Empty = no claim shown (compliance-safe). --- */
  disbursementTime: readStr(process.env.NEXT_PUBLIC_DISBURSEMENT_TIME, ""),

  /** --- GTM/GA4 container ID (optional — if set, the GTM script is loaded) --- */
  gtmId: readStr(process.env.NEXT_PUBLIC_GTM_ID, ""),
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

/** Runtime warning if placeholder rate is detected in production. */
if (
  process.env.NODE_ENV === "production" &&
  typeof window !== "undefined" &&
  config.credit.monthlyRate === 0.026 &&
  process.env.NEXT_PUBLIC_CREDALIA_ALLOW_PLACEHOLDERS !== "true"
) {
  console.warn(
    "⚠️ Credalia: running in production with the placeholder monthly rate (2.6%). " +
    "Set NEXT_PUBLIC_CREDIT_MONTHLY_RATE to the real value."
  );
}
