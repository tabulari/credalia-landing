'use client';

import { fmtCOP } from '@/lib/credit';
import { BANKS, EMPLOYMENT_TYPES, type FieldName } from '@/lib/application-schema';
import { capFreq } from './use-application-form';
import { cn } from '@/lib/utils';
import type { Values } from './use-application-form';
import { CheckIcon } from '../icons';
import { WhatsAppLink } from '../WhatsAppLink';

type FieldHandlers = {
  onFieldChange: (name: FieldName, raw: string) => void;
  onFieldBlur: (name: FieldName, value: string) => void;
  errors: Partial<Record<FieldName, string>>;
};

const fieldEl = (name: FieldName, label: string, handlers: FieldHandlers, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
  <label className={cn('flex flex-col gap-1.5', handlers.errors[name] && '[&_input]:border-destructive')}>
    <span className="text-sm font-semibold text-foreground">{label}</span>
    <input
      name={name}
      onChange={(e) => handlers.onFieldChange(name, e.target.value)}
      onBlur={(e) => handlers.onFieldBlur(name, (e.target as HTMLInputElement).value)}
      aria-invalid={handlers.errors[name] ? true : undefined}
      aria-describedby={handlers.errors[name] ? `err-${name}` : undefined}
      className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
      {...props}
    />
    <span className="text-xs text-destructive min-h-4" id={`err-${name}`} role="alert">{handlers.errors[name] || ''}</span>
  </label>
);

const selectEl = (name: FieldName, label: string, placeholder: string, options: readonly string[], handlers: FieldHandlers, value: string) => (
  <label className={cn('flex flex-col gap-1.5', handlers.errors[name] && '[&_select]:border-destructive')}>
    <span className="text-sm font-semibold text-foreground">{label}</span>
    <select
      name={name}
      value={value}
      onChange={(e) => { handlers.onFieldChange(name, e.target.value); }}
      aria-invalid={handlers.errors[name] ? true : undefined}
      aria-describedby={handlers.errors[name] ? `err-${name}` : undefined}
      className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
    <span className="text-xs text-destructive min-h-4" id={`err-${name}`} role="alert">{handlers.errors[name] || ''}</span>
  </label>
);

export function Step1({ values, applyOrigin, handlers, frozen }: {
  values: Values;
  applyOrigin: string;
  handlers: FieldHandlers;
  frozen: { amount: number; term: number; payment: number; unit: string };
}) {
  return (
    <section className="flex-1 flex flex-col gap-4">
      {applyOrigin === 'simulator' && (
        <div className="flex items-center gap-2 bg-green-tint border border-green/20 rounded-lg px-3 py-2 text-sm text-green-ink">
          <CheckIcon size={17} className="text-green-ink" />
          <span>Solicitando <b>{`$${fmtCOP(frozen.amount)}`}</b> a <b>{`${frozen.term} meses`}</b> · cuota <b>{`$${fmtCOP(frozen.payment)} ${frozen.unit}`}</b></span>
        </div>
      )}
      <h2 className="text-xl font-extrabold text-navy">Cuéntanos quién eres</h2>
      <p className="text-sm text-muted-foreground">Usaremos estos datos para contactarte sobre tu solicitud.</p>
      <div className="flex flex-col gap-4">{fieldEl('fullName', 'Nombre completo', handlers, { type: 'text', autoComplete: 'name', placeholder: 'Ej. Laura Martínez', value: values.fullName })}</div>
      <div className="grid grid-cols-2 gap-4">
        {fieldEl('idNumber', 'Número de cédula', handlers, { type: 'text', inputMode: 'numeric', placeholder: 'Ej. 1.024.567.890', value: values.idNumber })}
        {fieldEl('phone', 'Celular', handlers, { type: 'tel', inputMode: 'numeric', placeholder: 'Ej. 300 123 4567', value: values.phone })}
      </div>
       <div>{fieldEl('email', 'Correo electrónico', handlers, { type: 'email', autoComplete: 'email', placeholder: 'tucorreo@ejemplo.com', value: values.email })}</div>
       <div className="mt-3 text-center">
         <WhatsAppLink ctx="contact" className="text-xs text-muted-foreground hover:text-navy transition-colors underline underline-offset-2">
           ¿Preferís escribirnos por WhatsApp?
         </WhatsAppLink>
       </div>
     </section>

  );
}

