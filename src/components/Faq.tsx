"use client";

import { useEffect, useRef, useState } from "react";
import { FAQS } from "@/lib/faqs";

/**
 * Accessible FAQ accordion (ported from `app.js` section 4). 8 items split
 * across 2 columns by index parity; first item open by default. Each toggle is
 * independent. Answers animate via max-height. The content is server-rendered;
 * a <noscript> block mirrors it as native <details> so it's readable without JS
 * (the CSS keeps answers collapsed until JS opens them).
 */
export function Faq() {
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  const answerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    answerRefs.current.forEach((el, i) => {
      if (!el) return;
      const inner = el.firstElementChild as HTMLElement | null;
      el.style.maxHeight = open.has(i) && inner ? `${inner.scrollHeight}px` : "0px";
    });
  }, [open]);

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const renderItem = (i: number) => {
    const { q, a } = FAQS[i];
    const isOpen = open.has(i);
    return (
      <div className={`faq-item${isOpen ? " open" : ""}`} key={i}>
        <button
          className="faq-q"
          type="button"
          id={`faq-q-${i}`}
          aria-expanded={isOpen}
          aria-controls={`faq-a-${i}`}
          onClick={() => toggle(i)}
        >
          {q}
          <svg
            className="chev"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 9 l6 6 6-6" />
          </svg>
        </button>
        <div
          className="faq-a"
          id={`faq-a-${i}`}
          role="region"
          aria-labelledby={`faq-q-${i}`}
          ref={(el) => {
            answerRefs.current[i] = el;
          }}
        >
          <div className="faq-a-inner">{a}</div>
        </div>
      </div>
    );
  };

  const col0 = FAQS.map((_, i) => i).filter((i) => i % 2 === 0);
  const col1 = FAQS.map((_, i) => i).filter((i) => i % 2 === 1);

  return (
    <section className="section faq" id="preguntas">
      <div className="wrap faq-grid">
        <div className="faq-head reveal">
          <p
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "var(--muted-2)",
              margin: "0 0 6px",
            }}
          >
            Preguntas frecuentes
          </p>
          <h2 className="section-h">
            Resolvemos tus dudas, para que decidas con confianza.
          </h2>
        </div>
        <div className="faq-col reveal d1">{col0.map(renderItem)}</div>
        <div className="faq-col reveal d2">{col1.map(renderItem)}</div>
        <noscript>
          <div className="faq-noscript">
            {FAQS.map(({ q, a }, i) => (
              <details key={i}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </noscript>
      </div>
    </section>
  );
}
