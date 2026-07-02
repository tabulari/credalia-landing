"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  calculatePayment,
  type Frequency,
  type RateConfig,
  type Simulation,
} from "@/lib/credit";
import { config } from "@/lib/config";

/**
 * Shared simulator store (ported from the prototype's window.Credalia bridge).
 * `useSimulator()` is the single source of truth read by the Simulator island,
 * the sticky payment bar, the apply modal (which freezes a snapshot on open),
 * the resume nudge, and the WhatsApp links.
 *
 * All numeric params come from config (env-driven).
 */

export const AMOUNT_MIN = config.simulator.amountMin;
export const AMOUNT_MAX = config.simulator.amountMax;
export const AMOUNT_STEP = config.simulator.amountStep;
export const AMOUNT_STEP_BIG = config.simulator.amountStepBig;

export const clampAmount = (v: number): number =>
  Math.max(AMOUNT_MIN, Math.min(AMOUNT_MAX, v));

export const clampRoundAmount = (v: number): number =>
  clampAmount(Math.round(v / AMOUNT_STEP) * AMOUNT_STEP);

interface SimulatorStore {
  amount: number;
  term: number;
  frequency: Frequency;
  sim: Simulation;
  /** Clamp to [MIN,MAX]; `round` also snaps to AMOUNT_STEP (slider/stepper/blur). */
  setAmount: (value: number, round?: boolean) => void;
  setTerm: (term: number) => void;
  setFrequency: (frequency: Frequency) => void;
}

const SimulatorContext = createContext<SimulatorStore | null>(null);

/**
 * Shape of Core's `GET /api/v1/sessions/rates-config` (RatesConfigResponse).
 * Only `monthly_interest_rate` is consumed here — the eligibility thresholds
 * (small/high amount rules) have no Core counterpart and stay static from
 * config.credit. Numeric fields arrive as strings (Python Decimal).
 */
interface RatesConfigResponse {
  monthly_interest_rate: string;
}

function parseMonthlyRate(data: unknown): number | null {
  if (typeof data !== "object" || data === null) return null;
  const raw = (data as Partial<RatesConfigResponse>).monthly_interest_rate;
  if (typeof raw !== "string") return null;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function SimulatorProvider({ children }: { children: React.ReactNode }) {
  const [amount, setAmountState] = useState(config.simulator.defaultAmount);
  const [term, setTerm] = useState(config.simulator.defaultTerm);
  const [frequency, setFrequency] = useState<Frequency>("monthly");

  // Live monthly rate from Core, falling back to config.credit (which also
  // supplies the eligibility thresholds Core doesn't provide) if the fetch
  // fails or returns a bad shape.
  const [rates, setRates] = useState<RateConfig>(config.credit);
  useEffect(() => {
    let cancelled = false;
    fetch(`${config.coreApiUrl}/api/v1/sessions/rates-config`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("bad status"))))
      .then((data: unknown) => {
        const monthlyRate = parseMonthlyRate(data);
        if (!cancelled && monthlyRate !== null) {
          setRates((prev) => ({ ...prev, monthlyRate }));
        }
      })
      .catch(() => {
        // Silent — static config.credit fallback (already set) stays in effect.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setAmount = useCallback((value: number, round = true) => {
    setAmountState(round ? clampRoundAmount(value) : clampAmount(value));
  }, []);

  // Settle the amount before deriving sim. Dragging the slider fires every ~15ms;
  // rendering every change (~90/sec) reads as an odometer not a calculation.
  // Debounce to a calm settled value used for all downstream displays (payment,
  // total cost, validity, sticky bar, etc.) — keeps them all consistent and
  // responsive, not rolling.
  const [settledAmount, setSettledAmount] = useState(config.simulator.defaultAmount);
  useEffect(() => {
    const t = setTimeout(() => setSettledAmount(amount), 150);
    return () => clearTimeout(t);
  }, [amount]);

  const sim = useMemo(
    () => calculatePayment(settledAmount, term, frequency, rates),
    [settledAmount, term, frequency, rates],
  );

  const value = useMemo<SimulatorStore>(
    () => ({ amount, term, frequency, sim, setAmount, setTerm, setFrequency }),
    [amount, term, frequency, sim, setAmount],
  );

  return (
    <SimulatorContext.Provider value={value}>
      {children}
    </SimulatorContext.Provider>
  );
}

export function useSimulator(): SimulatorStore {
  const ctx = useContext(SimulatorContext);
  if (!ctx)
    throw new Error("useSimulator must be used within <SimulatorProvider>");
  return ctx;
}
