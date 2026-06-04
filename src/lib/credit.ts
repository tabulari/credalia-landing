/**
 * Credalia — isolated credit logic (PURE).
 *
 * Ported verbatim from the design prototype `app.js` (sections 1 & 2). All
 * credit math + eligibility rules live here and nowhere else, so the real
 * pricing engine can be swapped in without touching any UI. Keep the
 * signatures and return shapes stable.
 *
 * ⚠️ PLACEHOLDER pricing/eligibility — `MONTHLY_RATE` and the
 * `validateApplication` thresholds are illustrative. Replace with Credalia's
 * real product matrix.
 *
 * Internal identifiers are English; user-facing strings (the eligibility
 * `message` and the display `unit` "/mes" · "/quincena") stay in Spanish.
 */

export type Frequency = "monthly" | "biweekly";

export interface Simulation {
  amount: number;
  term: number; // months
  frequency: Frequency;
  payment: number; // COP per period (rounded)
  totalCost: number; // COP (= rounded payment × nPeriods — matters for display parity)
  periodRate: number; // decimal, per period
  monthlyRate: number; // decimal, monthly
  ea: number; // decimal, effective annual (E.A.)
  nPeriods: number;
  unit: "/mes" | "/quincena";
  valid: boolean; // false when the amount/term combo isn't offered
  message: string; // guidance shown to the user when !valid
}

export interface Validity {
  ok: boolean;
  message: string;
}

/**
 * Eligibility / constraint rules. Returns { ok, message } — message is shown to
 * the user and the apply CTA is disabled while ok === false.
 *
 * ⚠️ PLACEHOLDER RULES — replace thresholds with Credalia's real product matrix.
 */
export function validateApplication(
  amount: number,
  termMonths: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _frequency: Frequency,
): Validity {
  // Example rule 1: small amounts aren't offered on long terms.
  if (amount < 200000 && termMonths >= 18) {
    return {
      ok: false,
      message:
        "Este monto no aplica para plazos de 18 meses o más. Reduce el plazo o aumenta el monto.",
    };
  }
  // Example rule 2: high amounts require a minimum term.
  if (amount > 800000 && termMonths < 6) {
    return {
      ok: false,
      message:
        "Para montos superiores a $800.000 el plazo mínimo es de 6 meses.",
    };
  }
  return { ok: true, message: "" };
}

export function calculatePayment(
  amount: number,
  termMonths: number,
  frequency: Frequency,
): Simulation {
  // ⚠️ Placeholder rate. Replace with the real pricing engine.
  const MONTHLY_RATE = 0.026; // 2,6% m. v.
  const isBiweekly = frequency === "biweekly";

  const periodsPerMonth = isBiweekly ? 2 : 1;
  const nPeriods = termMonths * periodsPerMonth;
  const periodRate = isBiweekly ? MONTHLY_RATE / 2 : MONTHLY_RATE;

  // Standard amortized payment: P * i / (1 - (1+i)^-n)
  const factor = Math.pow(1 + periodRate, -nPeriods);
  const payment = Math.round((amount * periodRate) / (1 - factor));

  const totalCost = payment * nPeriods; // derived from the ROUNDED payment (display parity)
  const ea = Math.pow(1 + MONTHLY_RATE, 12) - 1; // annual equivalent
  const validity = validateApplication(amount, termMonths, frequency);

  return {
    amount,
    term: termMonths,
    frequency,
    payment,
    totalCost,
    periodRate, // decimal, per period
    monthlyRate: MONTHLY_RATE, // decimal, monthly
    ea, // decimal, annual
    nPeriods,
    unit: isBiweekly ? "/quincena" : "/mes",
    valid: validity.ok, // false when the combo is not offered
    message: validity.message, // guidance to show the user
  };
}

/* ---------- FORMATTING HELPERS (presentation only) ---------- */

/**
 * Colombian: thousands separated by ".", decimals by ",".
 * The prototype replaced U+00A0 with "."; `\s` generalizes that to every
 * group-separator variant ICU may emit (space, U+00A0, U+202F) so output is
 * stable across Node/ICU builds. On this runtime es-CO already groups with
 * ".", making the replace a no-op.
 */
export function fmtCOP(n: number): string {
  return Math.round(n).toLocaleString("es-CO").replace(/\s/g, ".");
}

export function fmtPct(decimal: number, dec: number): string {
  return (decimal * 100).toFixed(dec).replace(".", ",");
}
