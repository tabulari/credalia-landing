'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { FAQS } from '@/lib/faqs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export function Faq() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const heading = containerRef.current?.querySelector('[data-faq="heading"]');
    const items = containerRef.current?.querySelectorAll('[data-faq="item"]');
    const cta = containerRef.current?.querySelector('[data-faq="cta"]');

    if (heading) {
      gsap.fromTo(heading, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: heading, start: 'top 85%' } });
    }
    if (items && items.length) {
      gsap.fromTo(items, {
        y: 20,
        autoAlpha: 0,
      }, {
        y: 0,
        autoAlpha: 1,
        stagger: 0.08,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: containerRef.current, start: 'top 80%' },
      });
    }
    if (cta) {
      gsap.fromTo(cta, { y: 15, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: cta, start: 'top 90%' } });
    }
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="preguntas" aria-labelledby="faq-heading" className="py-16 lg:py-24 bg-bg-soft/50">
      <div className="mx-auto max-w-container px-6">
        <div data-faq="heading" className="text-center mb-10 lg:mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-green-ink mb-2">
            Preguntas frecuentes
          </p>
          <h2 id="faq-heading" className="text-2xl lg:text-3xl font-display tracking-tight text-navy">
            Resolvemos tus dudas
          </h2>
        </div>
        <div className="max-w-3xl mx-auto min-w-0">
          <Accordion className="min-w-0">
            {FAQS.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                data-faq="item"
                className="mb-4 rounded-xl border border-border bg-white/70 shadow-sm backdrop-blur-md transition-shadow duration-300 [&:not(:last-child)]:border-b-0"
              >
                <AccordionTrigger className="px-5 py-5 text-left text-base font-semibold text-navy-ink hover:no-underline">
                  <span className="flex flex-col items-start gap-1">
                    <span>{faq.q}</span>
                    <span className="text-xs font-normal text-muted-foreground line-clamp-1">{faq.preview}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-5 text-sm text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
         <div data-faq="cta" className="mt-8 text-center">
           {/* WhatsApp link removed */}
         </div>

        <noscript>
          <div className="max-w-3xl mx-auto flex flex-col gap-3 mt-8">
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
