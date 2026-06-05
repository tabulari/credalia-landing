"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  calculatePayment,
  type Frequency,
  type Simulation,
} from "@/lib/credit";

/**
 * Shared simulator store (ported from the prototype's window.Credalia bridge).
 * `useSimulator()` is the single source of truth read by the Simulator island,
 * the sticky payment bar, the apply modal (which freezes a snapshot on open),
 * the resume nudge, and the WhatsApp links.
 */

export const AMOUNT_MIN = 50000;
export const AMOUNT_MAX = 1000000;
export const AMOUNT_STEP = 10000; // slider granularity
export const AMOUNT_STEP_BIG = 50000; // ± stepper jump

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

export function SimulatorProvider({ children }: { children: React.ReactNode }) {
  const [amount, setAmountState] = useState(500000);
  const [term, setTerm] = useState(12);
  const [frequency, setFrequency] = useState<Frequency>("monthly");

  const setAmount = useCallback((value: number, round = true) => {
    setAmountState(round ? clampRoundAmount(value) : clampAmount(value));
  }, []);

  const sim = useMemo(
    () => calculatePayment(amount, term, frequency),
    [amount, term, frequency],
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
