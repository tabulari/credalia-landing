'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';
import { config } from '@/lib/config';
import { ApplyButton } from './ApplyButton';
import { ScrollButton } from './ScrollButton';
import { CheckCircleIcon } from './icons';

export function CtaBanner() {
  const containerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const bullets = [
    'Sin papeleos complicados',
    config.disbursementTime
      ? `Dinero en tu cuenta en ${config.disbursementTime}`
      : 'Respuesta en minutos',
    'Tasa clara, sin sorpresas',
  ];

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const root = containerRef.current;
    if (!root) return;

    const panel = root.querySelector('[data-cta="panel"]');
    const eyebrow = root.querySelector('[data-cta="eyebrow"]');
    const subhead = root.querySelector('[data-cta="subhead"]');
    const bulletEls = root.querySelectorAll('[data-cta="bullet"]');
    const trust = root.querySelector('[data-cta="trust"]');
    const buttons = root.querySelectorAll('[data-cta="action"]');
    const reassure = root.querySelector('[data-cta="reassure"]');
    const sheen = root.querySelector('.cta-sheen');
    const heading = headingRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: panel, start: 'top 82%' },
      });

      // 1. The whole panel lifts and scales in
      if (panel) {
        tl.from(panel, { y: 48, scale: 0.94, autoAlpha: 0, duration: 0.8, ease: 'power3.out' }, 0);
      }

      // 2. Eyebrow
      if (eyebrow) tl.from(eyebrow, { y: 16, autoAlpha: 0, duration: 0.45 }, 0.25);

      // 3. Heading — assemble word by word
      if (heading) {
        const split = SplitText.create(heading, { type: 'words', aria: 'hidden' });
        tl.from(split.words, { y: 28, autoAlpha: 0, stagger: 0.06, duration: 0.6 }, 0.3);
        // emphasis pop on the highlighted word ("claridad.")
        const accent = heading.querySelector('.text-orange');
        if (accent) {
          tl.fromTo(
            accent,
            { scale: 0.7, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'back.out(2)' },
            '>-0.1',
          );
        }
      }

      // 4. Subhead
      if (subhead) tl.from(subhead, { y: 14, autoAlpha: 0, duration: 0.45 }, 0.55);

      // 5. Bullets cascade with their check icons
      if (bulletEls.length) {
        tl.from(bulletEls, { x: -14, autoAlpha: 0, stagger: 0.1, duration: 0.45 }, 0.65);
      }

      // 5b. Trust badge fades in
      if (trust) {
        tl.from(trust, { y: 10, autoAlpha: 0, duration: 0.45 }, 0.8);
      }

      // 6. Buttons spring in
      if (buttons.length) {
        tl.from(buttons, { y: 22, scale: 0.92, autoAlpha: 0, stagger: 0.12, duration: 0.5, ease: 'back.out(1.5)' }, 0.95);
      }
      if (reassure) tl.from(reassure, { autoAlpha: 0, duration: 0.4 }, 1.2);

      // 7. One-shot sheen sweep across the panel ring
      if (sheen) {
        gsap.set(sheen, { xPercent: -270 });
        tl.to(sheen, { xPercent: 270, duration: 0.9, ease: 'power2.inOut' }, 1.25);
      }
    }, containerRef);

    return () => ctx.revert();
  }, { scope: containerRef });

  return (
    <section ref={containerRef} aria-labelledby="cta-heading" className="bg-navy-deep text-white py-12 lg:py-16 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      {/* ambient green light bloom behind the panel */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 cta-glow cta-glow--green pointer-events-none" aria-hidden="true" />
      <div className="mx-auto max-w-container px-6 relative pb-4">
        <div data-cta="panel" className="relative flex flex-col items-center text-center max-w-4xl mx-auto rounded-2xl bg-white/[0.04] ring-1 ring-white/10 p-6 sm:p-10 backdrop-blur-sm">
          <span className="cta-sheen" aria-hidden="true" />
          
          <div className="relative w-full flex flex-col items-center">
            <p data-cta="eyebrow" className="text-xs font-semibold uppercase tracking-widest text-green-bright mb-2">Comienza ahora</p>
            <h2 ref={headingRef} id="cta-heading" className="text-3xl lg:text-4xl font-display tracking-tight max-w-2xl">
              Empieza tu solicitud con <span className="text-orange">claridad.</span>
            </h2>
            <p data-cta="subhead" className="text-white/80 mt-3 max-w-md text-sm sm:text-base">
              Simula primero o solicita directo. Tú decides el ritmo.
            </p>
            
            <ul className="mt-6 flex flex-col sm:flex-row flex-wrap justify-center items-center gap-x-8 gap-y-3 w-full">
              {bullets.map((b) => (
                <li key={b} data-cta="bullet" className="flex items-center gap-2 text-white/90">
                  <CheckCircleIcon size={18} className="text-green-bright shrink-0" />
                  <span className="text-sm font-medium">{b}</span>
                </li>
              ))}
            </ul>
            
            {/* Small trust badge centered to add social proof without taking space */}
            <div data-cta="trust" className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 opacity-90">
              <div className="flex items-center gap-1">
                <div className="flex text-orange shrink-0">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-[11px] font-semibold text-white/90">4.9/5 Calificación</span>
              </div>
              <span className="text-white/20 text-xs" aria-hidden="true">•</span>
              <span className="text-[11px] text-white/70 flex items-center gap-1">
                <svg className="w-3 h-3 text-green-bright shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Trámite 100% Seguro
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md relative">
            <div data-cta="action" className="w-full sm:flex-1">
              <ScrollButton variant="white" size="lg" target="#simula" className="w-full min-h-[52px]">
                Simular mi crédito <span aria-hidden="true">→</span>
              </ScrollButton>
            </div>
            <div data-cta="action" className="w-full sm:flex-1">
              <ApplyButton variant="ghost-dark" size="lg" className="w-full min-h-[52px]">
                Solicitar crédito <span aria-hidden="true">→</span>
              </ApplyButton>
            </div>
          </div>
          <p data-cta="reassure" className="text-xs text-white/50 text-center mt-3">Sin compromiso · No afecta tu historial</p>
          
        </div>
      </div>
    </section>
  );
}
