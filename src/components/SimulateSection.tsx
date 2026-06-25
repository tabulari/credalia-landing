import { WhatsAppLink } from './WhatsAppLink';
import { Requirements } from './Requirements';

export function SimulateSection({ children }: { children: React.ReactNode }) {
  return (
    <section id="simula" tabIndex={-1} aria-labelledby="simula-heading" className="py-16 lg:py-24 stack:py-0 bg-bg-soft stack:min-h-[calc(100vh-68px)] stack:flex stack:items-center">
      <div className="w-full mx-auto max-w-container px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[0.75fr_1.25fr] gap-12 lg:gap-16 items-start w-full">
          {/* Left Column: Requirements */}
          <div className="w-full order-2 lg:order-1">
            <Requirements />
          </div>

          {/* Right Column: Simulator */}
          <div className="flex flex-col gap-4 w-full order-1 lg:order-2">
            <div className="mb-2 text-left">
              <p className="text-xs font-semibold uppercase tracking-widest text-green-ink mb-2">Simulador</p>
              <h2 id="simula-heading" className="text-2xl lg:text-3xl font-display tracking-tight text-navy">
                Simula tu crédito
              </h2>
            </div>
             {children}
           </div>

        </div>
      </div>
    </section>
  );
}
