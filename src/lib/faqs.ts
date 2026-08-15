export interface Faq {
  q: string;
  verdict: string;
  explanation: string;
  icon: 'shield' | 'bolt' | 'document' | 'refresh' | 'star';
}

export const FAQS: Faq[] = [
  {
    q: '¿Simular o solicitar me baja puntos o afecta en Datacrédito?',
    verdict: 'No, simular no afecta tu historial ni baja tu puntaje en centrales de riesgo.',
    explanation:
      'Puedes cotizar diferentes montos y plazos con total libertad. La validación formal solo se realiza si decides enviar tu solicitud definitiva.',
    icon: 'shield',
  },
  {
    q: '¿Cuánto demora en llegar el dinero a mi cuenta o Nequi?',
    verdict: 'La evaluación toma minutos y el desembolso es inmediato una vez aceptada la oferta.',
    explanation:
      'Transferimos los fondos directamente a tu cuenta bancaria, Nequi o DaviPlata tan pronto apruebes las condiciones.',
    icon: 'bolt',
  },
  {
    q: '¿Qué requisitos necesito para solicitar? ¿Piden fiador?',
    verdict: 'Solo necesitas tu cédula de ciudadanía vigente y soporte de ingresos. Cero fiadores.',
    explanation:
      'Todo el proceso es 100% digital desde tu celular, sin papeleos físicos, sin filas y sin trámites notariales.',
    icon: 'document',
  },
  {
    q: '¿Puedo pagar mi crédito antes de tiempo sin penalidades?',
    verdict: 'Sí, puedes hacer abonos a capital o liquidar el crédito anticipadamente sin ningún cobro extra.',
    explanation:
      'Tienes total libertad para pagar cuando quieras, liquidando únicamente los intereses del tiempo que utilizaste el dinero.',
    icon: 'refresh',
  },
  {
    q: '¿Puedo aplicar si no tengo historial crediticio bancario?',
    verdict: 'Sí, puedes aplicar incluso si estás iniciando tu vida crediticia o no tienes historial previo.',
    explanation:
      'Evaluamos tu perfil de forma integral con modelos propios para darte la oportunidad de acceder y construir tu historial financiero.',
    icon: 'star',
  },
];
