export function HowItWorks() {
  return (
    <section className="section section-soft" id="como-funciona">
      <div className="wrap">
        <div className="timeline-head reveal">
          <p className="eyebrow">Cómo funciona</p>
          <h2 className="section-h">Un proceso claro en 5 pasos.</h2>
        </div>
        <ol className="timeline reveal d1">
          <li className="tl-step">
            <div className="tl-node">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" />
                <rect x="8" y="5" width="8" height="3" rx="1" />
                <path d="M8 12 h2 M14 12 h2 M8 15 h2 M14 15 h2 M8 18 h2 M14 18 h2" />
              </svg>
              <span className="tl-num">1</span>
            </div>
            <h4>Simula tu crédito</h4>
            <p>Conoce tu cuota y tasa en segundos.</p>
          </li>
          <li className="tl-step">
            <div className="tl-node">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 3 H14 L19 8 V21 H7 Z M14 3 V8 H19" />
                <path d="M12 18 V12 M9.5 14 L12 11.5 14.5 14" />
              </svg>
              <span className="tl-num">2</span>
            </div>
            <h4>Sube tus documentos</h4>
            <p>Cédula y un soporte. 100% en línea.</p>
          </li>
          <li className="tl-step">
            <div className="tl-node">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7 v5 l3.5 2" />
              </svg>
              <span className="tl-num">3</span>
            </div>
            <h4>Análisis en minutos</h4>
            <p>Evaluamos tu solicitud automáticamente.</p>
          </li>
          <li className="tl-step">
            <div className="tl-node">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5 a8.5 8.5 0 1 1-4.4-7.4 L21 4 v4 h-4" />
                <path d="M8.5 12 l2.3 2.3 4.5-4.8" />
              </svg>
              <span className="tl-num">4</span>
            </div>
            <h4>Recibe tu decisión</h4>
            <p>Te avisamos por WhatsApp y correo.</p>
          </li>
          <li className="tl-step">
            <div className="tl-node">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21 h18 M4 21 V10 M20 21 V10 M8 21 V10 M16 21 V10 M12 21 V10 M3 10 L12 3 L21 10 Z" />
              </svg>
              <span className="tl-num">5</span>
            </div>
            <h4>Recibe tu dinero</h4>
            <p>Desembolso directo a tu cuenta.</p>
          </li>
        </ol>
      </div>
    </section>
  );
}
