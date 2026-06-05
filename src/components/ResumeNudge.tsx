"use client";

import { useEffect, useState } from "react";
import { useSiteUi } from "./site-ui";
import { track } from "@/lib/analytics";

/**
 * Resume nudge (ported from solicitud.js). A bottom-center toast that appears
 * after "Editar monto" returns the user to the simulator, offering to reopen the
 * in-progress application (draft restored). Slides up via a `.show` class
 * (setTimeout, not rAF, so it works in background tabs).
 */
export function ResumeNudge() {
  const { resumeNudgeOpen, openApply, hideResumeNudge } = useSiteUi();
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (resumeNudgeOpen) {
      setMounted(true);
      const t = setTimeout(() => setShow(true), 20);
      return () => clearTimeout(t);
    }
    if (!mounted) return;
    setShow(false);
    const t = setTimeout(() => setMounted(false), 360);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeNudgeOpen]);

  if (!mounted) return null;

  return (
    <div className={`resume-nudge${show ? " show" : ""}`}>
      <div className="resume-nudge-inner">
        <span className="resume-nudge-ic" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12 a9 9 0 1 0 9-9 a9 9 0 0 0-6.4 2.6 L3 8" />
            <path d="M3 4 v4 h4" />
          </svg>
        </span>
        <div className="resume-nudge-txt">
          <strong>Tienes una solicitud sin terminar</strong>
          <span>Ajusta tu monto y continúa donde quedaste.</span>
        </div>
        <button
          className="btn btn-navy resume-nudge-btn"
          type="button"
          onClick={() => {
            track("apply_resume");
            hideResumeNudge();
            openApply("resume");
          }}
        >
          Volver a tu solicitud <span className="btn-arrow">→</span>
        </button>
        <button
          className="resume-nudge-close"
          type="button"
          aria-label="Descartar"
          onClick={() => {
            track("apply_resume_dismiss");
            hideResumeNudge();
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6 l12 12 M18 6 l-12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
