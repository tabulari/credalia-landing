export function Requirements() {
  return (
    <section className="section" id="requisitos-band">
      <div className="wrap">
        <div className="req-head reveal">
          <h2>¿Qué necesitas para aplicar?</h2>
          <p>Requisitos simples. Si cumples con esto, puedes solicitar tu crédito.</p>
        </div>
        <div className="req-grid reveal d1">
          <div className="req-card">
            <span className="ric">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M5 21 a7 7 0 0 1 14 0" />
              </svg>
            </span>
            <span>Ser mayor de edad</span>
          </div>
          <div className="req-card">
            <span className="ric">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <circle cx="8.5" cy="11" r="2" />
                <path d="M13 9 h5 M13 13 h5 M5.5 16 a3 3 0 0 1 6 0" />
              </svg>
            </span>
            <span>Cédula colombiana</span>
          </div>
          <div className="req-card">
            <span className="ric">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="13" rx="2" />
                <path d="M2 10 h20 M6 15 h4" />
              </svg>
            </span>
            <span>Una cuenta bancaria a tu nombre</span>
          </div>
          <div className="req-card">
            <span className="ric">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 3 H14 L19 8 V21 H7 Z M14 3 V8 H19" />
                <path d="M9.5 13 h5 M9.5 16.5 h5" />
              </svg>
            </span>
            <span>Un soporte de ingresos</span>
          </div>
        </div>
      </div>
    </section>
  );
}
