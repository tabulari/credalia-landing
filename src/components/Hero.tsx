import { config } from "@/lib/config";
import { ApplyButton } from "./ApplyButton";
import { ScrollButton } from "./ScrollButton";
import { PhoneChat } from "./PhoneChat";
import { WhatsAppLink } from "./WhatsAppLink";

export function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2 L20 5 V11 C20 16.5 16.5 20.5 12 22 C7.5 20.5 4 16.5 4 11 V5 Z" />
              <path d="M9 12 l2 2 4-4.5" />
            </svg>
            Crédito 100% en línea
          </span>
          <h1>
            Crédito digital hasta <span className="amt">$1.000.000</span>
          </h1>
          <p className="hero-sub">Respuesta en minutos. Tasa clara. Sin papeles.</p>
          <div className="hero-ctas">
            <ScrollButton className="btn btn-navy" target="#simula">
              Simular mi crédito <span className="btn-arrow">→</span>
            </ScrollButton>
            <ApplyButton className="btn btn-outline">
              Solicitar crédito <span className="btn-arrow">→</span>
            </ApplyButton>
          </div>
          <WhatsAppLink ctx="hero" className="whatsapp-line js-wa">
            <span className="wa-ico" aria-hidden="true" />
            <span>
              ¿Dudas? Escríbenos por <b>WhatsApp</b>
            </span>
          </WhatsAppLink>
          {/* ⚠️ COMPLIANCE: the Superfinanciera seal renders only when the
              regulator status is verified (NEXT_PUBLIC_REGULATOR_VERIFIED). */}
          <div className="hero-seals">
            {config.regulatorVerified && (
              <span className="hero-seal">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2 L20 5 V11 C20 16.5 16.5 20.5 12 22 C7.5 20.5 4 16.5 4 11 V5 Z" />
                  <path d="M9 12 l2 2 4-4.5" />
                </svg>
                Vigilados por <b>Superfinanciera</b>
              </span>
            )}
            <span className="hero-seal">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="10" width="16" height="11" rx="2" />
                <path d="M8 10 V7 a4 4 0 0 1 8 0 v3" />
              </svg>
              Datos <b>cifrados</b>
            </span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-rings" aria-hidden="true">
            <svg viewBox="0 0 560 560" fill="none">
              <circle cx="280" cy="280" r="120" stroke="#e0e6ef" strokeWidth="1.5" />
              <circle cx="280" cy="280" r="180" stroke="#e6ebf2" strokeWidth="1.5" />
              <circle cx="280" cy="280" r="250" stroke="#eef1f6" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="hero-chevrons" aria-hidden="true">
            <svg width="220" height="200" viewBox="0 0 220 200" fill="none">
              <path d="M10 26 C10 16 18 8 28 8 L70 8 L138 92 C144 99 144 109 138 116 L70 200 L28 200 C18 200 10 192 10 182 Z" fill="#1e9e55" />
              <path d="M70 26 C70 16 78 8 88 8 L130 8 L198 92 C204 99 204 109 198 116 L130 200 L88 200 C78 200 70 192 70 182 Z" fill="#f2691c" />
              <path d="M130 26 C130 16 138 8 148 8 L190 8 L258 92 C264 99 264 109 258 116 L190 200 L148 200 C138 200 130 192 130 182 Z" fill="#0d2a5e" />
            </svg>
          </div>
          <PhoneChat />
        </div>
      </div>
    </section>
  );
}
