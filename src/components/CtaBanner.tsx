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

      // 6. Buttons spring in
      if (buttons.length) {
        tl.from(buttons, { y: 22, scale: 0.92, autoAlpha: 0, stagger: 0.12, duration: 0.5, ease: 'back.out(1.5)' }, 0.8);
      }
      if (reassure) tl.from(reassure, { autoAlpha: 0, duration: 0.4 }, 1.05);

      // 7. One-shot sheen sweep across the panel ring
      if (sheen) {
        gsap.set(sheen, { xPercent: -270 });
        tl.to(sheen, { xPercent: 270, duration: 0.9, ease: 'power2.inOut' }, 1.1);
      }
    }, containerRef);

    return () => ctx.revert();
  }, { scope: containerRef });

  return (
    <section ref={containerRef} aria-labelledby="cta-heading" className="bg-navy-deep text-white py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none cta-chevron" aria-hidden="true">
        <svg width="200" height="160" viewBox="0 0 270 200" fill="none">
          <path d="M10 26 C10 16 18 8 28 8 L70 8 L138 92 C144 99 144 109 138 116 L70 200 L28 200 C18 200 10 192 10 182 Z" fill="white" />
          <path d="M70 26 C70 16 78 8 88 8 L130 8 L198 92 C204 99 204 109 198 116 L130 200 L88 200 C78 200 70 192 70 182 Z" fill="white" />
          <path d="M130 26 C130 16 138 8 148 8 L190 8 L258 92 C264 99 264 109 258 116 L190 200 L148 200 C138 200 130 192 130 182 Z" fill="white" />
        </svg>
      </div>
      {/* ambient colored light blooms behind the panel */}
      <div className="absolute -left-24 top-1/2 -translate-y-1/2 w-72 h-72 cta-glow cta-glow--green pointer-events-none" aria-hidden="true" />
      <div className="absolute right-10 -bottom-16 w-80 h-80 cta-glow cta-glow--orange pointer-events-none" aria-hidden="true" />
      <div className="mx-auto max-w-container px-6 relative">
        <div data-cta="panel" className="relative flex flex-col lg:flex-row items-stretch gap-6 lg:gap-10 rounded-2xl bg-white/[0.04] ring-1 ring-white/10 p-6 sm:p-8 lg:p-10 backdrop-blur-sm">
          <span className="cta-sheen" aria-hidden="true" />
          <div className="flex-1 min-w-0 relative">
            <p data-cta="eyebrow" className="text-xs font-semibold uppercase tracking-widest text-green-bright mb-2">Comienza ahora</p>
            <h2 ref={headingRef} id="cta-heading" className="text-2xl lg:text-3xl font-display tracking-tight">
              Empieza tu solicitud con <span className="text-orange">claridad.</span>
            </h2>
            <p data-cta="subhead" className="text-white/80 mt-2">
              Simula primero o solicita directo. Tú decides el ritmo.
            </p>
            <ul className="mt-5 flex flex-col gap-2.5">
              {bullets.map((b) => (
                <li key={b} data-cta="bullet" className="flex items-center gap-2.5 text-white/90">
                  <CheckCircleIcon size={20} className="text-green-bright shrink-0" />
                  <span className="text-sm font-medium">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-center items-stretch gap-3 lg:w-[260px] lg:shrink-0 lg:border-l lg:border-white/10 lg:pl-10 relative">
            <div data-cta="action">
              <ScrollButton variant="white" size="lg" target="#simula" className="w-full min-h-[52px]">
                Simular mi crédito <span aria-hidden="true">→</span>
              </ScrollButton>
            </div>
            <div data-cta="action">
              <ApplyButton variant="ghost-dark" size="lg" className="w-full min-h-[52px]">
                Solicitar crédito <span aria-hidden="true">→</span>
              </ApplyButton>
            </div>
            <p data-cta="reassure" className="text-xs text-white/50 text-center mt-1">Sin compromiso · No afecta tu historial</p>
          </div>
        </div>
      </div>
    </section>
  );
}
