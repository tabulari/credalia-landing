'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { fmtCOP, fmtPct, type Simulation } from '@/lib/credit';
import {
  BANKS,
  CONSENT_MESSAGE,
  EMPLOYMENT_TYPES,
  STEP_FIELDS,
  validateField,
  type FieldName,
} from '@/lib/application-schema';
import { track } from '@/lib/analytics';
import { useSiteUi } from './site-ui';
import { useSimulator } from './simulator-store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const DRAFT_KEY = '*********************';
const FIELDS: FieldName[] = [
  'fullName',
  'idNumber',
  'phone',
  'email',
  'employmentType',
  'income',
  'bank',
];
const STEP_TITLES: Record<number, string> = {
  1: 'Tus datos',
  2: 'Tus ingresos',
  3: 'Revisión',
};

type SubmitStatus = 'idle' | 'pending' | 'success' | 'error';
type Values = Record<FieldName, string>;
const emptyValues: Values = {
  fullName: '',
  idNumber: '',
  phone: '',
  email: '',
  employmentType: '',
  income: '',
  bank: '',
};

const capFreq = (f: Simulation['frequency']) =>
  f === 'biweekly' ? 'Quincenal' : 'Mensual';
const tasaLabel = (s: Simulation) =>
  fmtPct(s.periodRate, 1) +
  (s.frequency === 'biweekly' ? '% q.' : '% m. v.');

