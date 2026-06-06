import Link from "next/link";
import { config } from "@/lib/config";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6 text-center">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={config.colors.navy} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21 l-4.3-4.3" />
      </svg>
      <h1 className="text-2xl font-extrabold text-navy">Página no encontrada</h1>
      <p className="text-muted-foreground max-w-md">
        La página que buscas no existe o fue movida.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-pill px-5 py-2.5 text-sm font-semibold bg-navy text-white hover:bg-navy-deep transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
