import { config } from "@/lib/config";

/**
 * ⚠️ COMPLIANCE: the "Entidad vigilada" card asserts Superfinanciera
 * supervision — it renders only when NEXT_PUBLIC_REGULATOR_VERIFIED is true.
 * The remaining cards (encryption, Habeas Data, simular-no-afecta) are
 * design-safe drafts; legal must still verify wording before launch.
 */
export function Security() {
  return (
    <section className="section security" id="seguridad">
      <div className="wrap">
        <div className="sec-head reveal">
          <p className="eyebrow sec-eyebrow">Seguridad</p>
          <h2 className="section-h">Tu información está protegida en cada paso.</h2>
          <p className="sec-sub">
            Cuidamos tus datos con estándares de la industria financiera y los
            tratamos conforme a la ley colombiana.
          </p>
        </div>
        <div className="sec-grid reveal d1">
          <div className="sec-card">
            <div className="sec-ic">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="10" width="16" height="11" rx="2" />
                <path d="M8 10 V7 a4 4 0 0 1 8 0 v3" />
                <circle cx="12" cy="15.5" r="1.3" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <h4>Datos cifrados</h4>
            <p>Tu información viaja y se almacena cifrada, protegida de extremo a extremo.</p>
          </div>
          <div className="sec-card">
            <div className="sec-ic">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 3 H7 a2 2 0 0 0-2 2 v14 a2 2 0 0 0 2 2 h10 a2 2 0 0 0 2-2 V8 Z M14 3 v5 h5" />
                <path d="M9 13 h6 M9 16.5 h4" />
              </svg>
            </div>
            <h4>Tratamiento conforme a la ley</h4>
            <p>Tratamos tus datos personales según la Ley 1581 de 2012 (Habeas Data).</p>
          </div>
          {config.regulatorVerified && (
            <div className="sec-card">
              <div className="sec-ic">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2 L20 5 V11 C20 16.5 16.5 20.5 12 22 C7.5 20.5 4 16.5 4 11 V5 Z" />
                  <path d="M9 12 l2 2 4-4.5" />
                </svg>
              </div>
              <h4>Entidad vigilada</h4>
              <p>Operamos bajo la supervisión de la Superintendencia Financiera de Colombia.</p>
            </div>
          )}
          <div className="sec-card">
            <div className="sec-ic">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21 l-4.3-4.3" />
                <path d="M8.5 11 l1.8 1.8 3.2-3.4" />
              </svg>
            </div>
            <h4>Simular no afecta tu historial</h4>
            <p>La simulación es informativa y no genera consultas en centrales de riesgo.</p>
          </div>
        </div>
        <p className="sec-foot reveal">
          ¿Quieres saber más sobre cómo cuidamos tus datos? Lee nuestra{" "}
          <a href="/legal/privacidad">Política de Privacidad</a>.
        </p>
      </div>
    </section>
  );
}
