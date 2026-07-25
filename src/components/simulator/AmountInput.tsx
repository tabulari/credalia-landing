'use client';

import { fmtCOP } from '@/lib/credit';
import { clampAmount, clampRoundAmount } from '../simulator-store';
import { MinusIcon, PlusIcon } from '../icons';

export function AmountInput({ amount, amountMin, amountMax, amountStep, amountStepBig, setAmount, inputText, setInputText, hint, setHint, inputRef, markInteract }: {
  amount: number;
  amountMin: number;
  amountMax: number;
  amountStep: number;
  amountStepBig: number;
  setAmount: (v: number, round?: boolean) => void;
  inputText: string;
  setInputText: (v: string) => void;
  hint: string;
  setHint: (v: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  markInteract: (control: string) => void;
}) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    markInteract('amount');
    const digits = e.target.value.replace(/\D/g, '');
    setInputText(digits ? fmtCOP(parseInt(digits, 10)) : '');
    if (!digits) {
      setHint(`Ingresa un monto entre $${fmtCOP(amountMin)} y $${fmtCOP(amountMax)}.`);
      return;
    }
    const raw = parseInt(digits, 10);
    if (raw > amountMax) setHint(`El monto máximo es $${fmtCOP(amountMax)}.`);
    else if (raw < amountMin) setHint(`El monto mínimo es $${fmtCOP(amountMin)}.`);
    else setHint('');
    setAmount(clampAmount(raw, amountMin, amountMax), false);
  };

  const handleInputBlur = () => {
    setHint('');
    const v = clampRoundAmount(amount || amountMin, amountMin, amountMax, amountStep);
    setAmount(v, true);
    setInputText(fmtCOP(v));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    markInteract('slider');
    setHint('');
    const v = Number(e.target.value);
    setAmount(v, true);
    setInputText(fmtCOP(clampRoundAmount(v, amountMin, amountMax, amountStep)));
  };

  const bump = (dir: -1 | 1) => {
    setHint('');
    const v = clampRoundAmount(
      (amount || amountMin) + dir * amountStepBig,
      amountMin,
      amountMax,
      amountStep,
    );
    setAmount(v, true);
    setInputText(fmtCOP(v));
  };

  const pct = ((amount - amountMin) / (amountMax - amountMin)) * 100;

  return (
    <>
      <p className="text-sm font-semibold text-navy mb-2">Monto solicitado</p>
      <div className="flex items-center gap-2.5 sm:gap-3 border bg-white rounded-md px-3 sm:px-5 py-3 border-2 border-border sm:flex-wrap flex-nowrap">
        <button
          type="button"
          aria-label="Disminuir monto"
          onClick={() => bump(-1)}
          disabled={amount <= amountMin}
          className="flex-shrink-0 flex items-center justify-center w-[46px] h-[46px] rounded-md border border-border text-navy hover:bg-bg-soft disabled:opacity-40 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <MinusIcon size={18} />
        </button>
        <div className="flex items-center gap-1 flex-1 min-w-0">
          <span className="text-2xl font-extrabold text-navy leading-none">$</span>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={inputText}
            aria-label="Monto solicitado"
            aria-invalid={hint ? 'true' : undefined}
            aria-describedby="amountHint"
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className="flex-1 min-w-0 text-2xl font-extrabold text-navy outline-none bg-transparent h-12 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        <button
          type="button"
          aria-label="Aumentar monto"
          onClick={() => bump(1)}
          disabled={amount >= amountMax}
          className="flex-shrink-0 flex items-center justify-center w-[46px] h-[46px] rounded-md border border-border text-navy hover:bg-bg-soft disabled:opacity-40 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <PlusIcon size={18} />
        </button>
        <span className="text-xs font-semibold text-muted-2 flex-shrink-0 hidden sm:inline">COP</span>
        <span className="w-px h-5 bg-border flex-shrink-0 hidden sm:block" />
        <button
          type="button"
          onClick={() => { inputRef.current?.focus(); inputRef.current?.select(); }}
          className="text-xs font-semibold text-navy hover:underline flex-shrink-0 whitespace-nowrap hidden sm:inline min-h-[46px] flex items-center rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Ingresar monto exacto
        </button>
      </div>
      <p className={hint ? 'text-xs font-medium transition-all text-orange-ink mt-1.5' : 'text-xs font-medium transition-all h-0 overflow-hidden'} id="amountHint" role="status" aria-live="polite">
        {hint}
      </p>

      <div className="mt-4">
        <input
          type="range"
          min={amountMin}
          max={amountMax}
          step={amountStep}
          value={amount}
          aria-label="Selector de monto"
          aria-valuemin={amountMin}
          aria-valuemax={amountMax}
          aria-valuenow={amount}
          aria-valuetext={`$${fmtCOP(amount)} COP`}
          onChange={handleSliderChange}
          className="w-full h-12 py-[18px] box-border bg-clip-content rounded-full appearance-none cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-navy [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-[18px] [&::-moz-range-thumb]:h-[18px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-navy [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
          style={{ background: `linear-gradient(to right, var(--green) 0% ${pct}%, var(--border) ${pct}% 100%)` }}
        />
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-muted-2">${fmtCOP(amountMin).replace(',00','')}</span>
          <span className="text-xs text-muted-2">${fmtCOP(amountMax).replace(',00','')}</span>
        </div>
      </div>
    </>
  );
}
