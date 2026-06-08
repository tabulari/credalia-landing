import { WhatsAppLink } from './WhatsAppLink';

export function SimulateSection({ children }: { children: React.ReactNode }) {
  return (
    <section id="simula" tabIndex={-1} aria-labelledby="simula-heading" className="py-16 lg:py-24 bg-bg-soft">
      <div className="mx-auto max-w-container px-6">
        <div className="mb-12 lg:mb-14 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-green-ink mb-2">Simulador</p>
          <h2 id="simula-heading" className="text-2xl lg:text-3xl font-display tracking-tight text-navy">
            Simula tu crédito
          </h2>
        </div>
        <div className="mx-auto max-w-3xl flex flex-col gap-4">
          {children}
          <WhatsAppLink
            ctx="hero"
            className="flex items-center justify-center gap-2.5 text-sm font-semibold text-green-ink hover:text-green-ink/80 transition-colors py-3"
          >
            <span className="wa-ico" aria-hidden="true" />
            Hablar por WhatsApp
          </WhatsAppLink>
        </div>
      </div>
    </section>
  );
}
