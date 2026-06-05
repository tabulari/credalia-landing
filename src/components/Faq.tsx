'use client';

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

  return (
    <section id="preguntas" className="py-16 lg:py-24">
      <div className="mx-auto max-w-container px-6">
        <div className="reveal text-center mb-10">
          <p className="text-sm font-bold text-muted-2 mb-1.5">
            Preguntas frecuentes
          </p>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-navy">
            Resolvemos tus dudas, para que decidas con confianza.
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-0 reveal d1">
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
          <Accordion>
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