export function Step2({ values, handlers }: { values: Values; handlers: FieldHandlers }) {
  return (
    <section className="flex-1 flex flex-col gap-4">
      <h2 className="text-xl font-extrabold text-navy">Tus ingresos</h2>
      <p className="text-sm text-muted-foreground">Nos ayuda a evaluar condiciones justas para ti.</p>
      {selectEl('employmentType', 'Tipo de empleo', 'Selecciona una opción', EMPLOYMENT_TYPES, handlers, values.employmentType)}
      <div className="grid grid-cols-2 gap-4">
        {fieldEl('income', 'Ingreso mensual', handlers, { type: 'text', inputMode: 'numeric', placeholder: '$ 0', value: values.income })}
        {selectEl('bank', 'Banco para el desembolso', 'Selecciona tu banco', BANKS, handlers, values.bank)}
      </div>
    </section>
  );
}

export function Step3({ values, consent, consentError, setConsent, setConsentError, frozen }: {
  values: Values;
  consent: boolean;
  consentError: string;
  setConsent: (v: boolean) => void;
  setConsentError: (v: string) => void;
  frozen: { amount: number; term: number; payment: number; unit: string; frequency: string; periodRate: number };
}) {
  const reviewRows: [string, string, boolean?][] = [
    ['Monto', `$${fmtCOP(frozen.amount)}`],
    ['Cuota estimada', `$${fmtCOP(frozen.payment)} ${frozen.unit}`],
    ['Plazo', `${frozen.term} meses`],
    ['Frecuencia', capFreq(frozen.frequency as 'monthly' | 'biweekly')],
    ['Nombre', values.fullName || '—', true],
    ['Cédula', values.idNumber || '—'],
    ['Celular', values.phone || '—'],
    ['Correo', values.email || '—', true],
    ['Tipo de empleo', values.employmentType || '—'],
    ['Banco', values.bank || '—'],
  ];
  return (
    <section className="flex-1 flex flex-col gap-4">
      <h2 className="text-xl font-extrabold text-navy">Revisa y confirma</h2>
      <p className="text-sm text-muted-foreground">Verifica que todo esté correcto antes de enviar.</p>
      <div className="grid grid-cols-2 gap-3">
        {reviewRows.map(([k, v, full]) => (
          <div key={k} className={cn('flex flex-col gap-0.5 p-3 rounded-lg bg-bg-soft', full && 'col-span-2')}>
            <span className="text-xs text-muted-2 font-medium">{k}</span>
            <span className="text-sm font-semibold text-foreground">{v}</span>
          </div>
        ))}
      </div>
      <label className="flex gap-2.5 items-start text-sm">
        <input
          type="checkbox"
          name="consent"
          checked={consent}
          aria-invalid={consentError ? true : undefined}
          aria-describedby={consentError ? 'consentError' : undefined}
          onChange={(e) => { setConsent(e.target.checked); if (e.target.checked) setConsentError(''); }}
          className="mt-0.5 accent-navy"
        />
        <span className="text-muted-foreground">
          Autorizo el tratamiento de mis datos personales conforme a la{' '}
          <a href="/legal/privacidad" target="_blank" rel="noopener noreferrer" className="text-navy font-semibold hover:underline">Política de Privacidad</a>{' '}
          y la Ley 1581 de 2012 (Habeas Data).
        </span>
      </label>
      <span id="consentError" role="alert" className={cn('text-xs text-destructive', consentError ? 'visible' : 'hidden')}>
        {consentError}
      </span>
      <p className="text-[11px] text-muted-2 mt-2">
        Tus datos se guardan localmente en tu navegador para que puedas continuar después. Al cerrar esta ventana sin enviar, la información permanecerá almacenada en tu dispositivo.
      </p>
    </section>
  );
}
