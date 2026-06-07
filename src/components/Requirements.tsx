'use client';

import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';
import { PersonIcon, IdCardIcon, CreditCardIcon, DocumentIcon, CheckIcon } from './icons';

const REQS = [
  { icon: <PersonIcon size={18} className="text-green" />, label: 'Ser mayor de edad' },
  { icon: <IdCardIcon size={18} className="text-green" />, label: 'Cédula colombiana vigente' },
  { icon: <CreditCardIcon size={18} className="text-green" />, label: 'Cuenta bancaria a tu nombre' },
  { icon: <DocumentIcon size={18} className="text-green" />, label: 'Un soporte de ingresos' },
];

function AnimatedCheck() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden="true">
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
        x: -20,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: containerRef.current, start: 'top 80%' },
      });
    }

    if (checkmarks && checkmarks.length) {
      checkmarks.forEach((cm, i) => {
        gsap.to(cm, {
          strokeDashoffset: 0,
          duration: reduceMotion ? 0 : 0.4,
          delay: reduceMotion ? 0 : 0.2 + i * 0.12,
          ease: 'power2.out',
          scrollTrigger: { trigger: containerRef.current, start: 'top 80%' },
        });
      });
    }

    const counterEl = containerRef.current?.querySelector('[data-req="counter"]');
    if (counterEl) {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: 4,
        duration: 1.2,
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
    <section ref={containerRef} id="requisitos-band" aria-labelledby="req-heading" className="py-16 lg:py-24">
      <div className="mx-auto max-w-container px-6">
        <div data-req="heading" className="mb-10 lg:mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-green-ink mb-2">Requisitos</p>
          <h2 id="req-heading" className="text-2xl lg:text-3xl font-display tracking-tight text-navy">
            Solo necesitas 4 cosas
          </h2>
        </div>

        <div className="max-w-lg mx-auto flex flex-col gap-2">
          {REQS.map((r) => (
            <div
              key={r.label}
              data-req="item"
              className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-card hover:-translate-y-0.5 hover:shadow-sm transition-all duration-300"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-tint text-green shrink-0">
                {r.icon}
              </span>
              <span className="flex-1 text-sm font-medium text-foreground">{r.label}</span>
              <AnimatedCheck />
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <span data-req="counter" className={cn(
            'inline-flex items-center gap-2 text-sm font-semibold text-green-ink bg-green-tint rounded-full px-4 py-1.5 transition-opacity duration-500',
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
