'use client';

import { useEffect, useState } from 'react';
import { fmtCOP } from '@/lib/credit';
import { useSimulator } from './simulator-store';
import { ScrollButton } from './ScrollButton';
import { ApplyButton } from './ApplyButton';
import { cn } from '@/lib/utils';

export function StickyPaymentBar() {
  const { sim } = useSimulator();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const heroCtas = document.querySelector('[data-slot="hero-ctas"]');
    const simCard = document.getElementById('simulator');
    const footer = document.querySelector('[data-slot="footer"]');

    const supportsIO = typeof IntersectionObserver !== 'undefined';

    if (!supportsIO) {
      const onScroll = () => {
        const heroBottom = heroCtas
          ? heroCtas.getBoundingClientRect().bottom
          : -1;
        const pastHero = heroCtas
          ? heroBottom < 0
          : window.scrollY > 240;
        const simRect = simCard?.getBoundingClientRect();
        const simVisible = simRect
          ? simRect.top < window.innerHeight * 0.75 &&
            simRect.bottom > 0
          : false;
        const footerRect = footer?.getBoundingClientRect();
        const atFooter = footerRect
          ? footerRect.top < window.innerHeight
          : false;
        setShow(pastHero && !simVisible && !atFooter);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener('scroll', onScroll);
    }

    let pastHero = false;
    let simVisible = false;
    let atFooter = false;
    const update = () =>
      setShow(pastHero && !simVisible && !atFooter);

    const observers: IntersectionObserver[] = [];
    if (heroCtas) {
      const o = new IntersectionObserver(
        ([en]) => {
          pastHero =
            !en.isIntersecting && en.boundingClientRect.top < 0;
          update();
        },
        { threshold: 0 },
      );
      o.observe(heroCtas);
      observers.push(o);
    }
    if (simCard) {
      const o = new IntersectionObserver(
        ([en]) => {
          simVisible = en.isIntersecting;
          update();
        },
        { threshold: 0.25 },
      );
      o.observe(simCard);
      observers.push(o);
    }
    if (footer) {
      const o = new IntersectionObserver(
        ([en]) => {
          atFooter = en.isIntersecting;
          update();
        },
        { threshold: 0 },
      );
      o.observe(footer);
      observers.push(o);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    document.body.classList.toggle('has-payment-bar', show);
    return () => document.body.classList.remove('has-payment-bar');
  }, [show]);

  return (
    <div
      data-slot="payment-bar"
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 flex items-center justify-center bg-white/97 backdrop-blur-md border-t border-border shadow-[0_-8px_24px_rgba(13,42,94,0.1)]',
        'px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))]',
        show ? 'show' : 'translate-y-[130%]',
      )}
      inert={!show || undefined}
    >
      <div className="flex items-center gap-4 w-full max-w-[var(--maxw,1120px)]">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 shrink-0 min-w-0">
          <span className="text-xs font-semibold text-muted-2 uppercase tracking-wide sm:normal-case sm:tracking-normal">
            Tu cuota estimada
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-navy whitespace-nowrap tracking-tight">
            {`$${fmtCOP(sim.payment)}`}
            <span className="text-xs font-semibold text-muted-2 ml-1">{sim.unit}</span>
          </span>
        </div>
        <span className="hidden sm:block text-sm font-semibold text-muted pl-4 border-l border-border whitespace-nowrap">
          {`$${fmtCOP(sim.amount)} · ${sim.term} meses`}
        </span>
        <div className="flex items-center gap-3 ml-auto shrink-0">
          <ScrollButton
            variant="ghost"
            size="sm"
            target="#simula"
            aria-label="Ajustar tu simulación"
            className="text-navy"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20 h9" />
              <path d="M16.5 3.5 a2.1 2.1 0 0 1 3 3 L7 19 l-4 1 1-4 Z" />
            </svg>
            <span className="hidden sm:inline">Ajustar</span>
          </ScrollButton>
          <ApplyButton
            origin="simulator"
            variant="default"
            size="sm"
            disabled={!sim.valid}
          >
            Solicitar crédito
          </ApplyButton>
        </div>
      </div>
    </div>
  );
}
