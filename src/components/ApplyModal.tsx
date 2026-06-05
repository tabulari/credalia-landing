"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fmtCOP, fmtPct, type Simulation } from "@/lib/credit";
import {
  BANKS,
  CONSENT_MESSAGE,
  EMPLOYMENT_TYPES,
  STEP_FIELDS,
  validateField,
  type FieldName,
} from "@/lib/application-schema";
import { useSiteUi } from "./site-ui";
import { useSimulator } from "./simulator-store";

const DRAFT_KEY = "credalia_solicitud_v1";
const FIELDS: FieldName[] = [
  "fullName",
  "idNumber",
  "phone",
  "email",
  "employmentType",
  "income",
  "bank",
];
const STEP_TITLES: Record<number, string> = {
  1: "Tus datos",
  2: "Tus ingresos",
  3: "Revisión",
};

type SubmitStatus = "idle" | "pending" | "success" | "error";
type Values = Record<FieldName, string>;
const emptyValues: Values = {
  fullName: "",
  idNumber: "",
  phone: "",
  email: "",
  employmentType: "",
  income: "",
  bank: "",
};

const capFreq = (f: Simulation["frequency"]) =>
  f === "biweekly" ? "Quincenal" : "Mensual";
const tasaLabel = (s: Simulation) =>
  fmtPct(s.periodRate, 1) + (s.frequency === "biweekly" ? "% q." : "% m. v.");

