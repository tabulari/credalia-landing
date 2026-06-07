'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { config } from '@/lib/config';
import { cn } from '@/lib/utils';
import { CalculatorIcon, DocUploadIcon, RefreshCheckIcon, BankIcon } from './icons';
import { ApplyButton } from './ApplyButton';

const STEPS = [
  {
    icon: <CalculatorIcon size={22} className="text-navy" />,
    title: 'Simula tu crédito',
    text: 'Conoce tu cuota y tasa en segundos.',
  },
  {
    icon: <DocUploadIcon size={22} className="text-navy" />,
    title: 'Sube tus documentos',
    text: 'Cédula y un soporte. 100% en línea.',
  },
  {
    icon: <RefreshCheckIcon size={22} className="text-navy" />,
    title: 'Confirma tu aprobación',
    text: 'Te avisamos por WhatsApp al instante.',
  },
  {
    icon: <BankIcon size={22} className="text-green" />,
    title: 'Recibe tu dinero',
    text: config.disbursementTime
      ? `Desembolso en ${config.disbursementTime} directo a tu cuenta.`
      : 'Desembolso directo a tu cuenta.',
  },
];

const STEP_ACCENTS = [
  'bg-green/25',
  'bg-green/50',
  'bg-green/75',
  'bg-green',
] as const;

export function HowItWorks() {
  const containerRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const cards = containerRef.current?.querySelectorAll('[data-hiw="step"]');
    const heading = containerRef.current?.querySelector('[data-hiw="heading"]');
    const eyebrow = containerRef.current?.querySelector('[data-hiw="eyebrow"]');
    const cta = containerRef.current?.querySelector('[data-hiw="cta"]');

    if (eyebrow) {
      gsap.fromTo(eyebrow,
        { y: 15, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power2.out',
          scrollTrigger: { trigger: eyebrow, start: 'top 85%' } });
    }
    if (heading) {
      gsap.fromTo(heading,
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: heading, start: 'top 85%' } });
    }

    if (cards && cards.length) {
      const isDesktop = window.innerWidth >= 1280;

      const tl = gsap.timeline({
        scrollTrigger: isDesktop
          ? {
              trigger: containerRef.current,
              start: 'top 75%',
              end: 'center 40%',
              scrub: 0.8,
            }
          : { trigger: containerRef.current, start: 'top 78%' },
      });

      const stepGap = isDesktop ? 0.18 : 0.14;
      const cardDur = isDesktop ? 0.35 : 0.5;
      const cardEase = isDesktop ? 'power2.out' : 'power3.out';

      cards.forEach((card, i) => {
        const isLast = i === cards.length - 1;
        const accent = card.querySelector('[data-hiw="accent"]');
        const badge = card.querySelector('[data-hiw="badge"]');
        const glow = card.querySelector('[data-hiw="glow"]');
        const pos = i * stepGap;

        if (accent) {
          tl.fromTo(accent,
            { scaleY: 0 },
            { scaleY: 1, duration: isDesktop ? 0.25 : 0.35, ease: 'power2.out', transformOrigin: 'top' },
            pos
          );
        }

        tl.fromTo(card,
          { y: isDesktop ? 20 : 25, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: cardDur, ease: cardEase },
          pos
        );

        if (badge) {
          tl.fromTo(badge,
            { scale: 0.5, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: isDesktop ? 0.25 : 0.35, ease: 'back.out(2.5)' },
            pos + (isDesktop ? 0.1 : 0.08)
          );
        }

        if (isLast && glow) {
          tl.fromTo(glow,
            { autoAlpha: 0, scale: 0.7 },
            { autoAlpha: 1, scale: 1, duration: isDesktop ? 0.3 : 0.5, ease: 'power2.out' },
            pos + (isDesktop ? 0.2 : 0.2)
          );
        }
      });

      if (cta) {
        const lastPos = (cards.length - 1) * stepGap;
        tl.fromTo(cta,
          { y: 15, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power2.out' },
          lastPos + 0.3
        );
      }
    }

    if (lineRef.current) {
      gsap.fromTo(lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            end: 'center 50%',
            scrub: 1,
          },
        },
      );
    }
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="como-funciona" aria-labelledby="hiw-heading" className="py-16 lg:py-24 bg-green-soft">
      <div className="mx-auto max-w-container px-6">
        <div className="mb-12 lg:mb-14">
          <p data-hiw="eyebrow" className="text-xs font-semibold uppercase tracking-widest text-green-ink mb-2">Cómo funciona</p>
          <h2 data-hiw="heading" id="hiw-heading" className="text-2xl lg:text-3xl font-display tracking-tight text-navy">
            Un proceso claro en 4 pasos.
          </h2>
        </div>

        <div className="relative">
          <div
            ref={lineRef}
            className="hidden lg:block absolute top-8 left-[8%] right-[8%] h-0.5 bg-green/25 origin-left"
            aria-hidden="true"
          />
          <ol className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {STEPS.map((s, i) => {
              const isLast = i === STEPS.length - 1;
              return (
                <li key={i} data-hiw="step" className={cn(
                  'relative rounded-lg bg-white',
                  'p-3 sm:p-5',
                  'shadow-[0_1px_3px_rgba(13,42,94,0.08)]',
                  'hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(13,42,94,0.12)]',
                  'transition-[shadow,transform] duration-300',
                  'lg:flex lg:flex-col lg:items-center lg:text-center lg:pt-8',
                  isLast && 'ring-1 ring-green/30',
                )}>
                  <div
                    data-hiw="accent"
                    className={cn(
                      'absolute left-0 top-3 bottom-3 w-1 rounded-full',
                      STEP_ACCENTS[i],
                    )}
                    aria-hidden="true"
                  />

                  <div className="flex items-center gap-2 sm:gap-2.5 lg:flex-col lg:gap-1">
                    <span
                      data-hiw="badge"
                      className={cn(
                        'flex items-center justify-center rounded-full font-bold shrink-0',
                        isLast
                          ? 'w-9 h-9 sm:w-11 sm:h-11 bg-green-tint text-green-ink text-sm sm:text-base border-2 border-green'
                          : 'w-8 h-8 sm:w-10 sm:h-10 bg-green-tint text-green-ink text-xs sm:text-sm',
                      )}
                    >
                      <span className="sr-only">Paso </span>{i + 1}
                    </span>
                    {s.icon}
                  </div>
                  <h3 className={cn('mt-1.5 sm:mt-2 text-navy', isLast ? 'text-sm sm:text-base font-bold' : 'text-xs sm:text-sm font-semibold')}>{s.title}</h3>
                  <p className={cn('mt-0.5 sm:mt-1', isLast ? 'text-xs sm:text-sm text-navy/70' : 'text-[11px] sm:text-xs text-muted-foreground')}>{s.text}</p>

                  {isLast && (
                    <div
                      data-hiw="glow"
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4/5 h-4 bg-green/15 blur-lg rounded-full"
                      aria-hidden="true"
                    />
                  )}
                </li>
              );
            })}
          </ol>

          <div data-hiw="cta" className="mt-8 text-center">
            <ApplyButton origin="hiw" size="lg">
              Comienza tu solicitud
            </ApplyButton>
          </div>
        </div>
      </div>
    </section>
  );
}
