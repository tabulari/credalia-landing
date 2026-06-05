'use client';

import { useEffect, useRef, useState } from 'react';
import { fmtCOP, fmtPct, type Frequency } from '@/lib/credit';
import {
  AMOUNT_MAX,
  AMOUNT_MIN,
  AMOUNT_STEP,
  AMOUNT_STEP_BIG,
  clampAmount,
  clampRoundAmount,
  useSimulator,
} from './simulator-store';
import { ChipRadioGroup } from './ChipRadioGroup';
import { ApplyButton } from './ApplyButton';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

const TERMS = [3, 6, 9, 12, 18, 24].map((n) => ({
  value: n,
  label: `${n} meses`,
}));

const FREQUENCIES: { value: Frequency; label: string }[] = [
  { value: 'monthly', label: 'Mensual' },
  { value: 'biweekly', label: 'Quincenal' },
];

const HelpIcon = () => (
  <svg
    className="inline w-4 h-4 text-muted-2"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <path
      d="M9.5 9 a2.5 2.5 0 1 1 3.5 2.3 c-.8.4-1 .8-1 1.7 M12 17 h.01"
      strokeLinecap="round"
    />
  </svg>
);

export function Simulator() {
  const {
    amount,
    term,
    frequency,
    sim,
    setAmount,
    setTerm,
    setFrequency,
  } = useSimulator();

  const inputRef = useRef<HTMLInputElement>(null);
  const [inputText, setInputText] = useState(() => fmtCOP(amount));
  const [hint, setHint] = useState('');

  const interacted = useRef(false);
  const markInteract = (control: string) => {
    if (interacted.current) return;
    interacted.current = true;
    track('sim_interact', { control });
  };

  const paymentRef = useRef<HTMLDivElement>(null);
  const prevPayment = useRef(sim.payment);
  useEffect(() => {
    const changed = sim.payment !== prevPayment.current;
    prevPayment.current = sim.payment;
    if (!changed) return;
    const el = paymentRef.current;
    if (!el) return;
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reduced || document.hidden) return;
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
    const t = setTimeout(() => el.classList.remove('flash'), 280);
    return () => clearTimeout(t);
  }, [sim.payment]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    markInteract('amount');
    const digits = e.target.value.replace(/\D/g, '');
    setInputText(digits ? fmtCOP(parseInt(digits, 10)) : '');
    if (!digits) {
      setHint(
        `Ingresa un monto entre $${fmtCOP(AMOUNT_MIN)} y $${fmtCOP(AMOUNT_MAX)}.`,
      );
      return;
    }
    const raw = parseInt(digits, 10);
    if (raw > AMOUNT_MAX)
      setHint(`El monto máximo es $${fmtCOP(AMOUNT_MAX)}.`);
    else if (raw < AMOUNT_MIN)
      setHint(`El monto mínimo es $${fmtCOP(AMOUNT_MIN)}.`);
    else setHint('');
    setAmount(clampAmount(raw), false);
  };

  const handleInputBlur = () => {
    setHint('');
    const v = clampRoundAmount(amount || AMOUNT_MIN);
    setAmount(v, true);
    setInputText(fmtCOP(v));
  };

  const handleSliderChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    markInteract('slider');
    setHint('');
    const v = Number(e.target.value);
    setAmount(v, true);
    setInputText(fmtCOP(clampRoundAmount(v)));
  };

  const bump = (dir: -1 | 1) => {
    setHint('');
    const v = clampRoundAmount(
      (amount || AMOUNT_MIN) + dir * AMOUNT_STEP_BIG,
    );
    setAmount(v, true);
    setInputText(fmtCOP(v));
  };

  const focusExact = () => {
    inputRef.current?.focus();
    inputRef.current?.select();
  };

  const pct =
    ((amount - AMOUNT_MIN) / (AMOUNT_MAX - AMOUNT_MIN)) * 100;
  const rateLabel = frequency === 'biweekly' ? '% q.' : '% m. v.';
  const eaRateLabel = frequency === 'biweekly' ? 'q.' : 'm. v.';

  return (
    <div
      id="simulator"
      className="reveal d1 bg-card border border-border rounded-2xl p-6 shadow-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-extrabold text-navy">Simulador de crédito</h3>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-ink bg-green-tint rounded-full px-2.5 py-1">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e9e55" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2 L20 5 V11 C20 16.5 16.5 20.5 12 22 C7.5 20.5 4 16.5 4 11 V5 Z" />
            <path d="M9 12 l2 2 4-4.5" />
          </svg>
          Sin afectar tu historial
        </span>
      </div>

      {/* Amount input */}
      <p className="text-sm font-semibold text-foreground mb-2">Monto solicitado</p>
      <div
        className={cn(
          'flex items-center gap-2 rounded-xl border bg-white px-3 py-2',
          hint ? 'border-orange' : 'border-border',
        )}
      >
        <button
          type="button"
          aria-label="Disminuir monto"
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-border text-muted hover:bg-bg-soft disabled:opacity-40"
          onClick={() => bump(-1)}
          disabled={amount <= AMOUNT_MIN}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M5 12 h14" />
          </svg>
        </button>
        <div className="flex items-center gap-1 flex-1 min-w-0">
          <span className="text-muted-2 font-semibold">$</span>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={inputText}
            aria-label="Monto solicitado"
            aria-describedby="amountHint"
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className="flex-1 min-w-0 text-lg font-bold text-navy outline-none bg-transparent"
          />
        </div>
        <button
          type="button"
          aria-label="Aumentar monto"
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-border text-muted hover:bg-bg-soft disabled:opacity-40"
          onClick={() => bump(1)}
          disabled={amount >= AMOUNT_MAX}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M12 5 v14 M5 12 h14" />
          </svg>
        </button>
        <span className="text-xs font-semibold text-muted-2 ml-1">COP</span>
        <span className="w-px h-6 bg-border mx-1" />
        <button
          type="button"
          className="text-xs font-semibold text-navy hover:underline"
          onClick={focusExact}
        >
          Ingresar monto exacto
        </button>
      </div>
      <p
        className={cn(
          'text-xs font-medium transition-all',
          hint ? 'text-orange mt-1.5 h-auto' : 'h-0 overflow-hidden',
        )}
        id="amountHint"
        role="status"
        aria-live="polite"
      >
        {hint}
      </p>

      {/* Slider */}
      <div className="mt-3">
        <input
          type="range"
          min={AMOUNT_MIN}
          max={AMOUNT_MAX}
          step={AMOUNT_STEP}
          value={amount}
          aria-label="Selector de monto"
          aria-valuetext={`$${fmtCOP(amount)} COP`}
          onChange={handleSliderChange}
          className="w-full h-2 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-green [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--green) 0% ${pct}%, var(--border) ${pct}% 100%)`,
          }}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-2">$50.000</span>
          <span className="text-xs text-muted-2">$1.000.000</span>
        </div>
      </div>

      {/* Term chips */}
      <div className="mt-5">
        <p className="text-sm font-semibold text-foreground mb-2" id="plazoLabel">
          Elige el plazo <HelpIcon />
        </p>
        <ChipRadioGroup
          className="flex flex-wrap gap-2"
          ariaLabelledBy="plazoLabel"
          checkBefore
          options={TERMS}
          value={term}
          onChange={(v) => {
            markInteract('term');
            setTerm(v);
          }}
        />
      </div>

      {/* Frequency chips */}
      <div className="mt-5">
        <p className="text-sm font-semibold text-foreground mb-2" id="freqLabel">
          Frecuencia de pago <HelpIcon />
        </p>
        <ChipRadioGroup
          className="flex gap-2"
          ariaLabelledBy="freqLabel"
          options={FREQUENCIES}
          value={frequency}
          onChange={(v) => {
            markInteract('frequency');
            setFrequency(v);
          }}
        />
      </div>

      {/* Results */}
      <div className="mt-6 p-5 bg-bg-soft rounded-xl">
        <p className="text-xs font-semibold text-muted-2 uppercase tracking-wide">Tu cuota estimada</p>
        <div ref={paymentRef} className="text-[40px] font-extrabold text-navy leading-tight tracking-tight">
          {`$${fmtCOP(sim.payment)}`} <span className="text-sm font-semibold text-muted-2">{sim.unit}</span>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-ink bg-green-tint rounded-full px-2 py-0.5 mt-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#1e9e55">
            <path d="M13 2 L4 14 h6 l-1 8 9-12 h-6 z" />
          </svg>
          Respuesta rápida
        </span>

        <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
          <div>
            <div className="text-muted-2 text-xs font-medium">Monto solicitado</div>
            <div className="font-bold text-foreground">{`$${fmtCOP(sim.amount)}`}</div>
          </div>
          <div>
            <div className="text-muted-2 text-xs font-medium">Plazo seleccionado</div>
            <div className="font-bold text-foreground">{`${sim.term} meses`}</div>
          </div>
          <div>
            <div className="text-muted-2 text-xs font-medium">Tasa estimada</div>
            <div className="font-bold text-foreground">{fmtPct(sim.periodRate, 1) + rateLabel}</div>
          </div>
          <div>
            <div className="text-muted-2 text-xs font-medium">Costo total estimado</div>
            <div className="font-bold text-foreground">{`$${fmtCOP(sim.totalCost)}`}</div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-3">
          Tasa estimada <span className="font-semibold">{`${fmtPct(sim.periodRate, 1)}% ${eaRateLabel}`}</span>{' '}
          <span>⇄</span> equivalente a <span className="font-semibold">{fmtPct(sim.ea, 2) + '%'}</span> E.A.
        </p>
        <p className="text-xs text-muted-foreground mt-1 italic">
          Esta simulación es aproximada y no representa aprobación ni oferta definitiva. Las condiciones finales dependen de la validación de tu solicitud.
        </p>
      </div>

      {/* Reassurance */}
      <div className="flex gap-3 mt-5">
        <span className="inline-flex items-center gap-1.5 text-xs text-green-ink font-medium">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2 L20 5 V11 C20 16.5 16.5 20.5 12 22 C7.5 20.5 4 16.5 4 11 V5 Z" />
            <path d="M9 12 l2 2 4-4.5" />
          </svg>
          No afecta tu historial
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-2 font-medium">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M9.5 9.2 a2.4 2.4 0 0 1 4.8.3 c0 1.5-2.5 1.7-2.5 3 M12 17 h.01" />
          </svg>
          Costo total claro, sin sorpresas
        </span>
      </div>

      {/* Apply CTA */}
      <div className="mt-5">
        <p
          className={cn(
            'text-sm text-error font-medium transition-all',
            sim.valid ? 'h-0 overflow-hidden' : 'h-auto mb-2',
          )}
          role="alert"
          aria-live="polite"
        >
          {sim.valid ? '' : sim.message}
        </p>
        <ApplyButton
          origin="simulator"
          variant="default"
          size="block"
          disabled={!sim.valid}
        >
          Solicitar este crédito →
        </ApplyButton>
      </div>
    </div>
  );
}
