import Link from 'next/link';
import { config } from '@/lib/config';
import { WhatsAppLink } from './WhatsAppLink';
import { CredaliaLogo } from './icons';

export function Footer() {
  return (
    <footer data-slot="footer" className="bg-gradient-to-b from-navy-deep to-[#071940] text-white">
      <div className="mx-auto max-w-container px-6 py-16 lg:py-20 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr] gap-8">
        <div className="col-span-2 lg:col-span-1">
          <a href="#top" className="flex items-center gap-2 mb-3">
            <span aria-hidden="true">
              <CredaliaLogo size={44} />
            </span>
            <span className="text-lg font-extrabold tracking-[0.08em]"> {config.brandName.toUpperCase()}</span>
          </a>
          <p className="text-sm text-white/60 mb-4">
            Crédito digital simple, ágil y seguro. Tasa clara, 100% en línea y sin papeles.
          </p>
          <WhatsAppLink
            ctx="footer"
            className="inline-flex items-center gap-2 text-sm text-green/70 hover:text-green transition-colors"
          >
            <span className="wa-ico" aria-hidden="true" /> Escríbenos por WhatsApp
          </WhatsAppLink>
          <p className="text-xs text-white/50 mt-4">
            {config.regulatorVerified
              ? `Vigilado por la ${config.regulatorName}. Tratamos tus datos conforme a la Ley 1581 de 2012 (Habeas Data).`
              : 'Tratamos tus datos conforme a la Ley 1581 de 2012 (Habeas Data).'}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <h5 className="text-sm font-bold mb-1">Producto</h5>
          <a href="#simula" className="text-sm text-white/70 hover:text-white transition-colors py-1.5 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-white after:transition-all after:duration-200 hover:after:w-full">Simula tu crédito</a>
          <a href="#requisitos-band" className="text-sm text-white/70 hover:text-white transition-colors py-1.5 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-white after:transition-all after:duration-200 hover:after:w-full">Requisitos</a>
          <a href="#seguridad" className="text-sm text-white/70 hover:text-white transition-colors py-1.5 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-white after:transition-all after:duration-200 hover:after:w-full">Seguridad</a>
          <a href="#preguntas" className="text-sm text-white/70 hover:text-white transition-colors py-1.5 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-white after:transition-all after:duration-200 hover:after:w-full">Preguntas</a>
        </div>
        <div className="flex flex-col gap-1">
          <h5 className="text-sm font-bold mb-1">Empresa</h5>
          <Link href="/legal/terminos" className="text-sm text-white/70 hover:text-white transition-colors py-1.5 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-white after:transition-all after:duration-200 hover:after:w-full">Términos y condiciones</Link>
          <Link href="/legal/privacidad" className="text-sm text-white/70 hover:text-white transition-colors py-1.5 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-white after:transition-all after:duration-200 hover:after:w-full">Privacidad</Link>
          <a href="#seguridad" className="text-sm text-white/70 hover:text-white transition-colors py-1.5 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-white after:transition-all after:duration-200 hover:after:w-full">Seguridad</a>
        </div>
        <div className="flex flex-col gap-1">
          <h5 className="text-sm font-bold mb-1">Ayuda</h5>
          <a href="#preguntas" className="text-sm text-white/70 hover:text-white transition-colors py-1.5 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-white after:transition-all after:duration-200 hover:after:w-full">Centro de ayuda</a>
          <WhatsAppLink ctx="contact" className="text-sm text-white/70 hover:text-white transition-colors py-1.5">Contacto</WhatsAppLink>
          <WhatsAppLink ctx="pqrs" className="text-sm text-white/70 hover:text-white transition-colors py-1.5">PQRS</WhatsAppLink>
        </div>
        <div className="flex flex-col gap-2">
          <h5 id="social-heading" className="text-sm font-bold mb-1">Síguenos</h5>
          <div className="flex gap-3" aria-labelledby="social-heading">
            <a href={config.social.facebook} target="_blank" rel="noopener" aria-label="Facebook" className="inline-flex items-center justify-center w-11 h-11 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14 8 h2.5 V5 H14 c-2 0-3.3 1.3-3.3 3.4 V10 H8 v3 h2.7 v8 h3.3 v-8 H16 l.5-3 h-2.8 V8.8 C13.7 8.2 14 8 14 8Z" /></svg>
            </a>
            <a href={config.social.instagram} target="_blank" rel="noopener" aria-label="Instagram" className="inline-flex items-center justify-center w-11 h-11 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r="1.2" fill="currentColor" stroke="none" /></svg>
            </a>
            <a href={config.social.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn" className="inline-flex items-center justify-center w-11 h-11 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M5 4 a1.8 1.8 0 1 0 0 3.6 A1.8 1.8 0 0 0 5 4Z M3.4 9 H6.6 V20 H3.4Z M9 9 h3 v1.5 c.5-.9 1.7-1.8 3.3-1.8 3 0 3.7 1.9 3.7 4.5 V20 h-3.2 v-5.2 c0-1.2-.4-2-1.5-2 -1 0-1.6.7-1.6 2 V20 H9Z" /></svg>
            </a>
            <a href={config.social.youtube} target="_blank" rel="noopener" aria-label="YouTube" className="inline-flex items-center justify-center w-11 h-11 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M22 8 a3 3 0 0 0-2.1-2.1C18 5.4 12 5.4 12 5.4 s-6 0-7.9.5 A3 3 0 0 0 2 8 a31 31 0 0 0 0 8 a3 3 0 0 0 2.1 2.1 c1.9.5 7.9.5 7.9.5 s6 0 7.9-.5 A3 3 0 0 0 22 16 a31 31 0 0 0 0-8Z M10 15 V9 l5 3 Z" /></svg>
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-container px-6 py-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <span className="text-xs text-white/50 block">Razón social</span>
            <span className="text-sm font-medium">{config.company.legalName}</span>
          </div>
          <div>
            <span className="text-xs text-white/50 block">NIT</span>
            <span className="text-sm font-medium">{config.company.nit}</span>
          </div>
          <div>
            <span className="text-xs text-white/50 block">Domicilio</span>
            <span className="text-sm font-medium">{config.company.address}</span>
          </div>
          <div>
            <span className="text-xs text-white/50 block">Atención al cliente</span>
            <span className="text-sm font-medium">{config.contactEmail} · {config.contactHours}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-container px-6 py-5 border-t border-white/10 flex flex-col sm:flex-row gap-2 justify-between">
        <span className="text-xs text-white/50">
          © {new Date().getFullYear()} {config.company.legalName} Todos los derechos reservados.
        </span>
        {config.regulatorVerified && (
          <span className="text-xs text-white/50">
            Vigilado por la {config.regulatorName}.
          </span>
        )}
      </div>
    </footer>
  );
}
