'use client';

import Link from "next/link";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6 text-center">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d4483b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8 v4 M12 16 h.01" />
      </svg>
      <h1 className="text-2xl font-extrabold text-navy">Algo salió mal</h1>
      <p className="text-muted-foreground max-w-md">
        Ocurrió un error inesperado. Puedes intentar de nuevo o volver al inicio.
      </p>
      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={reset}
          className="rounded-pill px-5 py-2.5 text-sm font-semibold bg-navy text-white hover:bg-navy-deep transition-colors"
        >
          Intentar de nuevo
        </button>
        <Link
          href="/"
          className="rounded-pill px-5 py-2.5 text-sm font-semibold border border-border text-navy hover:bg-bg-soft transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
