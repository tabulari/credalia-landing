/**
 * Static iPhone WhatsApp-style chat mockup (Hero right column). Decorative;
 * framed honestly as a "simulación", no fabricated pre-approval %.
 */
import { config } from '@/lib/config';
import './phone-chat.css';

export function PhoneChat() {
  return (
    <div className="phone" aria-hidden="true">
      <div className="phone-body">
      <div className="phone-screen">
        <div className="phone-notch" aria-hidden="true" />
        <div className="status-bar">
          <span>10:33</span>
          <span className="status-icons">
            <svg width="17" height="11" viewBox="0 0 17 11" fill="var(--navy-ink)">
              <rect x="0" y="7" width="3" height="4" rx="1" />
              <rect x="4.5" y="4.5" width="3" height="6.5" rx="1" />
              <rect x="9" y="2" width="3" height="9" rx="1" />
              <rect x="13.5" y="0" width="3" height="11" rx="1" />
            </svg>
            <svg width="16" height="11" viewBox="0 0 16 11" fill="var(--navy-ink)">
              <path d="M8 2.2C10.5 2.2 12.7 3.2 14.3 4.8L13 6.1C11.7 4.8 10 4 8 4S4.3 4.8 3 6.1L1.7 4.8C3.3 3.2 5.5 2.2 8 2.2Z" />
              <path d="M8 5.6C9.2 5.6 10.3 6.1 11.1 6.9L8 10 4.9 6.9C5.7 6.1 6.8 5.6 8 5.6Z" />
            </svg>
            <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
              <rect x="1" y="1" width="20" height="10" rx="3" stroke="var(--navy-ink)" strokeWidth="1" opacity=".4" />
              <rect x="2.5" y="2.5" width="15" height="7" rx="1.5" fill="var(--navy-ink)" />
              <rect x="22" y="4" width="1.5" height="4" rx="1" fill="var(--navy-ink)" opacity=".5" />
            </svg>
          </span>
        </div>
        <div className="chat-header">
          <span className="back">←</span>
          <span className="logo" aria-hidden="true">
            <svg width="26" height="16" viewBox="0 0 56 30">
              <path d="M2 2 L11 2 L20 15 L11 28 L2 28 L11 15 Z" fill="var(--green)" />
              <path d="M16 2 L25 2 L34 15 L25 28 L16 28 L25 15 Z" fill="var(--orange)" />
              <path d="M30 2 L39 2 L48 15 L39 28 L30 28 L39 15 Z" fill="var(--navy)" />
            </svg>
          </span>
          <span className="who">
            {config.brandName}
            <svg width="15" height="15" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="var(--green)" />
              <path d="M8 12 l2.5 2.5 L16 9" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        <div className="chat-body">
          <div className="bubble them">
            ¡Hola! Soy Laura, necesito $500.000 para una emergencia. ¿En qué te puedo ayudar?
            <div className="t">10:30</div>
          </div>
          <div className="bubble me">
            ¡Hola! Laura 👋 Con gusto te ayudamos. Para empezar, ¿cuál monto necesitas?
            <div className="t">10:30</div>
          </div>
          <div className="bubble them">
            Necesito $500.000<div className="t">10:30</div>
          </div>
          <div className="bubble me">
            Perfecto Laura. Te comparto tu simulación personalizada…
            <div className="t">10:31</div>
          </div>
          <div className="bubble me" style={{ maxWidth: "88%" }}>
            <div className="sim-title">Tu simulación</div>
            <div className="sim-row">💲 Monto solicitado: $500.000</div>
            <div className="sim-row">📅 Plazo: 12 meses</div>
            <div className="sim-row">💳 Cuota mensual: $49.039/mes</div>
            <div className="t">10:31</div>
          </div>
          <div className="bubble note" style={{ maxWidth: "88%" }}>
            <div className="ph">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted-2, #5d6b82)" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 11 v5 M12 8 h.01" strokeLinecap="round" />
              </svg>{" "}
              Esto es una simulación, no una aprobación.
            </div>
            La decisión final depende de la validación de tus datos. Simular no afecta tu historial.
            <div className="t">10:31</div>
          </div>
          <div className="bubble them">
            Entiendo. ¿Cómo inicio mi solicitud?<div className="t">10:32</div>
          </div>
          <div className="bubble me">
            Te guío paso a paso desde aquí 👇<div className="t">10:32</div>
          </div>
        </div>
        <div className="chat-input">
          <span style={{ fontSize: "16px" }}>🙂</span>
          <div className="field">Escribe un mensaje</div>
          <span style={{ fontSize: "14px", color: "var(--muted-2, #97a0ad)" }}>📎</span>
          <span style={{ fontSize: "14px", color: "var(--muted-2, #97a0ad)" }}>📷</span>
          <span className="send">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff">
              <path d="M22 2 L11 13 M22 2 L15 22 L11 13 L2 9 Z" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        <div className="phone-home" />
      </div>
      </div>
    </div>
  );
}
