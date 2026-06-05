const REQS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21 a7 7 0 0 1 14 0" />
      </svg>
    ),
    label: 'Ser mayor de edad',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="8.5" cy="11" r="2" />
        <path d="M13 9 h5 M13 13 h5 M5.5 16 a3 3 0 0 1 6 0" />
      </svg>
    ),
    label: 'Cédula colombiana',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="13" rx="2" />
        <path d="M2 10 h20 M6 15 h4" />
      </svg>
    ),
    label: 'Una cuenta bancaria a tu nombre',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 3 H14 L19 8 V21 H7 Z M14 3 V8 H19" />
        <path d="M9.5 13 h5 M9.5 16.5 h5" />
      </svg>
    ),
    label: 'Un soporte de ingresos',
  },
];

export function Requirements() {
  return (
    <section id="requisitos-band" className="py-16 lg:py-24">
      <div className="mx-auto max-w-container px-6">
        <div className="reveal mb-10 text-center">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-navy mb-3">
            ¿Qué necesitas para aplicar?
          </h2>
          <p className="text-muted-foreground">
            Requisitos simples. Si cumples con esto, puedes solicitar tu crédito.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 reveal d1">
          {REQS.map((r) => (
            <div
              key={r.label}
              className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-card text-center hover:shadow-md transition-shadow"
            >
              <span className="flex items-center justify-center w-11 h-11 rounded-full bg-green-tint text-green">
                {r.icon}
              </span>
              <span className="text-sm font-semibold text-foreground">{r.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
