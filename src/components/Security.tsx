'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { config } from '@/lib/config';
import { LockKeyholeIcon, DocumentIcon, ShieldCheckIcon, SearchCheckIcon } from './icons';

const CARDS = [
  {
    icon: <LockKeyholeIcon size={26} className="text-green" />,
    title: 'Datos cifrados',
    text: 'Tu información viaja y se almacena cifrada, protegida de extremo a extremo.',
  },
  {
    icon: <DocumentIcon size={26} className="text-green" />,
    title: 'Tratamiento conforme a la ley',
    text: 'Tratamos tus datos personales según la Ley 1581 de 2012 (Habeas Data).',
  },
  {
    icon: <ShieldCheckIcon size={26} className="text-green" />,
    title: 'Entidad vigilada',
    text: `Operamos bajo la supervisión de la ${config.regulatorName}.`,
    regulatorOnly: true,
  },
  {
    icon: <SearchCheckIcon size={26} className="text-green" />,
    title: 'Simular no afecta tu historial',
    text: 'La simulación es informativa y no genera consultas en centrales de riesgo.',
  },
];

export function Security() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const heading = containerRef.current?.querySelector('[data-sec="heading"]');
    const eyebrow = containerRef.current?.querySelector('[data-sec="eyebrow"]');
    const cards = containerRef.current?.querySelectorAll('[data-sec="card"]');

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
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="seguridad" aria-labelledby="sec-heading" className="py-16 lg:py-24 bg-[radial-gradient(ellipse_at_bottom,rgba(13,42,94,0.04),transparent_70%)]">
      <div className="mx-auto max-w-container px-6">
        <div className="text-center mb-12 lg:mb-14">
          <p data-sec="eyebrow" className="text-xs font-semibold uppercase tracking-widest text-green-ink mb-2">Seguridad</p>
          <h2 data-sec="heading" id="sec-heading" className="text-2xl lg:text-3xl font-display tracking-tight text-navy mb-3">
            Tu información está protegida en cada paso.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Cuidamos tus datos con estándares de la industria financiera y los
            tratamos conforme a la ley colombiana.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CARDS.filter((c) => !c.regulatorOnly || config.regulatorVerified).map((c) => (
            <div
              key={c.title}
              data-sec="card"
              className="flex flex-col items-center gap-4 p-6 rounded-xl border border-border bg-card text-center hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-tint text-green">
                {c.icon}
              </div>
              <h3 className="text-base font-bold text-navy">{c.title}</h3>
              <p className="text-sm text-muted-foreground">{c.text}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-10">
          ¿Quieres saber más sobre cómo cuidamos tus datos? Lee nuestra{' '}
          <Link href="/legal/privacidad" className="text-navy font-semibold hover:underline py-4">
            Política de Privacidad
          </Link>.
        </p>
      </div>
    </section>
  );
}
