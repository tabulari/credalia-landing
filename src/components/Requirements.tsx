'use client';

import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';
import { PersonIcon, IdCardIcon, CreditCardIcon, DocumentIcon, CheckIcon } from './icons';

const REQS = [
  {
    icon: <PersonIcon size={20} className="text-green" />,
    label: 'Ser mayor de edad',
    detail: 'Solo necesitas ser mayor de 18 años para comenzar tu solicitud.',
    featured: true,
  },
  {
    icon: <IdCardIcon size={20} className="text-green" />,
    label: 'Cédula colombiana',
    detail: 'Cédula de ciudadanía vigente, photographic por ambos lados.',
  },
  {
    icon: <CreditCardIcon size={20} className="text-green" />,
    label: 'Cuenta bancaria a tu nombre',
    detail: 'Cualquier banco en Colombia. El desembolso llega directo.',
  },
  {
    icon: <DocumentIcon size={20} className="text-green" />,
    label: 'Un soporte de ingresos',
    detail: 'Certificación laboral, extracto bancario o declaracion de renta.',
  },
];

function AnimatedCheck() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="var(--green)" strokeWidth="1.5" className="opacity-30" />
      <path
        d="M8 12 l2.5 2.5 L16 9"
        stroke="var(--green)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        data-req="checkmark"
        style={{ strokeDasharray: 14, strokeDashoffset: 14 }}
      />
    </svg>
  );
}

export function Requirements() {
  const containerRef = useRef<HTMLElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const [countDone, setCountDone] = useState(false);

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const heading = containerRef.current?.querySelector('[data-req="heading"]');
    const items = containerRef.current?.querySelectorAll('[data-req="item"]');
    const checkmarks = containerRef.current?.querySelectorAll('[data-req="checkmark"]');

    if (heading) {
      gsap.from(heading, { y: 20, autoAlpha: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: heading, start: 'top 85%' } });
    }
    if (items && items.length) {
      gsap.from(items, {
        x: -30,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: containerRef.current, start: 'top 80%' },
      });
    }

    if (checkmarks && checkmarks.length) {
      checkmarks.forEach((cm, i) => {
        gsap.to(cm, {
          strokeDashoffset: 0,
          duration: reduceMotion ? 0 : 0.5,
          delay: reduceMotion ? 0 : 0.3 + i * 0.15,
          ease: 'power2.out',
          scrollTrigger: { trigger: containerRef.current, start: 'top 80%' },
        });
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

        <div className="max-w-2xl mx-auto flex flex-col gap-3">
          {REQS.map((r) => (
            <div
              key={r.label}
              data-req="item"
              className={cn(
                'flex items-start gap-4 p-5 rounded-xl border transition-all duration-300 relative overflow-hidden',
                r.featured
                  ? 'border-green/30 bg-green-soft'
                  : 'border-border bg-card hover:-translate-y-0.5 hover:shadow-md',
              )}
            >
              {r.featured && (
                <div ref={accentRef} className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-green to-green/0 origin-left" aria-hidden="true" />
              )}
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-green-tint text-green shrink-0 mt-0.5">
                {r.icon}
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-foreground">{r.label}</span>
                {r.detail && (
                  <p className="text-sm text-muted-foreground mt-0.5">{r.detail}</p>
                )}
              </div>
              <div className="shrink-0 mt-1">
                <AnimatedCheck />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
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
