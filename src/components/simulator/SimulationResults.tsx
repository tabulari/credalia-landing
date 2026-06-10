'use client';

import { useEffect, useRef } from 'react';
import { fmtCOP, fmtPct, type Frequency } from '@/lib/credit';
import { CalendarIcon, LightningIcon, HomeIcon, ClockIcon, HelpIcon } from '../icons';

interface SimData {
  payment: number;
  amount: number;
  term: number;
  periodRate: number;
  ea: number;
  totalCost: number;
  unit: string;
}

export function SimulationResults({ sim, frequency }: { sim: SimData; frequency: Frequency }) {
  const paymentRef = useRef<HTMLDivElement>(null);
  const prevPayment = useRef(sim.payment);

  useEffect(() => {
    const changed = sim.payment !== prevPayment.current;
    prevPayment.current = sim.payment;
    if (!changed) return;
    const el = paymentRef.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || document.hidden) return;
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
    const t = setTimeout(() => el.classList.remove('flash'), 280);
    return () => clearTimeout(t);
  }, [sim.payment]);

  const rateLabel = frequency === 'biweekly' ? '% q.' : '% m. v.';
  const eaRateLabel = frequency === 'biweekly' ? 'q.' : 'm. v.';

  return (
    <div className="mt-8 pt-6 border-t border-[var(--border-2)]">
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
        <div className="flex-shrink-0">
          <p className="text-xs font-semibold text-muted-2 mb-1">Tu cuota estimada</p>
          <div ref={paymentRef} className="font-extrabold text-navy leading-none" style={{ letterSpacing: '-0.03em' }}>
            <span className="text-2xl">$</span><span className="text-4xl sm:text-5xl">{fmtCOP(sim.payment)}</span> <span className="text-base font-semibold text-muted-2">{sim.unit}</span>
          </div>
          <span className="inline-flex items-center gap-1.5 mt-3 text-green-ink font-bold text-sm">
            <LightningIcon size={13} className="text-green" />
            Respuesta rápida
          </span>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-x-5 gap-y-4 content-start">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-2 mb-0.5">
                <CalendarIcon size={14} className="text-muted-2" />
                Monto solicitado
              </div>
              <div className="text-base font-bold text-navy-ink">{`$${fmtCOP(sim.amount)}`}</div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-2 mb-0.5">
                <CalendarIcon size={14} className="text-muted-2" />
                Plazo seleccionado
              </div>
              <div className="text-base font-bold text-navy-ink">{`${sim.term} meses`}</div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-2 mb-0.5">
                <HomeIcon size={14} className="text-muted-2" />
                <span>Tasa estimada</span>
                <span className="group relative inline-flex items-center cursor-help">
                  <HelpIcon size={14} className="text-muted-2 hover:text-navy transition-colors ml-0.5 -mt-0.5" />
                  <span className="pointer-events-none absolute bottom-full left-0 sm:left-1/2 sm:-translate-x-1/2 mb-2 w-48 sm:w-64 scale-95 opacity-0 rounded-lg bg-navy-ink p-2.5 text-center text-[11px] font-normal leading-normal text-white shadow-lg transition-all duration-150 group-hover:scale-100 group-hover:opacity-100 z-50 normal-case">
                    Tasa estimada {fmtPct(sim.periodRate, 1)}% {eaRateLabel} ⇄ equivalente a {fmtPct(sim.ea, 2)}% E.A.
                    <span className="absolute top-full left-1.5 sm:left-1/2 sm:-translate-x-1/2 border-4 border-transparent border-t-navy-ink" />
                  </span>
                </span>
              </div>
              <div className="text-base font-bold text-navy-ink">{fmtPct(sim.periodRate, 1) + rateLabel}</div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-2 mb-0.5">
                <ClockIcon size={14} className="text-muted-2" />
                <span>Costo total estimado</span>
                <span className="group relative inline-flex items-center cursor-help">
                  <HelpIcon size={14} className="text-muted-2 hover:text-navy transition-colors ml-0.5 -mt-0.5" />
                  <span className="pointer-events-none absolute bottom-full right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 mb-2 w-48 sm:w-64 scale-95 opacity-0 rounded-lg bg-navy-ink p-2.5 text-center text-[11px] font-normal leading-normal text-white shadow-lg transition-all duration-150 group-hover:scale-100 group-hover:opacity-100 z-50 normal-case">
                    Esta simulación es aproximada y no representa aprobación ni oferta definitiva. Las condiciones finales dependen de la validación de tu solicitud.
                    <span className="absolute top-full right-1.5 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 border-4 border-transparent border-t-navy-ink" />
                  </span>
                </span>
              </div>
              <div className="text-base font-bold text-navy-ink">{`$${fmtCOP(sim.totalCost)}`}</div>
            </div>
        </div>
      </div>
    </div>
  );
}