export function ApplyModal() {
  const { applyOpen, applyOrigin, closeApply, showResumeNudge } =
    useSiteUi();
  const { sim } = useSimulator();

  const simRef = useRef(sim);
  simRef.current = sim;

  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [frozen, setFrozen] = useState<Simulation | null>(null);
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<Values>(emptyValues);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [consentError, setConsentError] = useState('');
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [radicado, setRadicado] = useState('');
  const [liveMsg, setLiveMsg] = useState('');

  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const clearDraft = useCallback(() => {
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* */ }
  }, []);

  useEffect(() => {
    if (applyOpen) {
      lastFocusedRef.current = document.activeElement as HTMLElement | null;
      setFrozen(simRef.current);

      let draft: { step?: number } & Partial<Values> & { consent?: boolean } = {};
      try {
        draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null') || {};
      } catch { draft = {}; }
      const restored = { ...emptyValues };
      for (const f of FIELDS) if (draft[f]) restored[f] = draft[f] as string;
      setValues(restored);
      setConsent(!!draft.consent);
      setStep(draft.step && draft.step >= 1 && draft.step <= 3 ? draft.step : 1);
      setErrors({});
      setConsentError('');
      setSubmitStatus('idle');
      setRadicado('');

      setMounted(true);
      document.body.style.overflow = 'hidden';
      const t1 = setTimeout(() => setShow(true), 16);
      const t2 = setTimeout(() => {
        modalRef.current?.querySelector<HTMLElement>('input, select')?.focus();
      }, 280);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
    if (!mounted) return;
    setShow(false);
    document.body.style.overflow = '';
    const t = setTimeout(() => { setMounted(false); lastFocusedRef.current?.focus?.(); }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applyOpen]);

  useEffect(() => {
    if (!mounted || submitStatus === 'success') return;
    const hasContent = FIELDS.some((f) => values[f]) || consent;
    try { if (hasContent) localStorage.setItem(DRAFT_KEY, JSON.stringify({ step, ...values, consent })); } catch { /* */ }
  }, [values, consent, step, mounted, submitStatus]);

  useEffect(() => {
    if (mounted && submitStatus !== 'success' && submitStatus !== 'error')
      setLiveMsg(`Paso ${step} de 3: ${STEP_TITLES[step]}`);
  }, [step, mounted, submitStatus]);

  useEffect(() => {
    if (!mounted) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { closeApply(); return; }
      if (e.key !== 'Tab' || !modalRef.current) return;
      const focusable = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>('button, input, select, a[href], [tabindex]:not([tabindex="-1"])')
      ).filter((el) => el.offsetParent !== null && !(el as HTMLButtonElement).disabled);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mounted, closeApply]);

  const onFieldChange = (name: FieldName, raw: string) => {
    let v = raw;
    if (name === 'income') { const d = raw.replace(/\D/g, ''); v = d ? `$ ${fmtCOP(parseInt(d, 10))}` : ''; }
    else if (name === 'phone') { v = raw.replace(/[^\d ]/g, '').slice(0, 13); }
    setValues((prev) => ({ ...prev, [name]: v }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const onFieldBlur = (name: FieldName) => {
    if (values[name].trim() !== '')
      setErrors((prev) => ({ ...prev, [name]: validateField(name, values[name]) }));
  };

  const validateStep = (n: number): boolean => {
    const fields = STEP_FIELDS[n];
    if (fields) {
      const next: Partial<Record<FieldName, string>> = {};
      let firstBad: FieldName | null = null;
      for (const f of fields) {
        const msg = validateField(f, values[f]);
        next[f] = msg;
        if (msg && !firstBad) firstBad = f;
      }
      setErrors((prev) => ({ ...prev, ...next }));
      if (firstBad) {
        modalRef.current?.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus();
        return false;
      }
      return true;
    }
    if (n === 3) {
      if (!consent) {
        setConsentError(CONSENT_MESSAGE);
        modalRef.current?.querySelector<HTMLInputElement>('input[name="consent"]')?.focus();
        return false;
      }
      setConsentError('');
      return true;
    }
    return true;
  };

  const submit = useCallback(async () => {
    setSubmitStatus('pending');
    track('apply_submit', { amount: frozen?.amount, term: frozen?.term, frequency: frozen?.frequency });
    const payload = { ...values, consent, terms: frozen };
    try {
      const forceError = typeof window !== 'undefined' && (window as unknown as { __forceApplicationError?: boolean }).__forceApplicationError;
      const res = await fetch(`/api/application${forceError ? '?forceError=1' : ''}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('submit failed');
      const data = (await res.json()) as { radicado: string };
      setRadicado(data.radicado);
      clearDraft();
      setSubmitStatus('success');
      track('apply_submit_success', { radicado: data.radicado });
    } catch {
      setSubmitStatus('error');
      track('apply_submit_error');
    }
  }, [values, consent, frozen, clearDraft]);

  const onNext = () => {
    if (!validateStep(step)) return;
    track('apply_step_complete', { step });
    if (step === 3) submit();
    else setStep((s) => s + 1);
  };

  const editMonto = () => {
    track('apply_edit_monto', { step });
    closeApply();
    setTimeout(() => {
      const el = document.getElementById('simula');
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
      document.getElementById('amountInput')?.focus();
      showResumeNudge();
    }, 300);
  };

  if (!mounted || !frozen) return null;

  const stepDot = (i: number) =>
    cn(
      'flex items-center gap-1.5 text-sm font-semibold',
      i === step ? 'text-navy' : i < step || submitStatus === 'success' ? 'text-green' : 'text-muted-2',
    );

  const fieldEl = (name: FieldName, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className={cn('flex flex-col gap-1.5', errors[name] && '[&_input]:border-destructive')}>
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <input
        name={name}
        value={values[name]}
        onChange={(e) => onFieldChange(name, e.target.value)}
        onBlur={() => onFieldBlur(name)}
        aria-invalid={errors[name] ? true : undefined}
        aria-describedby={errors[name] ? `err-${name}` : undefined}
        className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
        {...props}
      />
      <em className="text-xs text-destructive min-h-4" id={`err-${name}`}>{errors[name] || ''}</em>
    </label>
  );

  const selectEl = (name: FieldName, label: string, placeholder: string, options: readonly string[]) => (
    <label className={cn('flex flex-col gap-1.5', errors[name] && '[&_select]:border-destructive')}>
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <select
        name={name}
        value={values[name]}
        onChange={(e) => { onFieldChange(name, e.target.value); setErrors((prev) => ({ ...prev, [name]: validateField(name, e.target.value) })); }}
        aria-invalid={errors[name] ? true : undefined}
        aria-describedby={errors[name] ? `err-${name}` : undefined}
        className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <em className="text-xs text-destructive min-h-4" id={`err-${name}`}>{errors[name] || ''}</em>
    </label>
  );

  const reviewRows: [string, string, boolean?][] = [
    ['Monto', `$${fmtCOP(frozen.amount)}`],
    ['Cuota estimada', `$${fmtCOP(frozen.payment)} ${frozen.unit}`],
    ['Plazo', `${frozen.term} meses`],
    ['Frecuencia', capFreq(frozen.frequency)],
    ['Nombre', values.fullName || '—', true],
    ['Cédula', values.idNumber || '—'],
    ['Celular', values.phone || '—'],
    ['Correo', values.email || '—', true],
    ['Tipo de empleo', values.employmentType || '—'],
    ['Banco', values.bank || '—'],
  ];

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center transition-colors duration-200',
        show ? 'bg-black/40' : 'bg-black/0 pointer-events-none',
      )}
      ref={overlayRef}
      onMouseDown={(e) => { if (e.target === overlayRef.current) closeApply(); }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="applyTitle"
        className={cn(
          'relative flex w-full max-w-[860px] max-h-[90vh] bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-200',
          show ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
          'max-[760px]:flex-col max-[760px]:max-h-[95vh]',
        )}
      >
        <h2 id="applyTitle" className="sr-only">Solicitud de credito</h2>
        <p className="sr-only" aria-live="polite">{liveMsg}</p>

        <button
          type="button"
          aria-label="Cerrar"
          onClick={closeApply}
          className="absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-lg text-muted-2 hover:bg-bg-soft hover:text-navy transition-colors"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6 l12 12 M18 6 l-12 12" />
          </svg>
        </button>

        {/* Sidebar */}
        <aside className="w-[240px] bg-navy-deep text-white p-6 flex flex-col shrink-0 max-[760px]:w-full max-[760px]:flex-row max-[760px]:flex-wrap max-[760px]:p-4 max-[760px]:gap-3">
          <div aria-hidden="true" className="mb-4 max-[760px]:mb-0">
            <svg width="34" height="24" viewBox="0 0 42 30">
              <path d="M2 2 L11 2 L20 15 L11 28 L2 28 L11 15 Z" fill="#3ddc97" />
              <path d="M16 2 L25 2 L34 15 L25 28 L16 28 L25 15 Z" fill="#fff" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-white/60 max-[760px]:hidden">Tu solicitud</p>
          <div className="text-2xl font-extrabold mt-1 max-[760px]:text-lg max-[760px]:mt-0">
            {`$${fmtCOP(frozen.payment)}`}
            <small className="text-sm font-semibold text-white/60 ml-1">{frozen.unit}</small>
          </div>
          <button
            type="button"
            onClick={editMonto}
            className="inline-flex items-center gap-1 text-xs text-white/70 hover:text-white mt-3 max-[760px]:mt-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20 h9" />
              <path d="M16.5 3.5 a2.1 2.1 0 0 1 3 3 L7 19 l-4 1 1-4 Z" />
            </svg>
            Editar monto
          </button>
          <ul className="mt-5 flex flex-col gap-2 text-sm max-[760px]:hidden">
            {[['Monto', `$${fmtCOP(frozen.amount)}`], ['Plazo', `${frozen.term} meses`], ['Frecuencia', capFreq(frozen.frequency)], ['Tasa', tasaLabel(frozen)]].map(([k, v]) => (
              <li key={k} className="flex justify-between"><span className="text-white/60">{k}</span><b>{v}</b></li>
            ))}
          </ul>
          <p className="text-xs text-white/40 mt-auto max-[760px]:hidden">
            Sujeto a verificación. No representa aprobación definitiva.
          </p>
        </aside>

        {/* Form */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          {/* Steps */}
          <ol className="flex gap-5 px-6 pt-5 pb-3 border-b border-border">
            {[1, 2, 3].map((i) => (
              <li key={i} className={stepDot(i)}>
                <span className={cn(
                  'flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold',
                  i === step ? 'bg-navy text-white' : i < step || submitStatus === 'success' ? 'bg-green text-white' : 'bg-border text-muted-2',
                )}>{i}</span>
                {STEP_TITLES[i]}
              </li>
            ))}
          </ol>

          <form
            noValidate
            className="flex-1 px-6 py-5 flex flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              if (submitStatus === 'pending' || submitStatus === 'success') return;
              if (submitStatus === 'error') { submit(); return; }
              onNext();
            }}
          >
            {submitStatus === 'success' ? (
              <section className="flex-1 flex flex-col items-center justify-center text-center py-8">
                <div className="w-[72px] h-[72px] rounded-full bg-green flex items-center justify-center mb-5 shadow-lg" style={{ animation: 'popIn 0.4s cubic-bezier(0.2,1.4,0.4,1)' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12 l4 4 L19 7" /></svg>
                </div>
                <h2 className="text-xl font-extrabold text-navy">¡Solicitud enviada!</h2>
                <p className="text-sm text-muted-foreground mt-2 max-w-[380px]">Recibimos tu solicitud y la estamos evaluando. Te contactaremos por WhatsApp en los próximos minutos.</p>
                <div className="mt-4 bg-bg-soft border border-border rounded-lg px-4 py-2.5 text-sm text-muted-foreground">Radicado <b className="text-navy font-extrabold">{radicado}</b></div>
              </section>
            ) : submitStatus === 'error' ? (
              <section className="flex-1 flex flex-col items-center justify-center text-center py-8">
                <div className="w-[72px] h-[72px] rounded-full bg-destructive flex items-center justify-center mb-5 shadow-lg" style={{ animation: 'popIn 0.4s cubic-bezier(0.2,1.4,0.4,1)' }}>
                  <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8 v5 M12 17 h.01" /><circle cx="12" cy="12" r="9" /></svg>
                </div>
                <h2 className="text-xl font-extrabold text-navy">No pudimos enviar tu solicitud</h2>
                <p className="text-sm text-muted-foreground mt-2 max-w-[380px]">Ocurrió un problema de conexión. Tus datos siguen guardados — puedes reintentar el envío.</p>
              </section>
            ) : (
              <>
                {step === 1 && (
                  <section className="flex-1 flex flex-col gap-4">
                    {applyOrigin === 'simulator' && (
                      <div className="flex items-center gap-2 bg-green-tint border border-green/20 rounded-lg px-3 py-2 text-sm text-green-ink">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12 l4 4 L19 7" /></svg>
                        <span>Solicitando <b>{`$${fmtCOP(frozen.amount)}`}</b> a <b>{`${frozen.term} meses`}</b> · cuota <b>{`$${fmtCOP(frozen.payment)} ${frozen.unit}`}</b></span>
                      </div>
                    )}
                    <h2 className="text-xl font-extrabold text-navy">Cuéntanos quién eres</h2>
                    <p className="text-sm text-muted-foreground">Usaremos estos datos para contactarte sobre tu solicitud.</p>
                    <div className="flex flex-col gap-4">{fieldEl('fullName', 'Nombre completo', { type: 'text', autoComplete: 'name', placeholder: 'Ej. Laura Martínez' })}</div>
                    <div className="grid grid-cols-2 gap-4">
                      {fieldEl('idNumber', 'Número de cédula', { type: 'text', inputMode: 'numeric', placeholder: 'Ej. 1.024.567.890' })}
                      {fieldEl('phone', 'Celular', { type: 'tel', inputMode: 'numeric', placeholder: 'Ej. 300 123 4567' })}
                    </div>
                    <div>{fieldEl('email', 'Correo electrónico', { type: 'email', autoComplete: 'email', placeholder: 'tucorreo@ejemplo.com' })}</div>
                  </section>
                )}
                {step === 2 && (
                  <section className="flex-1 flex flex-col gap-4">
                    <h2 className="text-xl font-extrabold text-navy">Tus ingresos</h2>
                    <p className="text-sm text-muted-foreground">Nos ayuda a evaluar condiciones justas para ti.</p>
                    {selectEl('employmentType', 'Tipo de empleo', 'Selecciona una opción', EMPLOYMENT_TYPES)}
                    <div className="grid grid-cols-2 gap-4">
                      {fieldEl('income', 'Ingreso mensual', { type: 'text', inputMode: 'numeric', placeholder: '$ 0' })}
                      {selectEl('bank', 'Banco para el desembolso', 'Selecciona tu banco', BANKS)}
                    </div>
                  </section>
                )}
                {step === 3 && (
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
                        <a href="/legal/privacidad" target="_blank" rel="noopener" className="text-navy font-semibold hover:underline">Política de Privacidad</a>{' '}
                        y la Ley 1581 de 2012 (Habeas Data).
                      </span>
                    </label>
                    <em id="consentError" className={cn('text-xs text-destructive', consentError ? 'visible' : 'hidden')}>
                      {consentError}
                    </em>
                  </section>
                )}
              </>
            )}
          </form>

          {/* Nav */}
          <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-border">
            {submitStatus === 'success' ? (
              <Button variant="default" size="block" onClick={closeApply}>Entendido</Button>
            ) : submitStatus === 'error' ? (
              <Button variant="default" size="block" onClick={submit}>Reintentar envío →</Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="default"
                  style={{ visibility: step > 1 ? 'visible' : 'hidden' }}
                  disabled={submitStatus === 'pending'}
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                >
                  ← Atrás
                </Button>
                <Button
                  variant="default"
                  size="default"
                  disabled={submitStatus === 'pending'}
                  onClick={onNext}
                >
                  {submitStatus === 'pending' ? (<><span className="btn-spinner" aria-hidden="true" /> Enviando…</>)
                    : step === 3 ? (<>Enviar solicitud →</>)
                    : (<>Continuar →</>)}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
