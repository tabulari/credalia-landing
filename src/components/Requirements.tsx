'use client';

import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';
import { PersonIcon, IdCardIcon, CreditCardIcon, DocumentIcon, CheckIcon } from './icons';

const REQS = [
  {
    icon: <PersonIcon size={22} className="text-green" />,
    label: 'Ser mayor de edad',
    detail: 'Solo necesitas ser mayor de 18 años para comenzar tu solicitud.',
    featured: true,
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
  const accentRef = useRef<HTMLDivElement>(null);
  const [countDone, setCountDone] = useState(false);

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

    if (accentRef.current) {
      gsap.fromTo(accentRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: accentRef.current, start: 'top 90%' },
        },
      );
    }

    const counterEl = containerRef.current?.querySelector('[data-req="counter"]');
    if (counterEl) {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: 4,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: counterEl, start: 'top 90%' },
        onUpdate: () => {
          counterEl.textContent = `${Math.round(obj.val)} requisitos simples`;
        },
        onComplete: () => {
          setCountDone(true);
        },
      });
    }
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="requisitos-band" aria-labelledby="req-heading" className="py-16 lg:py-24 relative overflow-hidden deco-diamond">
      <div className="mx-auto max-w-container px-6">
        <div data-req="heading" className="mb-12 lg:mb-14 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-green-ink mb-2">Requisitos</p>
          <h2 id="req-heading" className="text-2xl lg:text-3xl font-display tracking-tight text-navy mb-3">
            ¿Qué necesitas para aplicar?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Requisitos simples. Si cumples con esto, puedes solicitar tu crédito.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {REQS.map((r) => (
            <div
              key={r.label}
              data-req="card"
              className={cn(
                'flex flex-col items-center gap-4 p-6 rounded-xl border bg-card text-center hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 relative overflow-hidden',
                r.featured ? 'lg:col-span-2 border-green/30 bg-green-soft' : 'border-border',
              )}
            >
              {r.featured && (
                <div ref={accentRef} className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-green to-green/0 origin-left" aria-hidden="true" />
              )}
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-green-tint text-green">
                {r.icon}
              </span>
              <span className="text-sm font-semibold text-foreground">{r.label}</span>
              {r.featured && r.detail && (
                <p className="text-sm text-muted-foreground mt-0.5">{r.detail}</p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <span data-req="counter" className={cn(
            'inline-flex items-center gap-2 text-sm font-semibold text-green-ink bg-green-tint rounded-full px-4 py-2 transition-opacity duration-500',
            countDone ? 'opacity-100' : 'opacity-80',
          )}>
            {countDone && <CheckIcon size={16} className="text-green" />}
            {countDone ? '4 requisitos simples' : ''}
          </span>
        </div>
      </div>
    </section>
  );
}
