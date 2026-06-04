/**
 * The 8 FAQ entries, verbatim from the prototype `app.js`. Single source for
 * the accordion (Faq.tsx), the no-JS <details> fallback, and the FAQPage
 * JSON-LD (Slice 6) — keep them in sync by importing from here.
 * Order leads with the credit + cost objections.
 */
export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: "¿Simular o solicitar afecta mi historial crediticio?",
    a: "Simular no afecta tu historial: es solo informativo y no genera consultas en centrales de riesgo. Solo al iniciar una solicitud formal realizamos la validación correspondiente.",
  },
  {
    q: "¿Cuánto cuesta el crédito en total?",
    a: "En el simulador ves el costo total estimado antes de aplicar: la suma de tus cuotas según el monto, el plazo y la tasa. Sin cargos ocultos — lo que ves es lo que pagas.",
  },
  {
    q: "¿Qué tasa se usa para calcular mi cuota?",
    a: "Usamos una tasa estimada según tu perfil, que mostramos como tasa mensual (m. v.) y su equivalente anual (E.A.). La tasa final se confirma al validar tu solicitud, siempre con total claridad.",
  },
  {
    q: "¿Puedo pagar antes del vencimiento?",
    a: "Sí. Puedes hacer abonos o pagar la totalidad de tu crédito de forma anticipada, sin penalidades.",
  },
  {
    q: "¿Qué documentos debo subir?",
    a: "Solo necesitas tu cédula y un soporte que valide tus ingresos. Todo el proceso es 100% en línea.",
  },
  {
    q: "¿Cuánto tiempo toma todo el proceso?",
    a: "La simulación es inmediata y el análisis de tu solicitud toma solo unos minutos tras subir tus documentos.",
  },
  {
    q: "¿Qué pasa si no tengo historial?",
    a: "Evaluamos tu solicitud con datos alternativos y tecnología, así que puedes aplicar incluso sin historial crediticio previo.",
  },
  {
    q: "¿Qué pasa si mi solicitud no es aprobada?",
    a: "Te explicamos los motivos y te orientamos sobre los pasos a seguir. Podrás volver a aplicar más adelante.",
  },
];
