'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { FAQS } from '@/lib/faqs';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

export function Faq() {
  const col0 = FAQS.map((_, i) => i).filter((i) => i % 2 === 0);
  const col1 = FAQS.map((_, i) => i).filter((i) => i % 2 === 1);
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const heading = containerRef.current?.querySelector('[data-faq="heading"]');
    if (heading) {
      gsap.from(heading, { y: 20, autoAlpha: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: heading, start: 'top 85%' } });
    }
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="preguntas" aria-labelledby="faq-heading" className="py-16 lg:py-24">
      <div className="mx-auto max-w-container px-6">
        <div data-faq="heading" className="text-center mb-10">
          <p className="text-sm font-bold text-muted-2 mb-1.5">
            Preguntas frecuentes
          </p>
          <h2 id="faq-heading" className="text-3xl lg:text-4xl font-display tracking-tight text-navy">
            Resolvemos tus dudas, para que decidas con confianza.
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-0" role="group" aria-labelledby="faq-heading">
          <Accordion>
            {col0.map((i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-b border-border">
                <AccordionTrigger className="py-4 text-sm font-bold text-navy-ink hover:no-underline">
                  {FAQS[i].q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {FAQS[i].a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Accordion className="pt-6">
            {col1.map((i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-b border-border">
                <AccordionTrigger className="py-4 text-sm font-bold text-navy-ink hover:no-underline">
                  {FAQS[i].q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {FAQS[i].a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <noscript>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-8">
            {FAQS.map(({ q, a }, i) => (
              <details key={i} className="border border-border rounded-md p-4">
                <summary className="text-sm font-bold text-navy-ink cursor-pointer">{q}</summary>
                <p className="mt-3 text-sm text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </noscript>
      </div>
    </section>
  );
}
