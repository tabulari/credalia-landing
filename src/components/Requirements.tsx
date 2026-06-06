'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';
import { PersonIcon, IdCardIcon, CreditCardIcon, DocumentIcon } from './icons';

const REQS = [
  {
    icon: <PersonIcon size={22} className="text-green" />,
    label: 'Ser mayor de edad',
  },
  {
    icon: <IdCardIcon size={22} className="text-green" />,
    label: 'Cédula colombiana',
  },
  {
    icon: <CreditCardIcon size={22} className="text-green" />,
    label: 'Una cuenta bancaria a tu nombre',
  },
  {
    icon: <DocumentIcon size={22} className="text-green" />,
    label: 'Un soporte de ingresos',
  },
];

export function Requirements() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const heading = containerRef.current?.querySelector('[data-req="heading"]');
    const cards = containerRef.current?.querySelectorAll('[data-req="card"]');

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
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="requisitos-band" aria-labelledby="req-heading" className="py-16 lg:py-24">
      <div className="mx-auto max-w-container px-6">
        <div data-req="heading" className="mb-10 text-center">
          <h2 id="req-heading" className="text-2xl lg:text-3xl font-display tracking-tight text-navy mb-3">
            ¿Qué necesitas para aplicar?
          </h2>
          <p className="text-muted-foreground">
            Requisitos simples. Si cumples con esto, puedes solicitar tu crédito.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {REQS.map((r, i) => (
            <div
              key={r.label}
              data-req="card"
              className={cn(
                'flex flex-col items-center gap-3 p-6 rounded-xl border bg-card text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-200',
                i === 0 ? 'lg:col-span-2 border-green/30 bg-green-soft' : 'border-border',
              )}
            >
              <span className="flex items-center justify-center w-11 h-11 rounded-full bg-green-tint text-green">
                {r.icon}
              </span>
              <span className="text-sm font-semibold text-foreground">{r.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
