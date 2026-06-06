'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { CalculatorIcon, DocUploadIcon, ClockIcon, RefreshCheckIcon, BankIcon } from './icons';

const STEPS = [
  {
    icon: <CalculatorIcon size={26} className="text-navy" />,
    title: 'Simula tu crédito',
    text: 'Conoce tu cuota y tasa en segundos.',
  },
  {
    icon: <DocUploadIcon size={26} className="text-navy" />,
    title: 'Sube tus documentos',
    text: 'Cédula y un soporte. 100% en línea.',
  },
  {
    icon: <ClockIcon size={26} className="text-navy" />,
    title: 'Análisis en minutos',
    text: 'Evaluamos tu solicitud automáticamente.',
  },
  {
    icon: <RefreshCheckIcon size={26} className="text-navy" />,
    title: 'Recibe tu decisión',
    text: 'Te avisamos por WhatsApp y correo.',
  },
  {
    icon: <BankIcon size={26} className="text-navy" />,
    title: 'Recibe tu dinero',
    text: 'Desembolso directo a tu cuenta.',
  },
];

export function HowItWorks() {
  const containerRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const cards = containerRef.current?.querySelectorAll('[data-hiw="step"]');
    const heading = containerRef.current?.querySelector('[data-hiw="heading"]');
    const eyebrow = containerRef.current?.querySelector('[data-hiw="eyebrow"]');

    if (eyebrow) {
      gsap.from(eyebrow, { y: 15, autoAlpha: 0, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: eyebrow, start: 'top 85%' } });
    }
    if (heading) {
      gsap.from(heading, { y: 20, autoAlpha: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: heading, start: 'top 85%' } });
    }
    if (cards && cards.length) {
      gsap.from(cards, {
        y: 30,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: containerRef.current, start: 'top 80%' },
      });
    }

    if (lineRef.current && !reduceMotion) {
      gsap.fromTo(lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            end: 'bottom 70%',
            scrub: 1,
          },
        },
      );
    }
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="como-funciona" aria-labelledby="hiw-heading" className="py-16 lg:py-24 bg-green-soft">
      <div className="mx-auto max-w-container px-6">
        <div className="mb-10">
          <p data-hiw="eyebrow" className="text-xs font-semibold uppercase tracking-widest text-green-ink mb-2">Cómo funciona</p>
          <h2 data-hiw="heading" id="hiw-heading" className="text-2xl lg:text-3xl font-display tracking-tight text-navy">
            Un proceso claro en 5 pasos.
          </h2>
        </div>

        <div className="relative">
          <div
            ref={lineRef}
            className="hidden lg:block absolute top-5 left-[5%] right-[5%] h-[2px] bg-green/30 origin-left"
            aria-hidden="true"
          />
          <ol className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
            {STEPS.map((s, i) => (
              <li key={i} data-hiw="step" className="flex flex-col gap-3 group lg:items-center lg:text-center lg:pt-8">
                <div className="flex items-center gap-2.5 text-navy lg:flex-col lg:gap-1">
                  <span className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-green/40 text-navy text-xs font-bold transition-transform duration-150 group-hover:scale-110 shadow-sm">
                    {i + 1}
                  </span>
                  {s.icon}
                </div>
                <h4 className="text-base font-bold text-navy">{s.title}</h4>
                <p className="text-sm text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
