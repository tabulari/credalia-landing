import { z } from "zod";
import { config } from "./config";

/**
 * Single source of validation for the application form — used by the client
 * (inline per-field + per-step) AND the server route. Rules and messages are
 * ported verbatim from the prototype `solicitud.js` RULES. Field identifiers
 * are English; user-facing messages/options stay Spanish.
 *
 * Banks and employment types come from config (env-driven).
 */

export const EMPLOYMENT_TYPES = config.application.employmentTypes;
export const BANKS = config.application.banks;

const MSG = {
  fullName: "Ingresa tu nombre y apellido.",
  idNumber: "Ingresa un número de cédula válido.",
  phone: "El celular debe tener 10 dígitos.",
  email: "Ingresa un correo válido.",
  employmentType: "Selecciona tu tipo de empleo.",
  income: "Ingresa tu ingreso mensual.",
  bank: "Selecciona tu banco.",
  consent: "Debes autorizar el tratamiento de datos para continuar.",
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const digits = (s: string) => s.replace(/\D/g, "");

/** Per-field schemas — reused for inline client validation and the composite. */
export const fieldSchemas = {
  fullName: z
    .string()
    .refine((v) => v.trim().length >= 5 && v.trim().includes(" "), MSG.fullName),
  idNumber: z.string().refine((v) => digits(v).length >= 6, MSG.idNumber),
  phone: z.string().refine((v) => digits(v).length === 10, MSG.phone),
  email: z.string().refine((v) => EMAIL_RE.test(v.trim()), MSG.email),
  employmentType: z
    .string()
    .refine((v) => (EMPLOYMENT_TYPES as readonly string[]).includes(v), MSG.employmentType),
  income: z.string().refine((v) => digits(v).length >= 5, MSG.income),
  bank: z.string().refine((v) => (BANKS as readonly string[]).includes(v), MSG.bank),
} as const;

export type FieldName = keyof typeof fieldSchemas;

export const STEP_FIELDS: Record<number, FieldName[]> = {
  1: ["fullName", "idNumber", "phone", "email"],
  2: ["employmentType", "income", "bank"],
};

export const CONSENT_MESSAGE = MSG.consent;

/** Validate one field; returns the error message ("" when valid). */
export function validateField(name: FieldName, value: string): string {
  const r = fieldSchemas[name].safeParse(value);
  return r.success ? "" : (r.error.issues[0]?.message ?? "Valor inválido");
}

/** Composite schema for the server route (and a full client check). */
export const applicationSchema = z.object({
  fullName: fieldSchemas.fullName,
  idNumber: fieldSchemas.idNumber,
  phone: fieldSchemas.phone,
  email: fieldSchemas.email,
  employmentType: fieldSchemas.employmentType,
  income: fieldSchemas.income,
  bank: fieldSchemas.bank,
  consent: z.boolean().refine((v) => v === true, { message: MSG.consent }),
  // Frozen simulator snapshot (full Simulation shape). The server route maps
  // `term`/`monthlyRate` to Core's `termMonths`/`monthlyInterestRate` before
  // forwarding — see app/api/application/route.ts.
  terms: z
    .object({ amount: z.number(), term: z.number(), monthlyRate: z.number() })
    .passthrough()
    .optional(),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
