import { WhatsAppLink } from './WhatsAppLink';

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1e9e55" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21 l-4.3-4.3" />
      </svg>
    ),
    title: 'Conoce tu cuota antes de aplicar',
    text: 'Simula y conoce tu cuota y tasa antes de iniciar la solicitud.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1e9e55" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 L20 5 V11 C20 16.5 16.5 20.5 12 22 C7.5 20.5 4 16.5 4 11 V5 Z" />
        <path d="M9 12 l2 2 4-4.5" />
      </svg>
    ),
    title: '100% en línea, sin papeles',
    text: 'Todo el proceso es digital, sin visitas ni filas presenciales.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1e9e55" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 3 H14 L19 8 V21 H7 Z M14 3 V8 H19" />
        <path d="M9.5 14 l1.6 1.6 3.4-3.4" />
      </svg>
    ),
    title: 'Simular no afecta tu historial',
    text: 'La simulación no genera consultas en centrales de riesgo.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1e9e55" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10 V7 a4 4 0 0 1 8 0 v3" />
      </svg>
    ),
    title: 'Desembolso directo a tu cuenta',
    text: 'Si te aprueban, recibes el dinero en tu cuenta bancaria.',
  },
];

export function SimulateSection({ children }: { children: React.ReactNode }) {
  return (
    <section id="simula" className="py-16 lg:py-24 bg-bg-soft">
      <div className="mx-auto max-w-container px-6">
        <h2 className="text-2xl lg:text-3xl font-extrabold text-navy mb-8">
          Simula tu crédito
        </h2>
        <div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start">
          {/* Features card */}
          <div className="reveal bg-card border border-border rounded-[22px] p-7 shadow-sm flex flex-col gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex gap-3.5 items-start">
                <div className="shrink-0 flex items-center justify-center w-9 h-9 rounded-[10px] bg-green-tint">
                  {f.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-navy leading-snug">{f.title}</h4>
                  <p className="text-sm text-muted-foreground mt-0.5">{f.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Simulator + WhatsApp link */}
          <div className="flex flex-col gap-4">
            {children}
            <WhatsAppLink
              ctx="hero"
              className="flex items-center justify-center gap-2 text-sm font-semibold text-green-ink hover:text-green-ink/80 transition-colors"
            >
              <span className="wa-ico" aria-hidden="true" />
              Hablar por WhatsApp
            </WhatsAppLink>
          </div>
        </div>
      </div>
    </section>
  );
}
