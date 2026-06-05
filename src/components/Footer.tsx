import Link from "next/link";
import { config } from "@/lib/config";
import { WhatsAppLink } from "./WhatsAppLink";

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <a className="brand" href="#top">
            <span className="logo" aria-hidden="true">
              <svg width="38" height="27" viewBox="0 0 42 30">
                <path d="M2 2 L11 2 L20 15 L11 28 L2 28 L11 15 Z" fill="#1e9e55" />
                <path d="M16 2 L25 2 L34 15 L25 28 L16 28 L25 15 Z" fill="#f2691c" />
              </svg>
            </span>
            <span className="brand-name">CREDALIA</span>
          </a>
          <p className="footer-about">
            Plataforma de crédito digital simple, ágil y 100% en línea. Crédito
            claro, tasa simple, segura y en línea.
          </p>
          <WhatsAppLink ctx="footer" className="footer-wa js-wa">
            <span className="wa-ico" aria-hidden="true" /> Escríbenos por WhatsApp
          </WhatsAppLink>
          <p className="footer-reg">
            {config.regulatorVerified
              ? "Vigilado por la Superintendencia Financiera de Colombia. Tratamos tus datos conforme a la Ley 1581 de 2012 (Habeas Data)."
              : "Tratamos tus datos conforme a la Ley 1581 de 2012 (Habeas Data)."}
          </p>
        </div>
        <div className="footer-col">
          <h5>Producto</h5>
          <a href="#simula">Simula tu crédito</a>
          <a href="#requisitos-band">Requisitos</a>
          <a href="#seguridad">Seguridad</a>
          <a href="#preguntas">Preguntas</a>
        </div>
        <div className="footer-col">
          <h5>Empresa</h5>
          <Link href="/legal/terminos">Términos y condiciones</Link>
          <Link href="/legal/privacidad">Privacidad</Link>
          <a href="#seguridad">Seguridad</a>
        </div>
        <div className="footer-col">
          <h5>Ayuda</h5>
          <a href="#preguntas">Centro de ayuda</a>
          <WhatsAppLink ctx="contact" className="js-wa">
            Contacto
          </WhatsAppLink>
          <WhatsAppLink ctx="pqrs" className="js-wa">
            PQRS
          </WhatsAppLink>
        </div>
        <div className="footer-col">
          <h5>Síguenos</h5>
          <div className="socials">
            <a href={config.social.facebook} target="_blank" rel="noopener" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                <path d="M14 8 h2.5 V5 H14 c-2 0-3.3 1.3-3.3 3.4 V10 H8 v3 h2.7 v8 h3.3 v-8 H16 l.5-3 h-2.8 V8.8 C13.7 8.2 14 8 14 8Z" />
              </svg>
            </a>
            <a href={config.social.instagram} target="_blank" rel="noopener" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17" cy="7" r="1.2" fill="#fff" stroke="none" />
              </svg>
            </a>
            <a href={config.social.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                <path d="M5 4 a1.8 1.8 0 1 0 0 3.6 A1.8 1.8 0 0 0 5 4Z M3.4 9 H6.6 V20 H3.4Z M9 9 h3 v1.5 c.5-.9 1.7-1.8 3.3-1.8 3 0 3.7 1.9 3.7 4.5 V20 h-3.2 v-5.2 c0-1.2-.4-2-1.5-2 -1 0-1.6.7-1.6 2 V20 H9Z" />
              </svg>
            </a>
            <a href={config.social.youtube} target="_blank" rel="noopener" aria-label="YouTube">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                <path d="M22 8 a3 3 0 0 0-2.1-2.1C18 5.4 12 5.4 12 5.4 s-6 0-7.9.5 A3 3 0 0 0 2 8 a31 31 0 0 0 0 8 a3 3 0 0 0 2.1 2.1 c1.9.5 7.9.5 7.9.5 s6 0 7.9-.5 A3 3 0 0 0 22 16 a31 31 0 0 0 0-8Z M10 15 V9 l5 3 Z" fill="#fff" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="wrap footer-identity">
        <div className="fid-item">
          <span className="fid-k">Razón social</span>
          <span className="fid-v">{config.company.legalName}</span>
        </div>
        <div className="fid-item">
          <span className="fid-k">NIT</span>
          <span className="fid-v">{config.company.nit}</span>
        </div>
        <div className="fid-item">
          <span className="fid-k">Domicilio</span>
          <span className="fid-v">{config.company.address}</span>
        </div>
        <div className="fid-item">
          <span className="fid-k">Atención al cliente</span>
          <span className="fid-v">hola@credalia.co · Lun a Vie, 8:00–18:00</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2025 {config.company.legalName} Todos los derechos reservados.</span>
        {config.regulatorVerified && (
          <span className="footer-bottom-reg">
            Vigilado por la Superintendencia Financiera de Colombia.
          </span>
        )}
      </div>
    </footer>
  );
}
