'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { FAQS } from '@/lib/faqs';
import { WhatsAppLink } from './WhatsAppLink';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

export function Faq() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const heading = containerRef.current?.querySelector('[data-faq="heading"]');
    const items = containerRef.current?.querySelectorAll('[data-faq="item"]');
    const cta = containerRef.current?.querySelector('[data-faq="cta"]');

    if (heading) {
      gsap.from(heading, { y: 20, autoAlpha: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: heading, start: 'top 85%' } });
    }
    if (items && items.length) {
      gsap.from(items, {
        y: 20,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: containerRef.current, start: 'top 80%' },
      });
    }
    if (cta) {
      gsap.from(cta, { y: 15, autoAlpha: 0, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: cta, start: 'top 90%' } });
    }
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="preguntas" aria-labelledby="faq-heading" className="py-16 lg:py-24">
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
              <AccordionItem key={i} value={`faq-${i}`} data-faq="item" className="border-b border-border">
                <AccordionTrigger className="py-5 text-base font-semibold text-navy-ink hover:no-underline text-left">
                  <span className="flex flex-col items-start gap-1">
                    <span>{faq.q}</span>
                    <span className="text-xs font-normal text-muted-foreground line-clamp-1">{faq.preview}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div data-faq="cta" className="mt-8 text-center">
          <WhatsAppLink
            ctx="faq"
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-ink hover:text-green-ink/80 transition-colors py-3"
          >
            <span className="wa-ico" aria-hidden="true" />
            ¿Tienes otra duda? Escríbenos por <b>WhatsApp</b>
          </WhatsAppLink>
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
