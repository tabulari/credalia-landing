'use client';

import { useRef, useState } from 'react';
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

const HelpIconLocal = () => (
  <HelpIconSvg size={15} className="text-muted-2 ml-1" />
);

export function Simulator() {
  const { amount, term, frequency, sim, setAmount, setTerm, setFrequency } = useSimulator();

  const inputRef = useRef<HTMLInputElement>(null);
  const [inputText, setInputText] = useState(() => fmtCOP(amount));
  const [hint, setHint] = useState('');

  const interacted = useRef(false);
  const markInteract = (control: string) => {
    if (interacted.current) return;
    interacted.current = true;
    track('sim_interact', { control });
  };

  return (
    <div id="simulator" className="reveal d1 bg-card border border-border rounded-[22px] p-8 shadow-md">
      <div className="flex items-center justify-between mb-[26px] flex-wrap gap-2.5">
        <h3 className="text-xl font-extrabold text-navy">Simulador de crédito</h3>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-ink bg-green-tint rounded-full px-3 py-1.5">
          <ShieldCheckIcon size={16} className="text-green" />
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
          Elige el plazo <HelpIconLocal />
        </p>
        <ChipRadioGroup
          className="flex gap-[10px]"
          ariaLabelledBy="plazoLabel"
          checkBefore
          options={TERMS}
          value={term}
          onChange={(v) => { markInteract('term'); setTerm(v); }}
        />
      </div>

      <div className="mt-5">
        <p className="text-sm font-semibold text-navy mb-2.5" id="freqLabel">
          Frecuencia de pago <HelpIconLocal />
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
        {`Cuota estimada: $${fmtCOP(sim.payment)} ${sim.unit}. Monto: $${fmtCOP(sim.amount)}, plazo: ${sim.term} meses.`}
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
    </div>
  );
}
