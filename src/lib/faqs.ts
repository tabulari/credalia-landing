export interface Faq {
  q: string;
  a: string;
  preview: string;
  highlight: string;
  tag: string;
}

export const FAQS: Faq[] = [
  {
    q: "¿Simular o solicitar me baja puntos o me afecta en Datacrédito?",
    highlight: "Tranquilo: simular es 100% libre de consultas.",
    a: "Puedes probar todos los montos y plazos que quieras sin ningún miedo. Simular es solo informativo y no genera consultas en centrales de riesgo. Solo cuando tú decides enviar tu solicitud definitiva hacemos la validación formal.",
    preview: "Simular no afecta tu historial.",
    tag: "Sin riesgo",
  },
  {
    q: "¿Cuánto demora en llegar el dinero a mi cuenta o Nequi?",
    highlight: "Respuesta en minutos y desembolso directo a tu billetera.",
    a: "Nuestro motor evalúa tu solicitud en minutos y te confirma directo por WhatsApp. Una vez aceptes, transferimos tu dinero de inmediato a Nequi, DaviPlata o tu cuenta bancaria preferida.",
    preview: "Desembolso en minutos.",
    tag: "Desembolso rápido",
  },
  {
    q: "¿Qué requisitos me van a pedir? ¿Necesito fiador?",
    highlight: "Solo tu cédula vigente y soporte de ingresos. Cero fiadores.",
    a: "Olvídate de pedirle favores a nadie ni hacer filas en notarías. Solo necesitas foto de tu cédula y un soporte básico de ingresos. Todo el trámite es 100% digital desde tu celular.",
    preview: "Solo cédula y soporte.",
    tag: "Cero trámites",
  },
  {
    q: "¿Puedo pagar mi crédito antes de tiempo sin que me cobren penalidades?",
    highlight: "Total libertad: paga anticipado sin cargos extra.",
    a: "Si te entra un dinero extra, puedes hacer abonos a capital o liquidar la totalidad de tu préstamo cuando quieras. Te cobramos únicamente los intereses del tiempo que tuviste el dinero.",
    preview: "Sin penalidades por pago anticipado.",
    tag: "Flexibilidad",
  },
  {
    q: "¿Puedo aplicar si no tengo historial crediticio?",
    highlight: "Sí, evaluamos tu perfil con tecnología propia.",
    a: "No necesitas años de vida crediticia tradicional para que te escuchemos. Analizamos tus datos de forma integral para brindarte una oportunidad clara y construir tu historial.",
    preview: "Puedes aplicar sin historial bancario previo.",
    tag: "Inclusión",
  },
];
