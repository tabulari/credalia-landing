'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';
import { config } from '@/lib/config';
import { fmtCOP } from '@/lib/credit';
import { ApplyButton } from './ApplyButton';
import { ScrollButton } from './ScrollButton';
import { PhoneChat } from './PhoneChat';
import { WhatsAppLink } from './WhatsAppLink';
import { ShieldCheckIcon, LockIcon, ClockIcon, CredaliaLogo } from './icons';

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      const badge = containerRef.current?.querySelector('[data-hero="badge"]');
      const h1 = h1Ref.current;
      const amount = containerRef.current?.querySelector('[data-hero="amount"]');
      const subhead = containerRef.current?.querySelector('[data-hero="subhead"]');
      const ctas = containerRef.current?.querySelector('[data-hero="ctas"]');
      const whatsapp = containerRef.current?.querySelector('[data-hero="whatsapp"]');
      const phone = containerRef.current?.querySelector('[data-hero="phone"]');
      const trustCard = containerRef.current?.querySelector('[data-hero="trust-card"]');

      if (badge) tl.from(badge, { y: 20, autoAlpha: 0, duration: 0.6 }, 0);

      if (h1) {
        const split = SplitText.create(h1, { type: 'chars, words', aria: 'hidden' });
        tl.from(split.chars, {
          y: 60,
          autoAlpha: 0,
          stagger: 0.025,
          duration: 0.7,
        }, 0.1);
      }

      if (amount) tl.from(amount, { scale: 0.85, autoAlpha: 0, duration: 0.6, ease: 'back.out(1.4)' }, 0.35);
      if (subhead) tl.from(subhead, { y: 15, autoAlpha: 0, duration: 0.5 }, 0.5);
      if (ctas) tl.from(ctas as Element, { y: 20, autoAlpha: 0, duration: 0.5 }, 0.65);
      if (whatsapp) tl.from(whatsapp, { autoAlpha: 0, duration: 0.4 }, 0.85);

      if (phone) {
        const phoneEl = phone.querySelector('.phone');
        if (phoneEl) tl.from(phoneEl, { y: 50, autoAlpha: 0, rotateY: -8, scale: 0.94, duration: 0.7, ease: 'power3.out' }, 0.15);
      }

      if (trustCard) {
        const items = trustCard.querySelectorAll('[data-hero="trust-item"]');
        tl.from(items, { y: 15, autoAlpha: 0, stagger: 0.08, duration: 0.4 }, 0.7);
      }
    }, containerRef);

    return () => { mm.revert(); ctx.revert(); };
  }, { scope: containerRef });

  return (
    <section ref={containerRef} aria-labelledby="hero-heading" className="pt-12 pb-8 lg:pt-16 lg:pb-12 stack:py-0 overflow-hidden hero-atmosphere stack:min-h-[calc(100vh-68px)] stack:flex stack:items-center">
      <div className="w-full mx-auto max-w-container px-6 grid stack:grid-cols-[1.3fr_0.7fr] gap-8 lg:gap-10 items-center">
        <div className="flex flex-col gap-3 lg:gap-4 relative z-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-green-ink mb-1">Credalia Digital</p>
          <span data-hero="badge" className="inline-flex items-center gap-2 text-sm font-semibold text-green-ink bg-green-tint rounded-full px-3 py-1.5 w-fit">
            <ShieldCheckIcon size={20} className="text-green-ink" />
            {config.disbursementTime
              ? `100% en línea · Dinero en ${config.disbursementTime}`
              : '100% en línea'}
          </span>
          <h1 ref={h1Ref} id="hero-heading" className="text-5xl lg:text-7xl font-display tracking-tight text-navy leading-tight">
            Préstamos rápidos hasta{' '}
          </h1>
          <span data-hero="amount" className="block text-4xl lg:text-6xl tracking-tight font-extrabold text-orange leading-none">{`$${fmtCOP(config.simulator.amountMax).replace(',00','')}`}</span>
          <p data-hero="subhead" className="text-lg font-normal text-muted-foreground">
            Respuesta en minutos. Tasa clara. Sin papeles.
          </p>
          <div data-hero="ctas" data-slot="hero-ctas" className="flex flex-wrap gap-4">
            <ScrollButton variant="default" size="lg" target="#simula">
              Simular mi crédito <span aria-hidden="true">→</span>
            </ScrollButton>
            <ApplyButton variant="outline" size="lg">
              Solicitar crédito <span aria-hidden="true">→</span>
            </ApplyButton>
          </div>
          <div data-hero="whatsapp" className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
            <WhatsAppLink
              ctx="hero"
              className="inline-flex items-center gap-2 text-sm text-green-ink hover:text-green-ink/80 transition-colors py-3"
            >
              <span className="wa-ico" aria-hidden="true" />
              <span>
                ¿Dudas? Escríbenos por <b>WhatsApp</b>
              </span>
            </WhatsAppLink>
            {config.regulatorVerified && (
              <>
                <span className="hidden sm:inline text-border" aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-2">
                  <ShieldCheckIcon size={16} className="text-muted-2" />
                  Vigilados por <b>{config.regulatorShortName}</b>
                </span>
                <span className="hidden sm:inline text-border" aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-2">
                  <LockIcon size={16} className="text-muted-2" />
                  Datos <b>cifrados</b>
                </span>
              </>
            )}
          </div>
        </div>

        <div data-hero="phone" className="relative z-10 flex items-center justify-center mt-8 stack:mt-0" style={{ perspective: '1200px' }}>
          <div style={{ transformStyle: 'preserve-3d' }}>
            <PhoneChat />
          </div>
        </div>

        <div data-hero="trust-card" className="stack:hidden bg-card border border-border rounded-xl p-4 shadow-sm mt-10 relative z-10">
          <div className="flex items-center gap-2.5 mb-3">
            <CredaliaLogo size={28} />
            <div>
              <p className="text-sm font-extrabold text-navy">{config.brandName}</p>
              <p className="text-xs text-muted-2">Crédito digital 100% en línea</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div data-hero="trust-item" className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-tint text-green shrink-0">
                <ClockIcon size={18} />
              </span>
              <span className="text-sm font-medium text-navy-ink">
                {config.disbursementTime
                  ? `Dinero en tu cuenta en ${config.disbursementTime}`
                  : 'Respuesta en minutos'}
              </span>
            </div>
            <div data-hero="trust-item" className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-tint text-green shrink-0">
                <ShieldCheckIcon size={18} />
              </span>
              <span className="text-sm font-medium text-navy-ink">Sin afectar tu historial</span>
            </div>
            <div data-hero="trust-item" className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-tint text-green shrink-0">
                <LockIcon size={18} />
              </span>
              <span className="text-sm font-medium text-navy-ink">Datos cifrados de extremo a extremo</span>
            </div>
          </div>
          {config.regulatorVerified && (
            <p className="mt-2 text-xs text-muted-2 border-t border-border pt-2">
              Vigilado por la {config.regulatorName}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
