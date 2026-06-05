'use client';

import { useState } from 'react';
import { ApplyButton } from './ApplyButton';

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
    <header className="nav" id="top">
      <div className="wrap nav-inner">
        <a
          className="brand"
          href="#top"
          aria-label="Credalia — inicio"
        >
          <span className="logo" aria-hidden="true">
            <svg
              width="42"
              height="30"
              viewBox="0 0 42 30"
              fill="none"
            >
              <path
                d="M2 2 L11 2 L20 15 L11 28 L2 28 L11 15 Z"
                fill="#1e9e55"
              />
              <path
                d="M16 2 L25 2 L34 15 L25 28 L16 28 L25 15 Z"
                fill="#0d2a5e"
              />
            </svg>
          </span>
          <span className="brand-name">CREDALIA</span>
        </a>
        <nav className="nav-links">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav-cta">
          <ApplyButton className="btn btn-outline">
            Solicitar crédito
          </ApplyButton>
          <button
            className="nav-toggle"
            id="navToggle"
            type="button"
            aria-label="Abrir menú"
            aria-expanded={open}
            aria-controls="navMobile"
            onClick={() => setOpen((o) => !o)}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0d2a5e"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 7 h16 M4 12 h16 M4 17 h16" />
            </svg>
          </button>
        </div>
      </div>
      <div
        className={`nav-mobile${open ? ' open' : ''}`}
        id="navMobile"
        onClick={(e) => {
          // close after picking a link/button (matches prototype)
          if ((e.target as HTMLElement).closest('a, .btn'))
            setOpen(false);
        }}
      >
        {LINKS.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
        <ApplyButton className="btn btn-outline btn-block">
          Solicitar crédito
        </ApplyButton>
      </div>
    </header>
  );
}
