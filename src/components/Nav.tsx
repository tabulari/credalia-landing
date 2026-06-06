'use client';

import { useEffect, useRef, useState } from 'react';
import { ApplyButton } from './ApplyButton';
import { cn } from '@/lib/utils';
import { config } from '@/lib/config';
import { CredaliaLogo, HamburgerIcon } from './icons';

const LINKS = [
  { href: '#como-funciona', label: 'Cómo funciona' },
  { href: '#simula', label: 'Simula tu crédito' },
  { href: '#requisitos-band', label: 'Requisitos' },
  { href: '#seguridad', label: 'Seguridad' },
  { href: '#preguntas', label: 'Preguntas' },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (open) {
      firstLinkRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header
      id="top"
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border"
    >
      <div className="mx-auto max-w-container px-6 flex items-center justify-between h-16">
        <a
          href="#top"
          aria-label={`${config.brandName} — inicio`}
          className="flex items-center gap-2.5"
        >
          <span aria-hidden="true">
            <CredaliaLogo size={48} />
          </span>
          <span className="text-lg font-extrabold tracking-wider text-navy">
            {config.brandName.toUpperCase()}
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
            ref={toggleRef}
            type="button"
            aria-label="Abrir menú"
            aria-expanded={open}
            aria-controls="navMobile"
            onClick={() => setOpen((o) => !o)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-navy hover:bg-muted"
          >
            <HamburgerIcon size={26} />
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
          {LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              ref={i === 0 ? firstLinkRef : undefined}
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
