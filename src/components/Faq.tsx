'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { FAQS } from '@/lib/faqs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { WhatsAppLink } from './WhatsAppLink';
import { WhatsAppIcon } from './icons';

export function Faq() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const leftCol = containerRef.current?.querySelector('[data-faq="left"]');
    const rightCol = containerRef.current?.querySelector('[data-faq="right"]');

    if (leftCol) {
      gsap.fromTo(
        leftCol,
        { y: 24, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: leftCol, start: 'top 85%' },
        },
      );
    }

    if (rightCol) {
      gsap.fromTo(
        rightCol,
        { y: 28, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.65,
          ease: 'power2.out',
          scrollTrigger: { trigger: rightCol, start: 'top 85%' },
        },
      );
    }
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="preguntas"
      aria-labelledby="faq-heading"
      className="py-12 sm:py-14 lg:py-16 bg-white relative"
    >
      <div className="mx-auto max-w-container px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ───────────────────────────────────────────────────────────── */}
          {/* LEFT COLUMN: Sticky Trust Anchor & Human Concierge Card       */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div data-faq="left" className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <div className="space-y-2 text-left">
              <p className="text-xs font-semibold uppercase tracking-widest text-green-ink">
                Transparencia total
              </p>
              <h2
                id="faq-heading"
                className="text-3xl sm:text-4xl lg:text-5xl font-display tracking-tight text-navy leading-[1.12]"
              >
                Claridad total sobre tu <span className="text-orange">crédito.</span>
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed pt-1">
                Todo lo que necesitas saber antes de solicitar, explicado con honestidad y sin tecnicismos bancarios.
              </p>
            </div>

            {/* Human WhatsApp Concierge Card */}
            <div className="rounded-2xl bg-gradient-to-br from-green-soft via-[#edf6e4] to-[#f4f9ef] border border-green/30 p-6 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#075e54]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
                  Asesores en línea ahora
                </div>
                <span className="text-[10px] font-semibold text-green-ink bg-white/80 px-2 py-0.5 rounded-full border border-green/20">
                  Respuesta en &lt; 3 min
                </span>
              </div>

              <div className="space-y-1 text-left">
                <h3 className="text-base font-bold text-navy leading-snug">
                  ¿Prefieres hablar con una persona?
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Nuestro equipo está en WhatsApp para resolver cualquier caso o duda particular en tiempo real.
                </p>
              </div>

              <WhatsAppLink
                ctx="contact"
                className="flex items-center justify-center gap-2 w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-white hover:bg-white/90 text-navy font-bold text-sm shadow-2xs border border-border/70 transition-all hover:shadow-xs active:scale-[0.98]"
              >
                <WhatsAppIcon size={17} className="text-[#25D366] shrink-0" />
                <span>Hablar con un asesor</span>
                <span aria-hidden="true" className="text-muted-2 ml-auto">→</span>
              </WhatsAppLink>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* RIGHT COLUMN: Balanced 5 Curated Core Questions               */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div data-faq="right" className="lg:col-span-7 space-y-3.5">
            <Accordion className="space-y-3.5 min-w-0">
              {FAQS.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  data-faq="item"
                  className="rounded-2xl border border-border/80 bg-white hover:border-navy/20 hover:shadow-xs transition-all duration-200 overflow-hidden"
                >
                  <AccordionTrigger className="px-5 sm:px-6 py-4 sm:py-5 text-left text-base font-bold text-navy hover:no-underline gap-4">
                    <div className="flex flex-col items-start gap-1.5 text-left">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-green-ink bg-green-soft px-2.5 py-0.5 rounded-md">
                        {faq.tag}
                      </span>
                      <span className="leading-snug">{faq.q}</span>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-5 sm:px-6 pb-5 pt-0 text-left space-y-2">
                    {/* Nubank-Style Skimmable Key Takeaway */}
                    <div className="rounded-lg bg-bg-soft/80 border border-border/50 p-2.5 text-xs font-semibold text-navy flex items-start gap-2">
                      <span className="text-green text-sm shrink-0 font-bold">✓</span>
                      <span>{faq.highlight}</span>
                    </div>
                    {/* Human, Empathetic Detailed Answer */}
                    <p className="text-sm text-muted-foreground leading-relaxed pl-1">
                      {faq.a}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Static noscript fallback for crawlers & non-JS */}
        <noscript>
          <div className="max-w-3xl mx-auto flex flex-col gap-3 mt-8">
            {FAQS.map(({ q, a, highlight }, i) => (
              <details key={i} className="border border-border rounded-xl p-4">
                <summary className="text-sm font-bold text-navy cursor-pointer">{q}</summary>
                <p className="mt-2 text-xs font-semibold text-green-ink">{highlight}</p>
                <p className="mt-2 text-sm text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </noscript>
      </div>
    </section>
  );
}
