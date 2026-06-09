import Link from 'next/link';
import { config } from '@/lib/config';
import { WhatsAppLink } from './WhatsAppLink';
import { BrandLogo } from './icons';

export function Footer() {
  return (
    <footer data-slot="footer" className="bg-gradient-to-b from-navy-deep to-[#071940] text-white border-t border-white/10">
      <div className="mx-auto max-w-container px-6 pt-14 pb-12 lg:pt-16 lg:pb-14 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-x-8 gap-y-10 overflow-hidden">
        <div className="col-span-2 md:col-span-4 lg:col-span-1">
          <a href="#top" className="flex items-center gap-2 mb-3 min-h-[44px] py-1.5 text-white">
            <BrandLogo height={44} variant="footer" />
          </a>
          <p className="text-sm text-white/65 mb-4 max-w-[32ch]">
            Crédito digital simple, ágil y seguro. Tasa clara, 100% en línea y sin papeles.
          </p>
          <WhatsAppLink
            ctx="footer"
            className="inline-flex items-center gap-2 text-sm font-medium text-green hover:text-green/80 transition-colors min-h-[44px]"
          >
            <span className="wa-ico" aria-hidden="true" /> Escríbenos por WhatsApp
          </WhatsAppLink>
        </div>

        <nav aria-label="Empresa" className="flex flex-col gap-0.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-1">Empresa</h3>
          <Link href="/legal/terminos" className="text-sm text-white/70 hover:text-white transition-colors flex items-center min-h-[44px] py-1">Términos y condiciones</Link>
          <Link href="/legal/privacidad" className="text-sm text-white/70 hover:text-white transition-colors flex items-center min-h-[44px] py-1">Privacidad</Link>
          <a href="#seguridad" className="text-sm text-white/70 hover:text-white transition-colors flex items-center min-h-[44px] py-1">Seguridad</a>
        </nav>
        <nav aria-label="Ayuda" className="flex flex-col gap-0.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-1">Ayuda</h3>
          <a href="#preguntas" className="text-sm text-white/70 hover:text-white transition-colors flex items-center min-h-[44px] py-1">Centro de ayuda</a>
          <WhatsAppLink ctx="contact" className="text-sm text-white/70 hover:text-white transition-colors flex items-center min-h-[44px] py-1">Contacto</WhatsAppLink>
          <WhatsAppLink ctx="pqrs" className="text-sm text-white/70 hover:text-white transition-colors flex items-center min-h-[44px] py-1">PQRS</WhatsAppLink>
        </nav>
        <div className="flex flex-col gap-2.5">
          <h3 id="social-heading" className="text-xs font-bold uppercase tracking-wider text-white/50 mb-1">Síguenos</h3>
          <div className="flex gap-2 -ml-2.5" aria-labelledby="social-heading">
            <a href={config.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="inline-flex items-center justify-center w-11 h-11 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0">
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14 8 h2.5 V5 H14 c-2 0-3.3 1.3-3.3 3.4 V10 H8 v3 h2.7 v8 h3.3 v-8 H16 l.5-3 h-2.8 V8.8 C13.7 8.2 14 8 14 8Z" /></svg>
            </a>
            <a href={config.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex items-center justify-center w-11 h-11 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0">
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r="1.2" fill="currentColor" stroke="none" /></svg>
            </a>
            <a href={config.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="inline-flex items-center justify-center w-11 h-11 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0">
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M5 4 a1.8 1.8 0 1 0 0 3.6 A1.8 1.8 0 0 0 5 4Z M3.4 9 H6.6 V20 H3.4Z M9 9 h3 v1.5 c.5-.9 1.7-1.8 3.3-1.8 3 0 3.7 1.9 3.7 4.5 V20 h-3.2 v-5.2 c0-1.2-.4-2-1.5-2 -1 0-1.6.7-1.6 2 V20 H9Z" /></svg>
            </a>
            <a href={config.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="inline-flex items-center justify-center w-11 h-11 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0">
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22 8 a3 3 0 0 0-2.1-2.1C18 5.4 12 5.4 12 5.4 s-6 0-7.9.5 A3 3 0 0 0 2 8 a31 31 0 0 0 0 8 a3 3 0 0 0 2.1 2.1 c1.9.5 7.9.5 7.9.5 s6 0 7.9-.5 A3 3 0 0 0 22 16 a31 31 0 0 0 0-8Z M10 15 V9 l5 3 Z" /></svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-container px-6 py-4 flex flex-col gap-y-1 gap-x-8 sm:flex-row sm:flex-wrap sm:items-center">
          <span className="text-sm inline-flex items-center min-h-[44px]">
            <span className="text-white/50">Razón social:&nbsp;</span>
            <span className="text-white/80">{config.company.legalName}</span>
          </span>
          <span className="text-sm inline-flex items-center min-h-[44px]">
            <span className="text-white/50">NIT:&nbsp;</span>
            <span className="text-white/80">{config.company.nit}</span>
          </span>
          <span className="text-sm inline-flex items-center min-h-[44px]">
            <span className="text-white/50">Contacto:&nbsp;</span>
            <a href={`mailto:${config.contactEmail}`} className="text-white/80 hover:text-white transition-colors break-all inline-flex items-center min-h-[44px]">{config.contactEmail}</a>
          </span>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-container px-6 py-5">
          <p className="text-xs text-white/55 leading-relaxed">
            © {new Date().getFullYear()} {config.company.legalName} Todos los derechos reservados.
            {config.regulatorVerified && <> · Vigilado por la {config.regulatorName}</>}
            {' · '}<Link href="/legal/habeas-data" className="underline hover:text-white transition-colors inline-flex items-center min-h-[44px]">Tratamos tus datos conforme a la Ley 1581 de 2012 (Habeas Data)</Link>.
          </p>
        </div>
      </div>
    </footer>
  );
}
