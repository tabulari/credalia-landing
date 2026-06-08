'use client';

import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { fmtCOP, type Frequency } from '@/lib/credit';
import { config } from '@/lib/config';
import { useSimulator } from './simulator-store';
import { ChipRadioGroup } from './ChipRadioGroup';
import { ApplyButton } from './ApplyButton';
import { AmountInput } from './simulator/AmountInput';
import { SimulationResults } from './simulator/SimulationResults';
import { ReassuranceChips } from './simulator/ReassuranceChips';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { ShieldCheckIcon, HelpIcon as HelpIconSvg } from './icons';

const TERMS = config.simulator.termOptions.map((n) => ({
  value: n,
  label: `${n} meses`,
}));

const FREQUENCIES: { value: Frequency; label: string }[] = [
  { value: 'monthly', label: 'Mensual' },
  { value: 'biweekly', label: 'Quincenal' },
];

export function Simulator() {
  const { amount, term, frequency, sim, setAmount, setTerm, setFrequency } = useSimulator();

  const inputRef = useRef<HTMLInputElement>(null);
  const simRef = useRef<HTMLFormElement>(null);
  const [inputText, setInputText] = useState(() => fmtCOP(amount));
  const [hint, setHint] = useState('');

  const interacted = useRef(false);
  const markInteract = (control: string) => {
    if (interacted.current) return;
    interacted.current = true;
    track('sim_interact', { control });
  };

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !simRef.current) return;
    gsap.fromTo(simRef.current, {
      y: 20,
      scale: 0.98,
      autoAlpha: 0,
    }, {
      y: 0,
      scale: 1,
      autoAlpha: 1,
      duration: 0.7,
      ease: 'back.out(1.2)',
      scrollTrigger: { trigger: simRef.current, start: 'top 85%' },
    });
  }, { scope: simRef });

  const srText = `Cuota estimada: $${fmtCOP(sim.payment)} ${sim.unit}. Monto: $${fmtCOP(sim.amount)}, plazo: ${sim.term} meses.`;
  const [debouncedSr, setDebouncedSr] = useState(srText);
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSr(srText), 150);
    return () => clearTimeout(id);
  }, [srText]);

  return (
    <form ref={simRef} id="simulator" aria-label="Simulador de crédito" onSubmit={(e) => e.preventDefault()} className="bg-card border border-green/20 border-t-[3px] border-t-green/40 rounded-xl p-5 sm:p-8 shadow-[0_0_0_1px_rgba(30,158,85,0.08),0_6px_24px_rgba(13,42,94,0.07)]">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2.5">
        <h3 className="text-xl font-bold text-navy">Simulador de crédito</h3>
        <span className="border-l-2 border-green pl-3 text-xs font-semibold text-green-ink">
          <ShieldCheckIcon size={14} className="text-green mr-1 inline -mt-0.5" />
          Sin afectar tu historial
        </span>
      </div>

      <AmountInput
        amount={amount}
        setAmount={setAmount}
        inputText={inputText}
        setInputText={setInputText}
        hint={hint}
        setHint={setHint}
        inputRef={inputRef}
        markInteract={markInteract}
      />

      <div className="mt-6">
        <p className="text-sm font-semibold text-navy mb-2.5" id="plazoLabel">
          Elige el plazo <HelpIconSvg size={15} className="text-muted-2 ml-1" />
        </p>
        <ChipRadioGroup
          className="flex gap-2.5"
          ariaLabelledBy="plazoLabel"
          checkBefore
          options={TERMS}
          value={term}
          onChange={(v) => { markInteract('term'); setTerm(v); }}
        />
      </div>

      <div className="mt-5">
        <p className="text-sm font-semibold text-navy mb-2.5" id="freqLabel">
          Frecuencia de pago <HelpIconSvg size={15} className="text-muted-2 ml-1" />
        </p>
        <ChipRadioGroup
          className="flex gap-3"
          ariaLabelledBy="freqLabel"
          chipClassName="chip-freq"
          options={FREQUENCIES}
          value={frequency}
          onChange={(v) => { markInteract('frequency'); setFrequency(v); }}
        />
      </div>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {debouncedSr}
      </div>

      <SimulationResults sim={sim} frequency={frequency} />

      <ReassuranceChips />

      <div className="mt-5">
        <p
          className={cn('text-sm text-error font-medium transition-all', sim.valid ? 'h-0 overflow-hidden' : 'h-auto mb-2')}
          role="alert"
          aria-live="polite"
        >
          {sim.valid ? '' : sim.message}
        </p>
        <ApplyButton origin="simulator" variant="default" size="block" disabled={!sim.valid}>
          Solicitar este crédito <span aria-hidden="true">→</span>
        </ApplyButton>
      </div>
    </form>
  );
}
