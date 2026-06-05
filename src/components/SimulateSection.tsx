const FEATURES = [
  {
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1e9e55" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21 l-4.3-4.3" />
      </svg>
    ),
    title: 'Conoce tu cuota antes de aplicar',
    text: 'Simula y conoce tu cuota y tasa antes de iniciar la solicitud.',
  },
  {
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1e9e55" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 L20 5 V11 C20 16.5 16.5 20.5 12 22 C7.5 20.5 4 16.5 4 11 V5 Z" />
        <path d="M9 12 l2 2 4-4.5" />
      </svg>
    ),
    title: '100% en línea, sin papeles',
    text: 'Todo el proceso es digital, sin visitas ni filas presenciales.',
  },
  {
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1e9e55" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 3 H14 L19 8 V21 H7 Z M14 3 V8 H19" />
        <path d="M9.5 14 l1.6 1.6 3.4-3.4" />
      </svg>
    ),
    title: 'Simular no afecta tu historial',
    text: 'La simulación no genera consultas en centrales de riesgo.',
  },
  {
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1e9e55" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21 h18 M4 21 V10 M20 21 V10 M9 21 V10 M15 21 V10 M3 10 L12 4 L21 10 Z" />
      </svg>
    ),
    title: 'Desembolso directo a tu cuenta',
    text: 'Si te aprueban, recibes el dinero en tu cuenta bancaria.',
  },
];

export function SimulateSection({ children }: { children: React.ReactNode }) {
  return (
    <section id="simula" className="py-16 lg:py-24 bg-bg-soft">
      <div className="mx-auto max-w-container px-6 grid lg:grid-cols-2 gap-8 items-start">
        <div className="reveal">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-navy mb-5">
            Simula tu crédito
          </h2>
          <div id="requisitos" className="flex flex-col gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex gap-3">
                <div className="shrink-0 flex items-start justify-center w-10 h-10 rounded-lg bg-green-tint text-green mt-0.5">
                  {f.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-navy">{f.title}</h4>
                  <p className="text-sm text-muted-foreground">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
