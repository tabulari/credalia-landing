# Credalia Landing

Production Next.js (App Router + TypeScript + Tailwind) rebuild of the Credalia
landing page, from the design handoff bundle. Colombian digital credit service;
all UI copy is Spanish.

## Getting started

```bash
cp .env.example .env.local   # placeholders are fine for development
pnpm install
pnpm dev                     # http://localhost:3000
```

## Scripts

| Script              | What it does                                  |
| ------------------- | --------------------------------------------- |
| `pnpm dev`          | Dev server                                    |
| `pnpm build`        | Production build (fails on placeholder config)|
| `pnpm test`         | Vitest suite                                  |
| `pnpm test:credito` | Just the credit-math acceptance tests         |
| `pnpm typecheck`    | `tsc --noEmit`                                |
| `pnpm lint`         | ESLint (next/core-web-vitals + typescript)    |

## Architecture

- **All credit math is pure** — `src/lib/credit.ts` (`calculatePayment`,
  `validateApplication`, `fmtCOP`, `fmtPct`). Swappable for the real pricing
  engine without touching UI. `MONTHLY_RATE = 0.026` and the eligibility
  thresholds are ⚠️ placeholders. Internal identifiers are English; user-facing
  Spanish copy stays verbatim.
- **No hardcoded business data** — every ⚠️ value (WhatsApp number, domain, NIT,
  domicilio, contact phone, social URLs, submit endpoint) is env-driven via
  `src/lib/config.ts`. A production build throws if any placeholder survives.
- **Compliance gate** — the "Vigilados por Superfinanciera" / "Entidad vigilada"
  claims render only when `NEXT_PUBLIC_REGULATOR_VERIFIED=true`.

## Build slices

1. **Scaffold + theme + `lib/credit.ts` with passing tests**
2. Static SSR sections (Nav, Hero, Requirements, HowItWorks, Security, CTA, Footer)
3. Simulator island
4. Apply modal + `app/api/application`
5. Sticky payment bar + resume nudge + WhatsApp + funnel analytics
6. SEO/metadata + JSON-LD + favicons/OG + no-JS fallback
7. CI: typecheck, lint, credit tests, axe, Lighthouse, placeholder-guard test

User-facing Spanish copy is verbatim; user-visible URL anchors (`#simula`,
`#seguridad`, `#como-funciona`, `#requisitos`, `#preguntas`) stay Spanish.
All other identifiers (code, file/component names, CSS classes) are English.

Design source of truth: `../design_handoff_credalia_landing/` (read-only).
