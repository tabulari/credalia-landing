/**
 * "Simula tu crédito" section shell. Renders the static left feature card
 * (which also carries id="requisitos" — nav maps both #requisitos and
 * #requisitos-band). The right column is the interactive Simulator island,
 * passed in as `children` and built in Slice 3. The #simula anchor stays
 * Spanish (user-visible in the URL); class names are English.
 */
export function SimulateSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="section simulate" id="simula">
      <div className="wrap simulate-grid">
        <div className="reveal">
          <h2 className="section-h simulate-title">Simula tu crédito</h2>
          <div
            className="feature-card"
            id="requisitos"
            style={{ marginTop: "18px" }}
          >
            <div className="feature">
              <div className="ficon">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1e9e55" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21 l-4.3-4.3" />
                </svg>
              </div>
              <div>
                <h4>Conoce tu cuota antes de aplicar</h4>
                <p>Simula y conoce tu cuota y tasa antes de iniciar la solicitud.</p>
              </div>
            </div>
            <div className="feature">
              <div className="ficon">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1e9e55" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2 L20 5 V11 C20 16.5 16.5 20.5 12 22 C7.5 20.5 4 16.5 4 11 V5 Z" />
                  <path d="M9 12 l2 2 4-4.5" />
                </svg>
              </div>
              <div>
                <h4>100% en línea, sin papeles</h4>
                <p>Todo el proceso es digital, sin visitas ni filas presenciales.</p>
              </div>
            </div>
            <div className="feature">
              <div className="ficon">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1e9e55" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 3 H14 L19 8 V21 H7 Z M14 3 V8 H19" />
                  <path d="M9.5 14 l1.6 1.6 3.4-3.4" />
                </svg>
              </div>
              <div>
                <h4>Simular no afecta tu historial</h4>
                <p>La simulación no genera consultas en centrales de riesgo.</p>
              </div>
            </div>
            <div className="feature">
              <div className="ficon">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1e9e55" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21 h18 M4 21 V10 M20 21 V10 M9 21 V10 M15 21 V10 M3 10 L12 4 L21 10 Z" />
                </svg>
              </div>
              <div>
                <h4>Desembolso directo a tu cuenta</h4>
                <p>Si te aprueban, recibes el dinero en tu cuenta bancaria.</p>
              </div>
            </div>
          </div>
        </div>

        {children}
      </div>
    </section>
  );
}
