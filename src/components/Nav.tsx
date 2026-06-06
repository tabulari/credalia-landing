'use client';

import { useState } from 'react';
import { ApplyButton } from './ApplyButton';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '#como-funciona', label: 'Cómo funciona' },
  { href: '#simula', label: 'Simula tu crédito' },
  { href: '#requisitos-band', label: 'Requisitos' },
  { href: '#seguridad', label: 'Seguridad' },
  { href: '#preguntas', label: 'Preguntas' },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header
      id="top"
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border"
    >
      <div className="mx-auto max-w-container px-6 flex items-center justify-between h-16">
        <a
          href="#top"
          aria-label="Credalia — inicio"
          className="flex items-center gap-2.5"
        >
          <span aria-hidden="true">
            <svg width="48" height="30" viewBox="0 0 56 30" fill="none">
              <path d="M2 2 L11 2 L20 15 L11 28 L2 28 L11 15 Z" fill="#1e9e55" />
              <path d="M16 2 L25 2 L34 15 L25 28 L16 28 L25 15 Z" fill="#f5601b" />
              <path d="M30 2 L39 2 L48 15 L39 28 L30 28 L39 15 Z" fill="#0d2a5e" />
            </svg>
          </span>
          <span className="text-lg font-extrabold tracking-wider text-navy">
            CREDALIA
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-7">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-semibold text-foreground/80 hover:text-navy transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ApplyButton
            variant="default"
            size="sm"
            className="hidden md:inline-flex"
          >
            Iniciar solicitud
          </ApplyButton>
          <button
            type="button"
            aria-label="Abrir menú"
            aria-expanded={open}
            aria-controls="navMobile"
            onClick={() => setOpen((o) => !o)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-navy hover:bg-muted"
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 7 h16 M4 12 h16 M4 17 h16" />
            </svg>
          </button>
        </div>
      </div>

      <div
        id="navMobile"
        className={cn(
          'md:hidden overflow-hidden transition-all',
          open ? 'max-h-96 border-t border-border' : 'max-h-0',
        )}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('a, button'))
            setOpen(false);
        }}
      >
        <div className="px-6 py-4 flex flex-col gap-3">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-semibold text-foreground/80 py-1.5"
            >
              {l.label}
            </a>
          ))}
          <ApplyButton variant="outline" size="default" className="w-full">
            Solicitar crédito
          </ApplyButton>
        </div>
      </div>
    </header>
  );
}
