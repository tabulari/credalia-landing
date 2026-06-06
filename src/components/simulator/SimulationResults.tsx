'use client';

import { useEffect, useRef } from 'react';
import { fmtCOP, fmtPct, type Frequency } from '@/lib/credit';
import { CalendarIcon, LightningIcon, HomeIcon, ClockIcon } from '../icons';

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
            <span className="text-2xl">$</span><span className="text-4xl sm:text-[42px]">{fmtCOP(sim.payment)}</span> <span className="text-base font-semibold text-muted-2">{sim.unit}</span>
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
                Tasa estimada
              </div>
              <div className="text-base font-bold text-navy-ink">{fmtPct(sim.periodRate, 1) + rateLabel}</div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-2 mb-0.5">
                <ClockIcon size={14} className="text-muted-2" />
                Costo total estimado
              </div>
              <div className="text-base font-bold text-navy-ink">{`$${fmtCOP(sim.totalCost)}`}</div>
            </div>

          <p className="col-span-2 text-sm text-muted-2 leading-snug">
            Tasa estimada{' '}
            <span className="font-semibold text-navy-ink">{`${fmtPct(sim.periodRate, 1)}% ${eaRateLabel}`}</span>{' '}
            ⇄ equivalente a{' '}
            <span className="font-semibold text-navy-ink">{fmtPct(sim.ea, 2) + '%'}</span>{' '}
            E.A.
          </p>

          <p className="col-span-2 text-xs leading-relaxed text-muted-2 italic">
            Esta simulación es aproximada y no representa aprobación ni oferta definitiva. Las condiciones finales dependen de la validación de tu solicitud.
          </p>
        </div>
      </div>
    </div>
  );
}
