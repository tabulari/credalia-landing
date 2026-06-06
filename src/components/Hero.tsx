import { config } from '@/lib/config';
import { fmtCOP } from '@/lib/credit';
import { ApplyButton } from './ApplyButton';
import { ScrollButton } from './ScrollButton';
import { PhoneChat } from './PhoneChat';
import { WhatsAppLink } from './WhatsAppLink';
import { ShieldCheckIcon, LockIcon, ClockIcon, CredaliaLogo } from './icons';

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="py-16 lg:py-20 overflow-hidden">
      <div className="mx-auto max-w-container px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-green-ink bg-green-tint rounded-full px-3 py-1.5 w-fit">
            <ShieldCheckIcon size={20} className="text-green-ink" />
            Crédito 100% en línea
          </span>
          <h1 id="hero-heading" className="text-4xl lg:text-5xl font-extrabold text-navy leading-tight">
            Crédito digital hasta{' '}
            <span className="text-orange">{`$${fmtCOP(config.simulator.amountMax).replace(',00','')}`}</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Respuesta en minutos. Tasa clara. Sin papeles.
          </p>
          <div data-slot="hero-ctas" className="flex flex-wrap gap-3">
            <ScrollButton variant="default" size="lg" target="#simula">
              Simular mi crédito <span aria-hidden="true">→</span>
            </ScrollButton>
            <ApplyButton variant="outline" size="lg">
              Solicitar crédito <span aria-hidden="true">→</span>
            </ApplyButton>
          </div>
          <WhatsAppLink
            ctx="hero"
            className="inline-flex items-center gap-2 text-sm text-green-ink hover:text-green-ink/80 transition-colors mt-1"
          >
            <span className="wa-ico" aria-hidden="true" />
            <span>
              ¿Dudas? Escríbenos por <b>WhatsApp</b>
            </span>
          </WhatsAppLink>
          {config.regulatorVerified && (
            <div className="flex flex-wrap gap-4 mt-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-2">
                <ShieldCheckIcon size={20} className="text-muted-2" />
                Vigilados por <b>{config.regulatorShortName}</b>
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-2">
                <LockIcon size={20} className="text-muted-2" />
                Datos <b>cifrados</b>
              </span>
            </div>
          )}
        </div>

        {/* Desktop: phone mockup */}
        <div className="relative hidden lg:flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
            <svg viewBox="0 0 560 560" fill="none" className="w-full opacity-50">
              <circle cx="280" cy="280" r="120" stroke="var(--border)" strokeWidth="1.5" />
              <circle cx="280" cy="280" r="180" stroke="var(--border)" strokeWidth="1.5" />
              <circle cx="280" cy="280" r="250" stroke="var(--border)" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="absolute pointer-events-none" style={{ right: 'calc(50% + 60px)', top: '50%', transform: 'translateY(-50%)', zIndex: 0 }} aria-hidden="true">
            <svg width="130" height="130" viewBox="0 0 220 200" fill="none">
              <path d="M10 26 C10 16 18 8 28 8 L70 8 L138 92 C144 99 144 109 138 116 L70 200 L28 200 C18 200 10 192 10 182 Z" fill="var(--green)" />
              <path d="M70 26 C70 16 78 8 88 8 L130 8 L198 92 C204 99 204 109 198 116 L130 200 L88 200 C78 200 70 192 70 182 Z" fill="var(--orange)" />
              <path d="M130 26 C130 16 138 8 148 8 L190 8 L258 92 C264 99 264 109 258 116 L190 200 L148 200 C138 200 130 192 130 182 Z" fill="var(--navy)" />
            </svg>
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <PhoneChat />
          </div>
        </div>

        {/* Mobile: trust card (visible below lg breakpoint) */}
        <div className="lg:hidden bg-card border border-border rounded-[22px] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <CredaliaLogo size={36} />
            <div>
              <p className="text-base font-extrabold text-navy">{config.brandName}</p>
              <p className="text-xs text-muted-2">Crédito digital 100% en línea</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-tint text-green shrink-0">
                <ClockIcon size={18} />
              </span>
              <span className="text-sm font-medium text-navy-ink">Respuesta en minutos</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-tint text-green shrink-0">
                <ShieldCheckIcon size={18} />
              </span>
              <span className="text-sm font-medium text-navy-ink">Sin afectar tu historial</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-tint text-green shrink-0">
                <LockIcon size={18} />
              </span>
              <span className="text-sm font-medium text-navy-ink">Datos cifrados de extremo a extremo</span>
            </div>
          </div>
          {config.regulatorVerified && (
            <p className="mt-3 text-xs text-muted-2 border-t border-border pt-3">
              Vigilado por la {config.regulatorName}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
