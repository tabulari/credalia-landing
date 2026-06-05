"use client";

import { useEffect, useRef, useState } from "react";
import { fmtCOP, fmtPct, type Frequency } from "@/lib/credit";
import {
  AMOUNT_MAX,
  AMOUNT_MIN,
  AMOUNT_STEP,
  AMOUNT_STEP_BIG,
  clampAmount,
  clampRoundAmount,
  useSimulator,
} from "./simulator-store";
import { ChipRadioGroup } from "./ChipRadioGroup";
import { ApplyButton } from "./ApplyButton";

const TERMS = [3, 6, 9, 12, 18, 24].map((n) => ({
  value: n,
  label: `${n} meses`,
}));

const FREQUENCIES: { value: Frequency; label: string }[] = [
  { value: "monthly", label: "Mensual" },
  { value: "biweekly", label: "Quincenal" },
];

const HelpIcon = () => (
  <svg className="q" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.5 9 a2.5 2.5 0 1 1 3.5 2.3 c-.8.4-1 .8-1 1.7 M12 17 h.01" strokeLinecap="round" />
  </svg>
);

export function Simulator() {
  const { amount, term, frequency, sim, setAmount, setTerm, setFrequency } =
    useSimulator();

  const inputRef = useRef<HTMLInputElement>(null);
  const [inputText, setInputText] = useState(() => fmtCOP(amount));
  const [hint, setHint] = useState("");

  // ---- exact-payment flash (no digit rolling); respects reduced-motion ----
  const paymentRef = useRef<HTMLDivElement>(null);
  const prevPayment = useRef(sim.payment);
  useEffect(() => {
    const changed = sim.payment !== prevPayment.current;
    prevPayment.current = sim.payment;
    if (!changed) return;
    const el = paymentRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || document.hidden) return;
    el.classList.remove("flash");
    void el.offsetWidth; // restart the transition
    el.classList.add("flash");
    const t = setTimeout(() => el.classList.remove("flash"), 280);
    return () => clearTimeout(t);
  }, [sim.payment]);

  // ---- monto input: mask, empty/out-of-range hint, compute with clamped value ----
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    setInputText(digits ? fmtCOP(parseInt(digits, 10)) : "");
    if (!digits) {
      // empty: keep the last valid result on screen, just prompt for a value
      setHint(`Ingresa un monto entre $${fmtCOP(AMOUNT_MIN)} y $${fmtCOP(AMOUNT_MAX)}.`);
      return;
    }
    const raw = parseInt(digits, 10);
    if (raw > AMOUNT_MAX) setHint(`El monto máximo es $${fmtCOP(AMOUNT_MAX)}.`);
    else if (raw < AMOUNT_MIN) setHint(`El monto mínimo es $${fmtCOP(AMOUNT_MIN)}.`);
    else setHint("");
    // compute with a clamped value so results never show garbage / $0
    setAmount(clampAmount(raw), false);
  };

  const handleInputBlur = () => {
    setHint("");
    const v = clampRoundAmount(amount || AMOUNT_MIN);
    setAmount(v, true);
    setInputText(fmtCOP(v));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHint("");
    const v = Number(e.target.value);
    setAmount(v, true);
    setInputText(fmtCOP(clampRoundAmount(v)));
  };

  const bump = (dir: -1 | 1) => {
    setHint("");
    const v = clampRoundAmount((amount || AMOUNT_MIN) + dir * AMOUNT_STEP_BIG);
    setAmount(v, true);
    setInputText(fmtCOP(v));
  };

  const focusExact = () => {
    inputRef.current?.focus();
    inputRef.current?.select();
  };

  const pct = ((amount - AMOUNT_MIN) / (AMOUNT_MAX - AMOUNT_MIN)) * 100;
  const rateLabel = frequency === "biweekly" ? "% q." : "% m. v.";
  const eaRateLabel = frequency === "biweekly" ? "% q." : "%";

  return (
    <div className="sim reveal d1" id="simulator">
      <div className="sim-head">
        <h3 className="section-h">Simulador de crédito</h3>
        <span className="tag">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e9e55" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2 L20 5 V11 C20 16.5 16.5 20.5 12 22 C7.5 20.5 4 16.5 4 11 V5 Z" />
            <path d="M9 12 l2 2 4-4.5" />
          </svg>{" "}
          Sin afectar tu historial
        </span>
      </div>

      {/* monto */}
      <p className="field-label">Monto solicitado</p>
      <div className={`amount-box${hint ? " out-of-range" : ""}`}>
        <button
          className="step-btn"
          id="amountMinus"
          type="button"
          aria-label="Disminuir monto"
          onClick={() => bump(-1)}
          disabled={amount <= AMOUNT_MIN}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M5 12 h14" />
          </svg>
        </button>
        <div className="left">
          <span className="cur">$</span>
          <input
            id="amountInput"
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={inputText}
            aria-label="Monto solicitado"
            aria-describedby="amountHint"
            onChange={handleInputChange}
            onBlur={handleInputBlur}
          />
        </div>
        <button
          className="step-btn"
          id="amountPlus"
          type="button"
          aria-label="Aumentar monto"
          onClick={() => bump(1)}
          disabled={amount >= AMOUNT_MAX}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M12 5 v14 M5 12 h14" />
          </svg>
        </button>
        <span className="cop">COP</span>
        <span className="sep" />
        <span className="exact" id="exactBtn" onClick={focusExact}>
          Ingresar monto exacto
        </span>
      </div>
      <p className={`amount-hint${hint ? " show" : ""}`} id="amountHint" role="status" aria-live="polite">
        {hint}
      </p>

      <div className="slider-wrap">
        <input
          id="amountSlider"
          className="slider"
          type="range"
          min={AMOUNT_MIN}
          max={AMOUNT_MAX}
          step={AMOUNT_STEP}
          value={amount}
          aria-label="Selector de monto"
          aria-valuetext={`$${fmtCOP(amount)} COP`}
          onChange={handleSliderChange}
          style={{
            background: `linear-gradient(to right, var(--green) 0% ${pct}%, var(--border) ${pct}% 100%)`,
          }}
        />
        <div className="slider-ends">
          <span>$50.000</span>
          <span>$1.000.000</span>
        </div>
      </div>

      {/* plazo */}
      <div className="block">
        <p className="field-label" id="plazoLabel">
          Elige el plazo <HelpIcon />
        </p>
        <ChipRadioGroup
          className="chips"
          ariaLabelledBy="plazoLabel"
          checkBefore
          options={TERMS}
          value={term}
          onChange={setTerm}
        />
      </div>

      {/* frecuencia */}
      <div className="block">
        <p className="field-label" id="freqLabel">
          Frecuencia de pago <HelpIcon />
        </p>
        <ChipRadioGroup
          className="freq"
          ariaLabelledBy="freqLabel"
          options={FREQUENCIES}
          value={frequency}
          onChange={setFrequency}
        />
      </div>

      {/* result */}
      <div className="result">
        <div>
          <p className="payment-label">Tu cuota estimada</p>
          {/*
            Value is a 46px text node and only the unit is a (small) span — the
            README specifies the cuota at 46px/800. (The prototype wrapped the
            value in a span that its own `.cuota-amt span{font-size:18px}` rule
            would have shrunk; we follow the authoritative README size.)
          */}
          <div className="payment-amt" ref={paymentRef}>
            {`$${fmtCOP(sim.payment)}`} <span>{sim.unit}</span>
          </div>
          <span className="fast-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#1e9e55">
              <path d="M13 2 L4 14 h6 l-1 8 9-12 h-6 z" />
            </svg>{" "}
            Respuesta rápida
          </span>
        </div>
        <div className="detail-grid">
          <div className="detail">
            <div className="dlabel">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8693a6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7 v5 l3 2" strokeLinecap="round" />
              </svg>{" "}
              Monto solicitado
            </div>
            <div className="dval">{`$${fmtCOP(sim.amount)}`}</div>
          </div>
          <div className="detail">
            <div className="dlabel">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8693a6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M3 9 h18 M8 3 v4 M16 3 v4" strokeLinecap="round" />
              </svg>{" "}
              Plazo seleccionado
            </div>
            <div className="dval">{`${sim.term} meses`}</div>
          </div>
          <div className="detail">
            <div className="dlabel">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8693a6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 20 L20 4 M8 6 a2 2 0 1 1 -.01 0 M16 18 a2 2 0 1 1 -.01 0" strokeLinecap="round" />
              </svg>{" "}
              Tasa estimada
            </div>
            <div className="dval">{fmtPct(sim.periodRate, 1) + rateLabel}</div>
          </div>
          <div className="detail">
            <div className="dlabel">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8693a6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7 v10 M9.5 9.2 a2.4 2.4 0 0 1 4.8.3 c0 1.5-2.5 1.7-2.5 3 M14 15 a2.4 2.4 0 0 1-4.5.7" strokeLinecap="round" />
              </svg>{" "}
              Costo total estimado
            </div>
            <div className="dval">{`$${fmtCOP(sim.totalCost)}`}</div>
          </div>
          <p className="ea-line">
            Tasa estimada <span>{fmtPct(sim.periodRate, 1) + eaRateLabel}</span>{" "}
            m. v. <span>⇄</span> equivalente a{" "}
            <span>{fmtPct(sim.ea, 2) + "%"}</span> E.A.
          </p>
          <p className="disclaimer">
            Esta simulación es aproximada y no representa aprobación ni oferta
            definitiva. Las condiciones finales dependen de la validación de tu
            solicitud.
          </p>
        </div>
      </div>

      <div className="sim-reassure">
        <span className="reassure-chip">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2 L20 5 V11 C20 16.5 16.5 20.5 12 22 C7.5 20.5 4 16.5 4 11 V5 Z" />
            <path d="M9 12 l2 2 4-4.5" />
          </svg>
          No afecta tu historial
        </span>
        <span className="reassure-chip">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M9.5 9.2 a2.4 2.4 0 0 1 4.8.3 c0 1.5-2.5 1.7-2.5 3 M12 17 h.01" />
          </svg>
          Costo total claro, sin sorpresas
        </span>
      </div>
      <div className="sim-actions">
        <p className={`sim-valid-msg${sim.valid ? "" : " show"}`} id="simValidMsg" role="alert" aria-live="polite">
          {sim.valid ? "" : sim.message}
        </p>
        <ApplyButton
          origin="simulator"
          className="btn btn-navy btn-block"
          id="simApplyBtn"
          disabled={!sim.valid}
          aria-disabled={!sim.valid}
        >
          Solicitar este crédito <span className="btn-arrow">→</span>
        </ApplyButton>
      </div>
    </div>
  );
}
