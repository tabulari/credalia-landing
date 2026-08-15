# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are underbanked or thin-file borrowers in Colombia: adults who
need fast access to a small consumer credit (up to COP 1 000 000) but do not
meet the credit history or paperwork bar of traditional banking. Their
situation is an immediate, real need for cash — typically consumption, not
business — and they want to resolve it quickly. Their job is to obtain an
approved loan at a clear rate, fully online, without branch visits, onerous
paperwork, or the fear of being scammed.

## Product Purpose

Credalia makes end-to-end digital credit available to people the traditional
system excludes. A visitor can simulate a loan, apply, and (subject to product
rollout) receive the money in their account without ever visiting a branch or
submitting physical documents. Success means converting a cautious visitor
into a confident applicant who understands exactly what they are signing.

## Positioning

The claim a copycat could not truthfully copy is "100% en línea": genuinely
end-to-end online credit — simulate, apply, decide, disburse — with a clear,
upfront, fixed rate and a response in minutes. Speed and clarity together are
the moat; the whole experience is on the same screen, no phone tag, no branch,
no hidden terms.

## Operating Context

Visitors arrive by direct URL, referral, or ad campaign and use the page on a
phone more often than a desktop. The critical journey is Simulate credit →
View results → Apply (primary action), with WhatsApp as a secondary contact
channel. The emotional arc goes Curious → Cautious → Reassured → Confident →
Action; trust signals (regulator seal, encryption messaging, clear rate) are
load-bearing at every step.

## Capabilities and Constraints

- 100% online simulator (amount, term, frequency → payment) with pure,
  swappable credit math in `src/lib/credit.ts`.
- Application modal forwarding web leads to the Core intake endpoint
  (server-only secret, rate-limited at 5 req/min/IP).
- Sticky payment bar + resume nudge to recover the funnel.
- Compliance-gated regulator claims: "Vigilados por Superfinanciera", "Entidad
  vigilada", and any disbursement-time claim render ONLY when explicitly
  enabled, and defaults are empty/off until legal signs off.
- Placeholder config must never ship: a production build throws if any
  deployment-specific value (Core endpoints, web-lead secret) survives.
- All user-facing copy is verbatim Spanish; doc-comments and identifiers are
  English.
- WCAG AA is the accessibility floor (4.5:1 contrast, ≥44px targets,
  keyboard + reduced-motion support).

## Brand Commitments

- Name: Credalia. Tagline territory: "Crédito digital 100% en línea".
- Brand tokens: navy `#0d2a5e`, orange `#f5601b`, green `#1e9e55` (with
  contrast-safe ink variants). Typography: DM Serif Display (display) +
  Plus Jakarta Sans (body), Spanish voice, warm and reassuring fintech tone.
- Identity constraints: regulator seals and disbursement claims only when
  legally signed off; never invent testimonials, rates, or credentials.

## Evidence on Hand

- Design source of truth: `../design_handoff_credalia_landing/` (read-only).
- Production Next.js (App Router) implementation with tokens in CSS variables;
  landing spec/rubric in `.opencode/skills/ux-score-audit/specs/landing.md`.
- No real customers, testimonials, case studies, or press material exists;
  future work must not fabricate them.

## Product Principles

1. Speed is the product claim — every interaction should feel immediate.
2. Clarity outranks decoration: an explicit rate and a plain-language amount
   beat a clever but opaque design.
3. Trust is compliance-checked: official claims ship only when legally certain.
4. Mobile is the primary surface; desktop is the refinement.
5. The funnel is fragile — never lose state, never hide the way forward.

## Accessibility & Inclusion

WCAG 2.1 AA minimum: contrast ≥ 4.5:1, tap targets ≥ 44×44px, visible focus,
full keyboard support, `prefers-reduced-motion` disables all animation, and
form inputs always labeled. Served in plain Spanish to underbanked users
typical of thin-file credit borrowers, so clear copy and obvious navigation
are an inclusion requirement, not a nicety.