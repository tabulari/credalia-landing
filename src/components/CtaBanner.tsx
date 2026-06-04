import { ApplyButton } from "./ApplyButton";
import { ScrollButton } from "./ScrollButton";

export function CtaBanner() {
  return (
    <section className="cta-banner">
      <div className="wrap cta-inner reveal">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            flex: 1,
            minWidth: "280px",
          }}
        >
          <span className="logo" aria-hidden="true">
            <svg width="64" height="58" viewBox="0 0 220 200" fill="none">
              <path d="M10 26 C10 16 18 8 28 8 L70 8 L138 92 C144 99 144 109 138 116 L70 200 L28 200 C18 200 10 192 10 182 Z" fill="#1e9e55" />
              <path d="M70 26 C70 16 78 8 88 8 L130 8 L198 92 C204 99 204 109 198 116 L130 200 L88 200 C78 200 70 192 70 182 Z" fill="#f2691c" />
              <path d="M130 26 C130 16 138 8 148 8 L190 8 L258 92 C264 99 264 109 258 116 L190 200 L148 200 C138 200 130 192 130 182 Z" fill="#0d2a5e" />
            </svg>
          </span>
          <div className="cta-text">
            <h3>
              Empieza tu solicitud con <span className="amt">claridad.</span>
            </h3>
            <p>Simula primero o solicita directo. Tú decides el ritmo.</p>
          </div>
        </div>
        <div className="cta-actions">
          <div className="cta-buttons">
            <ScrollButton className="btn btn-white" target="#simula">
              Simular mi crédito <span className="btn-arrow">→</span>
            </ScrollButton>
            <ApplyButton className="btn btn-ghost-dark">
              Solicitar crédito <span className="btn-arrow">→</span>
            </ApplyButton>
          </div>
        </div>
      </div>
    </section>
  );
}
