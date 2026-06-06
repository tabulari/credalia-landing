import { WhatsAppLink } from './WhatsAppLink';
import { SearchCheckIcon, ShieldCheckIcon, DocumentCheckIcon, LockIcon } from './icons';

const FEATURES = [
  {
    icon: <SearchCheckIcon size={22} className="text-green" />,
    title: 'Conoce tu cuota antes de aplicar',
    text: 'Simula y conoce tu cuota y tasa antes de iniciar la solicitud.',
  },
  {
    icon: <ShieldCheckIcon size={22} className="text-green" />,
    title: '100% en línea, sin papeles',
    text: 'Todo el proceso es digital, sin visitas ni filas presenciales.',
  },
  {
    icon: <DocumentCheckIcon size={22} className="text-green" />,
    title: 'Simular no afecta tu historial',
    text: 'La simulación no genera consultas en centrales de riesgo.',
  },
  {
    icon: <LockIcon size={22} className="text-green" />,
    title: 'Desembolso directo a tu cuenta',
    text: 'Si te aprueban, recibes el dinero en tu cuenta bancaria.',
  },
];

export function SimulateSection({ children }: { children: React.ReactNode }) {
  return (
    <section id="simula" tabIndex={-1} aria-labelledby="simula-heading" className="py-16 lg:py-24 bg-bg-soft">
      <div className="mx-auto max-w-container px-6">
        <h2 id="simula-heading" className="text-2xl lg:text-3xl font-display tracking-tight text-navy mb-8">
          Simula tu crédito
        </h2>
        <div className="grid stack:grid-cols-[380px_1fr] gap-8 items-start">
          <div className="bg-card border border-border rounded-[22px] p-7 shadow-sm flex flex-col gap-5">
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

          <div className="flex flex-col gap-4 -mt-8 lg:-mt-12 relative z-10">
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
