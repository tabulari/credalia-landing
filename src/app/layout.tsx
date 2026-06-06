import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { config } from "@/lib/config";
import { StructuredData } from "@/components/StructuredData";
import { SiteUiProvider } from "@/components/site-ui";
import { SimulatorProvider } from "@/components/simulator-store";
import { RevealController } from "@/components/RevealController";
import "./globals.css";

// Plus Jakarta Sans — chosen to match the mockup (README "Typography").
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const DESCRIPTION =
  "Crédito digital en Colombia hasta $1.000.000. Respuesta en minutos, tasa clara y sin papeles. Simula tu crédito sin afectar tu historial y solicita 100% en línea.";
const OG_TITLE = "Credalia — Crédito digital hasta $1.000.000";

// metadataBase makes OG/canonical URLs absolute (⚠️ NEXT_PUBLIC_SITE_URL must be
// the real domain or WhatsApp/social previews break).
export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: "Credalia — Crédito digital 100% en línea",
  description: DESCRIPTION,
  authors: [{ name: "Credalia" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Credalia",
    locale: "es_CO",
    url: "/",
    title: OG_TITLE,
    description:
      "Respuesta en minutos. Tasa clara. Sin papeles. Simula tu crédito sin afectar tu historial y solicita 100% en línea.",
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: OG_TITLE },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE,
    description:
      "Respuesta en minutos. Tasa clara. Sin papeles. Simula y solicita 100% en línea.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d2a5e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={jakarta.variable} suppressHydrationWarning>
      <body>
        {/* Set the JS flag before paint so `.reveal` content is never stranded
            hidden without JS (matches the prototype's inline head script). */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />

        <StructuredData />

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
          {/* Landing-only overlays (sticky bar, apply modal, resume nudge) are
              rendered by the landing page itself, not here, so other routes
              (e.g. /legal) don't mount them. */}
          <SimulatorProvider>{children}</SimulatorProvider>
        </SiteUiProvider>

        <RevealController />
      </body>
    </html>
  );
}
