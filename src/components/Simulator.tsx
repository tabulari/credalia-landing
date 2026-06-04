/**
 * Slice 2 placeholder for the Simulator island. Keeps the #simulator hook and
 * the two-column grid intact for review. Slice 3 replaces this file with the
 * full interactive "use client" island (slider/input/stepper, radiogroups,
 * eligibility gate, exact-payment flash, shared store).
 */
export function Simulator() {
  return (
    <div className="sim reveal d1" id="simulator">
      <div className="sim-head">
        <h3 className="section-h">Simulador de crédito</h3>
        <span className="tag">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e9e55" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2 L20 5 V11 C20 16.5 16.5 20.5 12 22 C7.5 20.5 4 16.5 4 11 V5 Z" />
            <path d="M9 12 l2 2 4-4.5" />
          </svg>{" "}
          Sin afectar tu historial
        </span>
      </div>
      <p className="disclaimer">El simulador interactivo se construye en el Slice 3.</p>
    </div>
  );
}
