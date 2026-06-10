'use client';

import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { FAQS } from '@/lib/faqs';
import { WhatsAppLink } from './WhatsAppLink';

export function Faq() {
  const containerRef = useRef<HTMLElement>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  // Hook 1: Scroll entry animations
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

  // Hook 2: Interactive Cards Hover float effect
  useGSAP(() => {
    if (typeof window === 'undefined') return;
    const cards = containerRef.current?.querySelectorAll('[data-faq="item"]');
    if (!cards) return;

    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { y: -3, boxShadow: '0 10px 25px -5px rgba(13,42,94,0.08)', duration: 0.25, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { y: 0, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)', duration: 0.25, ease: 'power2.out' });
      });
    });
  }, { scope: containerRef });

  // Hook 3: Premium smooth accordion height expansion, clip-path sweep, and plus-to-minus morph
  useGSAP(() => {
    if (typeof window === 'undefined') return;

    const items = containerRef.current?.querySelectorAll('[data-faq="item"]');
    if (!items) return;

    items.forEach((item, idx) => {
      const content = item.querySelector('.faq-content') as HTMLElement;
      const text = item.querySelector('.faq-text') as HTMLElement;
      const lineV = item.querySelector('.faq-line-v') as HTMLElement;
      const lineH = item.querySelector('.faq-line-h') as HTMLElement;
      const icon = item.querySelector('.faq-icon') as HTMLElement;
      if (!content || !text || !lineV || !lineH || !icon) return;

      const isOpen = openIdx === idx;
      if (isOpen) {
        // Card active border and soft brand background tint
        gsap.to(item, { borderColor: '#1e9e55', backgroundColor: '#e7faf4', duration: 0.4, overwrite: 'auto' });
        
        // Height expand
        gsap.to(content, { height: 'auto', duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
        
        // Diagonal clip-path sweep and text rise
        gsap.fromTo(text, 
          { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)', y: 6, opacity: 0 },
          { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', overwrite: 'auto' }
        );

        // Morph plus to minus (rotate and scale down vertical line)
        gsap.to(lineV, { scaleY: 0, rotate: 90, transformOrigin: 'center center', duration: 0.35, ease: 'power2.inOut', overwrite: 'auto' });
        gsap.to(lineH, { rotate: 180, transformOrigin: 'center center', duration: 0.35, ease: 'power2.inOut', overwrite: 'auto' });
        gsap.to(icon, { color: '#1e9e55', duration: 0.3, overwrite: 'auto' });
      } else {
        // Card inactive border and clean white background
        gsap.to(item, { borderColor: '#e5e9ee', backgroundColor: 'rgba(255, 255, 255, 0.7)', duration: 0.3, overwrite: 'auto' });
        
        // Height collapse
        gsap.to(content, { height: 0, duration: 0.35, ease: 'power2.inOut', overwrite: 'auto' });
        
        // Collapse clip-path
        gsap.to(text, { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)', opacity: 0, duration: 0.3, ease: 'power2.in', overwrite: 'auto' });

        // Morph minus back to plus
        gsap.to(lineV, { scaleY: 1, rotate: 0, transformOrigin: 'center center', duration: 0.35, ease: 'power2.inOut', overwrite: 'auto' });
        gsap.to(lineH, { rotate: 0, transformOrigin: 'center center', duration: 0.35, ease: 'power2.inOut', overwrite: 'auto' });
        gsap.to(icon, { color: '#677085', duration: 0.3, overwrite: 'auto' });
      }
    });
  }, { dependencies: [openIdx], scope: containerRef });

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
          <div className="min-w-0 flex flex-col">
            {FAQS.map((faq, i) => {
              const isOpen = openIdx === i;
              return (
                <div
                  key={i}
                  data-faq="item"
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="border border-border bg-white/70 backdrop-blur-md rounded-xl p-5 mb-4 shadow-sm transition-shadow duration-300 select-none cursor-pointer"
                >
                  <div className="w-full flex items-start justify-between text-left text-base font-semibold text-navy-ink outline-none">
                    <span className="flex flex-col items-start gap-1 pr-4">
                      <span>{faq.q}</span>
                      <span className="text-xs font-normal text-muted-foreground line-clamp-1">{faq.preview}</span>
                    </span>
                    
                    {/* SVG Line-Morphing Icon (+ to -) */}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="faq-icon shrink-0 ml-4 mt-0.5"
                      style={{ color: '#677085' }}
                    >
                      <line x1="5" y1="12" x2="19" y2="12" className="faq-line-h" />
                      <line x1="12" y1="5" x2="12" y2="19" className="faq-line-v" />
                    </svg>
                  </div>
                  <div
                    className="faq-content overflow-hidden text-sm text-muted-foreground"
                    style={{ height: 0 }}
                  >
                    <div className="faq-text pt-3 pb-2 pr-6 leading-relaxed">
                      {faq.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
