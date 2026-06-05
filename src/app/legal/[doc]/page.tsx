import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { config } from "@/lib/config";

/**
 * Legal pages — terminos | privacidad | seguridad. Intentionally placeholder
 * drafts (real copy authored by legal before launch) and noindex. Reached via
 * /legal/<doc> and the Spanish rewrites /terminos · /privacidad.
 */
const DOCS: Record<string, string> = {
  terminos: "Términos y condiciones",
  privacidad: "Política de Privacidad",
  seguridad: "Política de Seguridad",
};

export function generateStaticParams() {
  return Object.keys(DOCS).map((doc) => ({ doc }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ doc: string }>;
}): Promise<Metadata> {
  const { doc } = await params;
  const title = DOCS[doc];
  return {
    title: title ? `${title} — Credalia` : "Legal — Credalia",
    description:
      "Documentos legales de Credalia: términos y condiciones, política de privacidad y tratamiento de datos.",
    robots: { index: false, follow: false },
  };
}

const Skeleton = () => (
  <div className="legal-skeleton">
    <span />
    <span />
    <span />
    <span />
  </div>
);

export default async function LegalDoc({
  params,
}: {
  params: Promise<{ doc: string }>;
}) {
  const { doc } = await params;
  const title = DOCS[doc];
  if (!title) notFound();

  return (
    <div className="legal-page">
      <div className="legal-wrap">
        <Link className="legal-back" href="/">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18 l-6-6 6-6" />
          </svg>
          Volver a Credalia
        </Link>

        <p className="legal-eyebrow">Documento legal</p>
        <h1>{title}</h1>
        <p className="legal-meta">Última actualización: pendiente</p>

        <div className="legal-draft">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 9 v4 M12 17 h.01" />
            <path d="M10.3 3.9 1.8 18.5 a2 2 0 0 0 1.7 3 h17 a2 2 0 0 0 1.7-3 L13.7 3.9 a2 2 0 0 0-3.4 0Z" />
          </svg>
          <p>
            <b>Borrador de prototipo.</b> Este documento es un marcador de
            posición. El texto legal definitivo debe ser redactado y revisado por
            el equipo legal de Credalia antes de publicar.
          </p>
        </div>

        <div className="legal-body">
          <h2>1. Información general</h2>
          <Skeleton />
          <h2>2. Condiciones del servicio</h2>
          <Skeleton />
          <h2>3. Tratamiento de datos personales</h2>
          <p>
            Credalia trata los datos personales de sus usuarios conforme a la Ley
            1581 de 2012 (Habeas Data) y demás normativa colombiana aplicable. El
            contenido detallado de esta sección está pendiente de redacción.
          </p>
          <Skeleton />
        </div>

        <p className="legal-foot">
          ¿Tienes preguntas sobre este documento? Escríbenos por{" "}
          <a href={`https://wa.me/${config.whatsappPhone}`} target="_blank" rel="noopener">
            WhatsApp
          </a>
          .
        </p>
      </div>
    </div>
  );
}
