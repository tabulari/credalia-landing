"use client";

import { useEffect, useState } from "react";
import { fmtCOP } from "@/lib/credit";
import { useSimulator } from "./simulator-store";
import { ScrollButton } from "./ScrollButton";
import { ApplyButton } from "./ApplyButton";

/**
 * Sticky "tu cuota" bar (ported from solicitud.js). Slides up once the user
 * scrolls past the hero CTAs, but hides while the simulator card is on screen
 * (no need to duplicate it) and at the footer. Figures are synced live from the
 * store. Respects env(safe-area-inset-bottom) via CSS.
 */
export function StickyPaymentBar() {
  const { sim } = useSimulator();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const heroCtas = document.querySelector(".hero-ctas");
    const simCard = document.getElementById("simulator");
    const footer = document.querySelector(".footer");

    let pastHero = false;
    let simVisible = false;
    let atFooter = false;
    const update = () => setShow(pastHero && !simVisible && !atFooter);

    const observers: IntersectionObserver[] = [];
    if (heroCtas) {
      const o = new IntersectionObserver(
        ([en]) => {
          pastHero = !en.isIntersecting && en.boundingClientRect.top < 0;
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
    document.body.classList.toggle("has-payment-bar", show);
    return () => document.body.classList.remove("has-payment-bar");
  }, [show]);

  // When hidden (slid off-screen) the bar must leave the tab order and the a11y
  // tree; `inert` does both, avoiding aria-hidden-with-focusable-children.
  const hiddenProps = show ? {} : ({ inert: "" } as Record<string, string>);

  return (
    <div className={`payment-bar${show ? " show" : ""}`} {...hiddenProps}>
      <div className="payment-bar-inner">
        <div className="payment-bar-info">
          <span className="pb-label">Tu cuota estimada</span>
          <span className="pb-value">
            {`$${fmtCOP(sim.payment)}`} <span id="pbUnit">{sim.unit}</span>
          </span>
        </div>
        <span className="pb-detail">{`$${fmtCOP(sim.amount)} · ${sim.term} meses`}</span>
        <div className="payment-bar-actions">
          <ScrollButton
            className="btn btn-ghost pb-adjust"
            target="#simula"
            aria-label="Ajustar tu simulación"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20 h9" />
              <path d="M16.5 3.5 a2.1 2.1 0 0 1 3 3 L7 19 l-4 1 1-4 Z" />
            </svg>
            Ajustar
          </ScrollButton>
          <ApplyButton origin="simulator" className="btn btn-navy pb-btn">
            Solicitar crédito
          </ApplyButton>
        </div>
      </div>
    </div>
  );
}
