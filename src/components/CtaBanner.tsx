import { ApplyButton } from './ApplyButton';
import { ScrollButton } from './ScrollButton';

export function CtaBanner() {
  return (
    <section aria-labelledby="cta-heading" className="bg-navy-deep text-white py-16 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="mx-auto max-w-container px-6 relative">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex items-center gap-6 flex-1 min-w-0">
            <span aria-hidden="true" className="hidden sm:block shrink-0">
              <svg width="64" height="52" viewBox="0 0 270 200" fill="none">
                <path d="M10 26 C10 16 18 8 28 8 L70 8 L138 92 C144 99 144 109 138 116 L70 200 L28 200 C18 200 10 192 10 182 Z" fill="var(--green)" />
                <path d="M70 26 C70 16 78 8 88 8 L130 8 L198 92 C204 99 204 109 198 116 L130 200 L88 200 C78 200 70 192 70 182 Z" fill="var(--orange)" />
                <path d="M130 26 C130 16 138 8 148 8 L190 8 L258 92 C264 99 264 109 258 116 L190 200 L148 200 C138 200 130 192 130 182 Z" fill="var(--navy)" />
              </svg>
            </span>
            <div>
              <h2 id="cta-heading" className="text-2xl font-display tracking-tight">
                Empieza tu solicitud con <span className="text-orange">claridad.</span>
              </h2>
              <p className="text-white/70 mt-1">
                Simula primero o solicita directo. Tú decides el ritmo.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <ScrollButton variant="white" size="default" target="#simula">
              Simular mi crédito <span aria-hidden="true">→</span>
            </ScrollButton>
            <ApplyButton variant="ghost-dark" size="default">
              Solicitar crédito <span aria-hidden="true">→</span>
            </ApplyButton>
          </div>
        </div>
      </div>
    </section>
  );
}
