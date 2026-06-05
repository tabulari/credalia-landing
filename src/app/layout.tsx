import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { config } from "@/lib/config";
import { SiteUiProvider } from "@/components/site-ui";
import { SimulatorProvider } from "@/components/simulator-store";
import { ApplyModal } from "@/components/ApplyModal";
import { RevealController } from "@/components/RevealController";
import "./globals.css";

// Plus Jakarta Sans — chosen to match the mockup (README "Typography").
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

// Full SEO/OG/JSON-LD metadata lands in Slice 6.
export const metadata: Metadata = {
  title: "Credalia — Crédito digital hasta $1.000.000",
  description:
    "Crédito digital en Colombia hasta $1.000.000. Respuesta en minutos, tasa clara y sin papeles. Simula tu crédito sin afectar tu historial y solicita 100% en línea.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={jakarta.variable}>
      <body>
        {/* Set the JS flag before paint so `.reveal` content is never stranded
            hidden without JS (matches the prototype's inline head script). */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />

        <a className="skip-link" href="#simula">
          Saltar al contenido
        </a>

        <noscript>
          <div className="noscript-banner">
            <strong>Activa JavaScript</strong> para usar el simulador y
            solicitar tu crédito en línea. Mientras tanto, puedes escribirnos por{" "}
            <a
              href={`https://wa.me/${config.whatsappPhone}`}
              target="_blank"
              rel="noopener"
            >
              WhatsApp
            </a>{" "}
            y te ayudamos con tu simulación.
          </div>
        </noscript>

        <SiteUiProvider>
          <SimulatorProvider>
            {children}
            <ApplyModal />
            {/* StickyPaymentBar + ResumeNudge mount here in Slice 5 */}
          </SimulatorProvider>
        </SiteUiProvider>

        <RevealController />
      </body>
    </html>
  );
}