export function ApplyModal() {
  const { applyOpen, applyOrigin, closeApply } = useSiteUi();
  const { sim } = useSimulator();

  // latest sim, read at the moment of open to freeze a snapshot
  const simRef = useRef(sim);
  simRef.current = sim;

  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [frozen, setFrozen] = useState<Simulation | null>(null);
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<Values>(emptyValues);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [consentError, setConsentError] = useState("");
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [radicado, setRadicado] = useState("");
  const [liveMsg, setLiveMsg] = useState("");

  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  /* ---- draft persistence ---- */
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* storage unavailable */
    }
  }, []);

  /* ---- open / close lifecycle ---- */
  useEffect(() => {
    if (applyOpen) {
      lastFocusedRef.current = document.activeElement as HTMLElement | null;
      setFrozen(simRef.current);

      let draft: { step?: number } & Partial<Values> & { consent?: boolean } = {};
      try {
        draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null") || {};
      } catch {
        draft = {};
      }
      const restored = { ...emptyValues };
      for (const f of FIELDS) if (draft[f]) restored[f] = draft[f] as string;
      setValues(restored);
      setConsent(!!draft.consent);
      setStep(draft.step && draft.step >= 1 && draft.step <= 3 ? draft.step : 1);
      setErrors({});
      setConsentError("");
      setSubmitStatus("idle");
      setRadicado("");

      setMounted(true);
      document.body.style.overflow = "hidden";
      const t1 = setTimeout(() => setShow(true), 16);
      const t2 = setTimeout(() => {
        modalRef.current
          ?.querySelector<HTMLElement>(
            ".apply-step.is-active input, .apply-step.is-active select",
          )
          ?.focus();
      }, 280);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    if (!mounted) return;
    setShow(false);
    document.body.style.overflow = "";
    const t = setTimeout(() => {
      setMounted(false);
      lastFocusedRef.current?.focus?.();
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applyOpen]);

  /* ---- persist draft as the user types / advances ---- */
  useEffect(() => {
    if (!mounted || submitStatus === "success") return;
    const hasContent = FIELDS.some((f) => values[f]) || consent;
    try {
      if (hasContent)
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ step, ...values, consent }),
        );
    } catch {
      /* storage unavailable */
    }
  }, [values, consent, step, mounted, submitStatus]);

  /* ---- announce step changes ---- */
  useEffect(() => {
    if (mounted && submitStatus !== "success" && submitStatus !== "error")
      setLiveMsg(`Paso ${step} de 3: ${STEP_TITLES[step]}`);
  }, [step, mounted, submitStatus]);

  /* ---- Esc + focus trap ---- */
  useEffect(() => {
    if (!mounted) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeApply();
        return;
      }
      if (e.key !== "Tab" || !modalRef.current) return;
      const focusable = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'button, input, select, a[href], [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null && !(el as HTMLButtonElement).disabled);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mounted, closeApply]);

  /* ---- field changes + masking ---- */
  const onFieldChange = (name: FieldName, raw: string) => {
    let v = raw;
    if (name === "income") {
      const d = raw.replace(/\D/g, "");
      v = d ? `$ ${fmtCOP(parseInt(d, 10))}` : "";
    } else if (name === "phone") {
      v = raw.replace(/[^\d ]/g, "").slice(0, 13);
    }
    setValues((prev) => ({ ...prev, [name]: v }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const onFieldBlur = (name: FieldName) => {
    if (values[name].trim() !== "")
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
        modalRef.current
          ?.querySelector<HTMLElement>(`[name="${firstBad}"]`)
          ?.focus();
        return false;
      }
      return true;
    }
    if (n === 3) {
      if (!consent) {
        setConsentError(CONSENT_MESSAGE);
        return false;
      }
      setConsentError("");
      return true;
    }
    return true;
  };

  /* ---- submit ---- */
  const submit = useCallback(async () => {
    setSubmitStatus("pending");
    const payload = { ...values, consent, terms: frozen };
    try {
      const forceError =
        typeof window !== "undefined" &&
        (window as unknown as { __forceApplicationError?: boolean })
          .__forceApplicationError;
      const res = await fetch(
        `/api/application${forceError ? "?forceError=1" : ""}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) throw new Error("submit failed");
      const data = (await res.json()) as { radicado: string };
      setRadicado(data.radicado);
      clearDraft();
      setSubmitStatus("success");
    } catch {
      // draft is preserved on error
      setSubmitStatus("error");
    }
  }, [values, consent, frozen, clearDraft]);

  const onNext = () => {
    if (!validateStep(step)) return;
    if (step === 3) submit();
    else setStep((s) => s + 1);
  };

  const editMonto = () => {
    closeApply();
    setTimeout(() => {
      const el = document.getElementById("simula");
      if (el)
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.pageYOffset - 80,
          behavior: "smooth",
        });
      document.getElementById("amountInput")?.focus();
      // resume nudge is wired in Slice 5
    }, 300);
  };

  if (!mounted || !frozen) return null;

  const stepClass = (i: number) =>
    `${i === step ? "active" : ""}${i < step || submitStatus === "success" ? " done" : ""}`.trim();

  const field = (
    name: FieldName,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {},
  ) => (
    <label className={`fld${errors[name] ? " invalid" : ""}`}>
      <span>{label}</span>
      <input
        name={name}
        value={values[name]}
        onChange={(e) => onFieldChange(name, e.target.value)}
        onBlur={() => onFieldBlur(name)}
        aria-invalid={errors[name] ? true : undefined}
        aria-describedby={errors[name] ? `err-${name}` : undefined}
        {...props}
      />
      <em className="err" id={`err-${name}`}>
        {errors[name] || ""}
      </em>
    </label>
  );

  const select = (name: FieldName, label: string, placeholder: string, options: readonly string[]) => (
    <label className={`fld${errors[name] ? " invalid" : ""}`}>
      <span>{label}</span>
      <select
        name={name}
        value={values[name]}
        onChange={(e) => {
          onFieldChange(name, e.target.value);
          setErrors((prev) => ({ ...prev, [name]: validateField(name, e.target.value) }));
        }}
        aria-invalid={errors[name] ? true : undefined}
        aria-describedby={errors[name] ? `err-${name}` : undefined}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <em className="err" id={`err-${name}`}>
        {errors[name] || ""}
      </em>
    </label>
  );

  const reviewRows: [string, string, boolean?][] = [
    ["Monto", `$${fmtCOP(frozen.amount)}`],
    ["Cuota estimada", `$${fmtCOP(frozen.payment)} ${frozen.unit}`],
    ["Plazo", `${frozen.term} meses`],
    ["Frecuencia", capFreq(frozen.frequency)],
    ["Nombre", values.fullName || "—", true],
    ["Cédula", values.idNumber || "—"],
    ["Celular", values.phone || "—"],
    ["Correo", values.email || "—", true],
    ["Tipo de empleo", values.employmentType || "—"],
    ["Banco", values.bank || "—"],
  ];

  return (
    <div
      className={`apply-overlay${show ? " show" : ""}`}
      ref={overlayRef}
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) closeApply();
      }}
    >
      <div
        className="apply-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="applyTitle"
        ref={modalRef}
      >
        <p className="sr-only" aria-live="polite">
          {liveMsg}
        </p>
        <button className="apply-close" type="button" aria-label="Cerrar" onClick={closeApply}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6 l12 12 M18 6 l-12 12" />
          </svg>
        </button>

        {/* summary rail (frozen snapshot) */}
        <aside className="apply-aside">
          <div className="logo" aria-hidden="true">
            <svg width="34" height="24" viewBox="0 0 42 30">
              <path d="M2 2 L11 2 L20 15 L11 28 L2 28 L11 15 Z" fill="#3ddc97" />
              <path d="M16 2 L25 2 L34 15 L25 28 L16 28 L25 15 Z" fill="#fff" />
            </svg>
          </div>
          <p className="apply-aside-k">Tu solicitud</p>
          <div className="apply-aside-payment">
            {`$${fmtCOP(frozen.payment)}`}
            <small>{frozen.unit}</small>
          </div>
          <button className="aside-edit" type="button" onClick={editMonto}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20 h9" />
              <path d="M16.5 3.5 a2.1 2.1 0 0 1 3 3 L7 19 l-4 1 1-4 Z" />
            </svg>
            Editar monto
          </button>
          <ul className="apply-aside-list">
            <li>
              <span>Monto</span>
              <b>{`$${fmtCOP(frozen.amount)}`}</b>
            </li>
            <li>
              <span>Plazo</span>
              <b>{`${frozen.term} meses`}</b>
            </li>
            <li>
              <span>Frecuencia</span>
              <b>{capFreq(frozen.frequency)}</b>
            </li>
            <li>
              <span>Tasa</span>
              <b>{tasaLabel(frozen)}</b>
            </li>
          </ul>
          <p className="apply-aside-note">
            Sujeto a verificación. No representa aprobación definitiva.
          </p>
        </aside>

        {/* form panel */}
        <div className="apply-main">
          <ol className="apply-steps">
            <li className={stepClass(1)}>
              <span className="sdot">1</span> Tus datos
            </li>
            <li className={stepClass(2)}>
              <span className="sdot">2</span> Tus ingresos
            </li>
            <li className={stepClass(3)}>
              <span className="sdot">3</span> Revisión
            </li>
          </ol>

          <form className="apply-form" noValidate onSubmit={(e) => e.preventDefault()}>
            {submitStatus === "success" ? (
              <section className="apply-step apply-success is-active">
                <div className="success-ring">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12 l4 4 L19 7" />
                  </svg>
                </div>
                <h2 className="apply-h">¡Solicitud enviada!</h2>
                <p className="apply-sub">
                  Recibimos tu solicitud y la estamos evaluando. Te contactaremos
                  por WhatsApp en los próximos minutos.
                </p>
                <div className="tracking-id">
                  Radicado <b>{radicado}</b>
                </div>
              </section>
            ) : submitStatus === "error" ? (
              <section className="apply-step apply-error is-active">
                <div className="error-ring">
                  <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 8 v5 M12 17 h.01" />
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                </div>
                <h2 className="apply-h">No pudimos enviar tu solicitud</h2>
                <p className="apply-sub">
                  Ocurrió un problema de conexión. Tus datos siguen guardados —
                  puedes reintentar el envío.
                </p>
              </section>
            ) : (
              <>
                {step === 1 && (
                  <section className="apply-step is-active" data-panel="1">
                    {applyOrigin === "simulator" && (
                      <div className="terms-chip">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12 l4 4 L19 7" />
                        </svg>
                        <span>
                          Solicitando <b>{`$${fmtCOP(frozen.amount)}`}</b> a{" "}
                          <b>{`${frozen.term} meses`}</b> · cuota{" "}
                          <b>{`$${fmtCOP(frozen.payment)} ${frozen.unit}`}</b>
                        </span>
                      </div>
                    )}
                    <h2 id="applyTitle" className="apply-h">
                      Cuéntanos quién eres
                    </h2>
                    <p className="apply-sub">
                      Usaremos estos datos para contactarte sobre tu solicitud.
                    </p>
                    <div className="field-row">
                      {field("fullName", "Nombre completo", {
                        type: "text",
                        autoComplete: "name",
                        placeholder: "Ej. Laura Martínez",
                      })}
                    </div>
                    <div className="field-row two">
                      {field("idNumber", "Número de cédula", {
                        type: "text",
                        inputMode: "numeric",
                        placeholder: "Ej. 1.024.567.890",
                      })}
                      {field("phone", "Celular", {
                        type: "tel",
                        inputMode: "numeric",
                        placeholder: "Ej. 300 123 4567",
                      })}
                    </div>
                    <div className="field-row">
                      {field("email", "Correo electrónico", {
                        type: "email",
                        autoComplete: "email",
                        placeholder: "tucorreo@ejemplo.com",
                      })}
                    </div>
                  </section>
                )}

                {step === 2 && (
                  <section className="apply-step is-active" data-panel="2">
                    <h2 className="apply-h">Tus ingresos</h2>
                    <p className="apply-sub">
                      Nos ayuda a evaluar condiciones justas para ti.
                    </p>
                    <div className="field-row">
                      {select("employmentType", "Tipo de empleo", "Selecciona una opción", EMPLOYMENT_TYPES)}
                    </div>
                    <div className="field-row two">
                      {field("income", "Ingreso mensual", {
                        type: "text",
                        inputMode: "numeric",
                        placeholder: "$ 0",
                      })}
                      {select("bank", "Banco para el desembolso", "Selecciona tu banco", BANKS)}
                    </div>
                  </section>
                )}

                {step === 3 && (
                  <section className="apply-step is-active" data-panel="3">
                    <h2 className="apply-h">Revisa y confirma</h2>
                    <p className="apply-sub">
                      Verifica que todo esté correcto antes de enviar.
                    </p>
                    <div className="review-grid">
                      {reviewRows.map(([k, v, full]) => (
                        <div className={`ri${full ? " full" : ""}`} key={k}>
                          <span className="rk">{k}</span>
                          <span className="rv">{v}</span>
                        </div>
                      ))}
                    </div>
                    <label className="consent">
                      <input
                        type="checkbox"
                        name="consent"
                        checked={consent}
                        onChange={(e) => {
                          setConsent(e.target.checked);
                          if (e.target.checked) setConsentError("");
                        }}
                      />
                      <span>
                        Autorizo el tratamiento de mis datos personales conforme a
                        la{" "}
                        <a href="/legal/privacidad" target="_blank" rel="noopener">
                          Política de Privacidad
                        </a>{" "}
                        y la Ley 1581 de 2012 (Habeas Data).
                      </span>
                    </label>
                    <em className={`err err-consent${consentError ? " show" : ""}`}>
                      {consentError}
                    </em>
                  </section>
                )}
              </>
            )}
          </form>

          {/* footer nav */}
          <div className="apply-nav">
            {submitStatus === "success" ? (
              <button className="btn btn-navy btn-block" type="button" onClick={closeApply}>
                Entendido
              </button>
            ) : submitStatus === "error" ? (
              <button className="btn btn-navy btn-block" type="button" onClick={submit}>
                Reintentar envío <span className="btn-arrow">→</span>
              </button>
            ) : (
              <>
                <button
                  className="btn btn-ghost apply-back"
                  type="button"
                  style={{ visibility: step > 1 ? "visible" : "hidden" }}
                  disabled={submitStatus === "pending"}
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                >
                  ← Atrás
                </button>
                <button
                  className="btn btn-navy apply-next"
                  type="button"
                  disabled={submitStatus === "pending"}
                  onClick={onNext}
                >
                  {submitStatus === "pending" ? (
                    <>
                      <span className="btn-spinner" aria-hidden="true" /> Enviando…
                    </>
                  ) : step === 3 ? (
                    <>
                      Enviar solicitud <span className="btn-arrow">→</span>
                    </>
                  ) : (
                    <>
                      Continuar <span className="btn-arrow">→</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
