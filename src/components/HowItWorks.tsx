const STEPS = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <rect x="8" y="5" width="8" height="3" rx="1" />
        <path d="M8 12 h2 M14 12 h2 M8 15 h2 M14 15 h2 M8 18 h2 M14 18 h2" />
      </svg>
    ),
    title: 'Simula tu crédito',
    text: 'Conoce tu cuota y tasa en segundos.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 3 H14 L19 8 V21 H7 Z M14 3 V8 H19" />
        <path d="M12 18 V12 M9.5 14 L12 11.5 14.5 14" />
      </svg>
    ),
    title: 'Sube tus documentos',
    text: 'Cédula y un soporte. 100% en línea.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7 v5 l3.5 2" />
      </svg>
    ),
    title: 'Análisis en minutos',
    text: 'Evaluamos tu solicitud automáticamente.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5 a8.5 8.5 0 1 1-4.4-7.4 L21 4 v4 h-4" />
        <path d="M8.5 12 l2.3 2.3 4.5-4.8" />
      </svg>
    ),
    title: 'Recibe tu decisión',
    text: 'Te avisamos por WhatsApp y correo.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21 h18 M4 21 V10 M20 21 V10 M8 21 V10 M16 21 V10 M12 21 V10 M3 10 L12 3 L21 10 Z" />
      </svg>
    ),
    title: 'Recibe tu dinero',
    text: 'Desembolso directo a tu cuenta.',
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-16 lg:py-24 bg-bg-soft">
      <div className="mx-auto max-w-container px-6">
        <div className="reveal mb-10">
          <p className="text-sm font-semibold text-green-ink mb-2">Cómo funciona</p>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-navy">
            Un proceso claro en 5 pasos.
          </h2>
        </div>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 reveal d1">
          {STEPS.map((s, i) => (
            <li key={i} className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5 text-navy">
                {s.icon}
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white text-xs font-bold">
                  {i + 1}
                </span>
              </div>
              <h4 className="text-base font-bold text-navy">{s.title}</h4>
              <p className="text-sm text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
