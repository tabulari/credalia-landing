# Credalia Platform UX Audit — Architectural Specification

> This document extends `.opencode/skills/ux-score-audit/SKILL.md`.
> SKILL.md is the operational reference (protocols, rubrics, scripts, pitfalls).
> This document is the architectural foundation — how the system **thinks**,
> why it **works**, and how to **extend** it to new surfaces and new products.
>
> The Credalia platform comprises multiple products (landing pages, dashboards,
> application flows, admin panels). This specification is product-agnostic at
> the architectural level. Credalia-specific values appear only in SKILL.md
> §2 (Platform Constants) and `specs/` files.

---

## Part I: The Architecture

### 1. The Three-Layer Model

The audit system has three layers. Each has a distinct actor and a
non-negotiable contract. Break a contract and everything downstream is
unreliable.

```
┌─────────────────────────────────────────────────────────┐
│  LAYER 1: SPEC — "What SHOULD be"                       │
│  Actor: Human + LLM                                     │
│  Output: Declarative, measurable criteria               │
│  Contract: Every criterion passes the Measurability     │
│            Gate (Playwright CAN measure it)              │
├─────────────────────────────────────────────────────────┤
│  LAYER 2: MEASUREMENT — "What IS"                       │
│  Actor: LLM + Playwright                                │
│  Output: Deterministic facts (computed styles, DOM,     │
│          dimensions, a11y tree)                         │
│  Contract: Same page + same viewport = same facts       │
│            (reproducibility)                             │
├─────────────────────────────────────────────────────────┤
│  LAYER 3: JUDGMENT — "The gap, and how to close it"    │
│  Actor: LLM                                             │
│  Output: Scored report + diagnosis + fixes              │
│  Contract: Every score derivable from measurements +    │
│            spec (accountability)                         │
└─────────────────────────────────────────────────────────┘

         ITERATION: fix → rebuild → re-measure → re-judge
         Until score stops improving or 10/10 reached
```

Layer 2 combines what was previously separate "Translation" and
"Measurement" — in practice the LLM writes queries and runs them in one
pass, not two. Layer 3 combines "Interpretation" and "Repair" — scoring,
diagnosing, and fixing are one cognitive act.

#### The Cascade Principle

If Layer N breaks its contract, Layer N+1 produces unreliable output:

- A vague spec (Layer 1) → Measurement produces irrelevant facts →
  Judgment scores the wrong things → Fixes target the wrong problems.

- A stale cache (Layer 2) → Measurement produces facts about the old
  page → Judgment scores against outdated reality → Fixes "solve" things
  that were already fixed.

**Debugging rule**: If scores look wrong, check from the bottom up.
Is the page fresh? (Layer 2.) Are we measuring the right things? (Layer 1.)
Are the criteria precise enough? (Layer 1.)

---

### 2. The Measurability Gate

Every criterion in a spec must pass this gate before it is accepted:

```
Can Playwright measure this?
  → YES: It belongs in the spec.
  → NO:  Either rephrase it until it can be measured, or exclude it.
```

The gate is non-negotiable. A criterion that can't be measured can't be
scored, can't be fixed, and can't be verified. It is dead weight.

#### Gate Examples

| Raw Criterion | Passes? | Rephrased Criterion | Passes? |
|---------------|---------|---------------------|---------|
| "Feels premium" | NO | "h1/h2 use `--font-display`, letter-spacing `tight`, colors from tokens" | YES |
| "Animation is smooth" | NO | "Animation duration ≤ 700ms for reveals, only transform+opacity animated" | YES |
| "Layout is balanced" | NO | "Two-column grid with ratio 1.1:0.9 at stack: breakpoint" | YES |
| "Shadow is navy-tinted" | YES | — | — |
| "Tap targets are accessible" | NO | "All interactive elements ≥ 44×44px" | YES |
| "Copy is clear" | NO | "FAQ preview text ≤ 1 line via `line-clamp-1`" | YES |

#### Precision Levels

| Level | When to Use | Reliability | Example |
|-------|-------------|-------------|---------|
| **Exact** | Brand-critical, compliance-sensitive | ~100% | "4-layer shadow: 2px rgba(13,42,94,0.08), 8px rgba(13,42,94,0.06)..." |
| **Range** | Layout, spacing, timing (default) | ~95% | "Animation duration 300–700ms, tap targets ≥ 44px" |
| **Fuzzy** | Structural relationships only | ~80% | "Section order: Hero → Simulate → Security → Requirements → ..." |

Start at Range. Move to Exact when wrong = costly. Move to Fuzzy only
for structural criteria where the relationship matters more than the values.

Fuzzy criteria are marked with ⚠️ in audit reports. Their ~80% reliability
means roughly 1 in 5 may be scored incorrectly. If a fuzzy criterion is
contested, make it more precise or verify manually.

---

### 3. The Iteration Loop

```
WRITE spec → MEASURE the page → JUDGE the gap
     ↑                                    |
     |                         IF gap > 0:
     |                         DIAGNOSE root cause
     |                         FIX code
     |                         FRESH BUILD
     └──────── RE-MEASURE ────────────────┘
```

#### When It Works

The loop converges when: the spec is finite, measurement is deterministic,
and each fix targets a specific failing criterion without regressing others.

#### When It Doesn't

| Signal | Likely Cause | Action |
|--------|-------------|--------|
| Score unchanged after fix | Stale cache | `rm -rf .next && rebuild` |
| Score unchanged, different failures | Fix caused regression | Revert, re-diagnose |
| Score stuck at 9 | LLM misdiagnosed root cause | Re-examine the specific criterion |
| Score oscillating | Fix conflicts with another criterion | Fix both simultaneously |
| Score never reaches 10 | Spec describes impossible state | Revise spec |

**Escalation rule**: If the same criterion fails after 3 fix attempts,
stop and ask a human. The LLM is in a local optimum.

---

## Part II: The Judgment

### 4. The LLM-as-Judge Protocol

The LLM connects spec to measurement. It does not decide what is "good."
It measures whether the spec was met. Its judgment is only as reliable as
the spec's precision.

#### The Critical Constraint

```
The LLM never decides what's GOOD.
The LLM measures whether the SPEC was met.
```

Corollary:

```
Vague spec → LLM hallucinates criteria → unreliable score
Precise spec → Playwright verifies → reliable score
```

Precision is the antidote to hallucination. If you're unsure whether the
LLM can score a criterion reliably, make the spec more precise.

#### The LLM's Roles

In practice the LLM performs these roles in one pass, not as discrete steps:

| Role | What It Does | How It Fails |
|------|-------------|-------------|
| **Translate + Measure** | Convert criteria → Playwright queries → run them | Measures the wrong thing (wrong selector, wrong property) |
| **Interpret + Score** | Compare measurements to spec, award points | Misinterprets a measurement or awards points without evidence |
| **Diagnose + Fix** | Find root cause, write code change | Misdiagnoses (fixes wrong file) or fix causes regression |
| **Detect convergence** | Decide whether to continue iterating | Stops too early, or loops forever on a stuck criterion |

Each failure mode has the same antidote: more precise specs, more
transparent reports, more deterministic measurement.

---

### 5. The Scoring System

Scoring is **gap measurement**, not quality judgment.

- 10/10 = rendered output matches the spec perfectly
- 5/10 = rendered output matches in half the measurable ways
- 0/10 = rendered output does not match the spec at all

The score is NOT "how good is this UI?" It is "how closely does reality
match the contract?" This makes scores reproducible, actionable, and
resistant to scope creep.

The formal scoring rules are in SKILL.md §0.1 (R3: Scoring Formula,
R4: Partial Credit, R6: Evidence Requirement). This section provides
the rationale; those rules provide the computation.

**Floor rule rationale**: If any universal category scores below 5/10,
the overall score cannot exceed 7/10. Universal quality is
non-negotiable — you can't compensate for broken accessibility with a
beautiful phone hero. The 5/10 threshold and 7/10 cap are heuristics,
not derived from theory. They may need adjustment based on experience.

---

### 6. The Audit Report

The audit report is the LLM's structured output. It has a formal schema.
Every score must be derivable from the report's contents (R6: Evidence
Requirement). No measurement row = no point awarded.

#### 6.1 Report Schema

```typescript
interface AuditReport {
  meta: {
    surface: "landing" | "dashboard" | "ephemeral" | "shared";
    viewport: { width: number; height: number };
    context: "normal" | "reduced-motion" | "keyboard";
    build: string;       // commit short hash
    freshBuild: boolean;
    date: string;        // ISO 8601
  };
  categories: CategoryReport[];
  scores: {
    baseline: number;    // 0-10
    surface: number;     // 0-10, null if no surface categories
    overall: number;     // 0-10
    floorActive: boolean;
  };
  reliability: {
    exact: number;       // count of exact criteria
    range: number;       // count of range criteria
    fuzzy: number;       // count of fuzzy criteria
  };
  diagnosis: DiagnosisEntry[];
  fixPlan: FixEntry[];
  iterations: IterationRecord[];
}

interface CategoryReport {
  name: string;
  score: number;        // 0-10
  criteria: CriterionResult[];
}

interface CriterionResult {
  id: number;
  description: string;
  precision: "exact" | "range" | "fuzzy";
  expected: string;     // spec value
  measured: string;     // Playwright result
  pass: boolean;
  pointsAwarded: number;
  pointsPossible: number;
  note?: string;        // for fuzzy⚠️ or partial credit explanation
}

interface DiagnosisEntry {
  category: string;
  criterionId: number;
  description: string;
  rootCause: string;    // file:line or "needs re-diagnosis"
}

interface FixEntry {
  description: string;
  target: string;       // file:line
}

interface IterationRecord {
  iteration: number;
  baseline: number;
  surface: number;
  overall: number;
  fixesApplied: number;
}
```

#### 6.2 Validation Rules

These rules are enforced on every report. A report that violates them is
invalid — the LLM must revise it before proceeding.

| Rule | Check | Rationale |
|------|-------|-----------|
| V1 | `sum(pointsAwarded) == category.score * (totalPoints / 10)` | Score must equal sum of criterion points |
| V2 | Every `measured` field is non-empty | R6: No measurement = no score |
| V3 | If `precision == "fuzzy"`, `note` must explain LLM interpretation | Fuzzy criteria require justification |
| V4 | If `pass == false` and `pointsAwarded > 0`, `note` must explain partial credit | Partial credit must be justified |
| V5 | `floorActive == true` iff any universal category score < 5 | Floor rule is automatic |
| V6 | If `floorActive`, `overall <= 7` | Floor rule is enforced |
| V7 | `meta.freshBuild == true` | R7: Fresh build required |

#### 6.3 Markdown Rendering

The JSON schema is the source of truth. When presenting to humans, render
as markdown:

```markdown
## UX Audit Report

### Surface: {meta.surface} | Viewport: {meta.viewport}×{meta.viewport}
### Context: {meta.context} | Build: {meta.build} | Fresh: {meta.freshBuild}
### Date: {meta.date}

---

#### Category: {name} ({score}/10)

| # | Criterion | Precision | Expected | Measured | Pass | Pts |
|---|-----------|-----------|----------|----------|------|-----|
| {id} | {description} | {precision} | {expected} | {measured} | {pass} | {pointsAwarded}/{pointsPossible} |

⚠️ = fuzzy criterion. Reliability ~80%. Verify if contested.

---

### BASELINE: {baseline}/10 | SURFACE: {surface}/10 | OVERALL: {overall}/10
### Floor active: {floorActive}
### Reliability: {exact} exact, {range} range, {fuzzy} fuzzy⚠️

#### Diagnosis
- {category} #{criterionId}: {description}
  → Root cause: {rootCause}

#### Fix Plan
1. {description} → {target}

#### Iteration History
| Iteration | Baseline | Surface | Overall | Fixes |
|-----------|----------|---------|---------|-------|
| {iteration} | {baseline} | {surface} | {overall} | {fixesApplied} |
```

---

### 7. LLM-as-Judge Anti-Patterns

These came from real bugs. Each is a way the LLM produces unreliable
scores. The antidote is always the same: precise specs, transparent
reports, deterministic measurement.

| Anti-Pattern | Example | Antidote |
|---|---|---|
| **Hallucinating criteria** | "The CTA should be orange" (not in spec) | Only score explicit spec criteria |
| **Aesthetic scoring** | "This shadow looks too dark" | Score against spec, not taste |
| **Cached measurements** | Scoring old version after hot reload | Always fresh build + full page load |
| **Partial observation** | "Looks good!" (only checked desktop) | Mandatory viewport + context matrix |
| **Confirmation bias** | "Seems fine" without measuring | Score must be derivable from measurements |
| **Overfitting to code** | "It uses the right class, so 10/10" | Measure rendered output, not source |
| **Scope creep** | "I noticed the footer could use..." | Only score criteria in the spec before audit |
| **Anchoring** | "It was 8 last time, probably still 8" | Re-measure from scratch each iteration |

---

## Part III: The Extension Protocol

### 8. Surface-Specific Specifications

The 7 universal categories define baseline quality. Surface-specific specs
extend them with 1-3 additional categories that capture what the universal
categories miss.

```
BASELINE = average(7 universal categories)
SURFACE  = average(1-3 surface-specific categories)
OVERALL  = average(BASELINE, SURFACE) with floor rule
```

#### Spec File Structure

Each surface type has a spec file in `specs/`:

```markdown
# [Surface Type] Specification

## Surface Categories

### Category 8: [Name] (10pts)

| Pts | Criterion | Precision | Verify With |
|-----|-----------|-----------|-------------|
| 2 | [criterion] | exact/range/fuzzy | [Playwright method] |
| ... | ... | ... | ... |

## Surface Context

- **Role**: What this surface does for the user
- **Entry points**: How users arrive at this surface
- **Exit points**: Where users go from this surface
- **Key interactions**: The critical user actions on this surface
- **Emotional state**: How the user feels (affects design priorities)

## Spec Customization

Any universal category threshold that differs for this surface.
For example, a dashboard might relax "Page JS ≤ 40kB" to "≤ 80kB".
```

The Surface Context tells the LLM **why** this surface exists and what
trade-offs are appropriate. Without it, the LLM might apply landing-page
priorities (emotional impact) to a dashboard (information density).

### 9. Category Design Principles

1. **Start from the user's goal** — measure how well the surface supports it.
2. **Find what universal categories miss** — that's your new category.
3. **Apply the Measurability Gate** — "good UX" is not a category.
   "Primary action completes in ≤ 3 clicks" is.
4. **Keep it to 1-3 categories** — more categories = more audit time.
5. **Name it precisely** — "Phone Hero Realism" > "Visual Quality".

---

## Part IV: Playwright as the Verification Boundary

Playwright is the **only reliable observer**. Its capabilities define what
the spec system can verify. The Measurability Gate exists because this
boundary is finite.

```
Playwright's capability boundary = The spec system's verification boundary
```

- **Inside the boundary**: Exact and Range criteria. Reliability 95-100%.
- **On the boundary**: Fuzzy criteria decomposable into measurable
  sub-criteria. Reliability ~80%.
- **Outside the boundary**: Anything Playwright cannot observe. These
  must not appear in specs, or must be marked ⚠️ with acknowledged
  lower reliability.

When Playwright can't directly measure a criterion (e.g., "section order
is X → Y → Z"), decompose it into measurable sub-criteria ("the third
`<section>` has `id='requirements'`"). If decomposition isn't possible,
mark it ⚠️ and acknowledge the gap.

Playwright's capability map and translation patterns are in SKILL.md §5.

---

## Part V: Application Drafts

> **Status**: DRAFT. These categories and workflows are proposals based on
> the Credalia landing page audit. They have NOT been validated against
> real implementations. Treat as starting points — refine based on what
> actual audits reveal.

---

### 10. Application: Ephemeral Views

Modals, toasts, confirmations, loading states, dropdowns, tooltips,
popovers. They appear, serve a purpose, disappear.

#### Why Ephemeral Views Need Their Own Spec

| Property | Why It Matters | Universal Gap |
|----------|---------------|---------------|
| **Lifespan** | Entering/exiting IS the experience | Motion measures animation, not entry/exit choreography |
| **Context dependency** | Backdrop, focus, z-index are critical | Layout measures placement, not overlay behavior |
| **Focus management** | Trap or redirect focus; escape mechanisms essential | Interaction measures tags, not focus flow |
| **State transitions** | loading → success → dismissed | No universal category measures state machine correctness |

#### Proposed Surface Categories

**Category 8: Overlay Behavior (10pts)**

| Pts | Criterion | Precision | Verify With |
|-----|-----------|-----------|-------------|
| 2 | Backdrop present and correctly styled | exact | `getComputedStyle` on backdrop element |
| 2 | Focus trap: Tab doesn't escape while open | range | Tab simulation → activeElement stays within |
| 2 | Escape key closes the overlay | range | `keyboard.press('Escape')` → overlay hidden |
| 1 | z-index higher than all non-overlay content | exact | `getComputedStyle().zIndex` comparison |
| 1 | Click outside closes (non-modal types) | range | Click backdrop → overlay hidden |
| 1 | Scroll lock while overlay is open | exact | `document.body.style.overflow` check |
| 1 | Return focus to trigger on close | range | `activeElement` after close = trigger |

**Category 9: State Transitions (10pts)**

| Pts | Criterion | Precision | Verify With |
|-----|-----------|-----------|-------------|
| 2 | Entry animation plays (opacity 0→1) | exact | `getComputedStyle` at T0 vs T1 |
| 2 | Exit animation plays before removal | exact | Element still in DOM during exit |
| 1 | Entry duration ≤ 300ms | range | `animationDuration` |
| 1 | Exit duration ≤ 200ms | range | `animationDuration` |
| 1 | Loading state visible during async | fuzzy | Spinner/skeleton during `waitForTimeout` |
| 1 | Success/error state after operation | fuzzy | Correct state element after mock action |
| 1 | Auto-dismiss for toasts (if applicable) | range | Element removed after timeout |
| 1 | Reduced-motion: entry/exit are instant | exact | `prefers-reduced-motion` → no animation |

#### Surface Context

```yaml
Role: Temporary interaction or notification
Entry points: User action (click, submit) or system event (error, success)
Exit points: User dismissal (close, escape, click outside) or auto-dismiss
Key interactions: Open, interact, dismiss
Emotional state: Context-dependent (anxiety for confirmations, relief for success)
```

---

### 11. Application: Dashboard Construction

Authenticated, data-rich surface where users manage loans, view payments,
upload documents, and track application status.

#### Why the Dashboard Needs Its Own Spec

| Property | Landing Page | Dashboard | New Category Needed |
|----------|-------------|-----------|---------------------|
| Information density | Low | High | Data Presentation |
| Navigation | Linear scroll | Multi-page | Wayfinding |
| Error states | None | Many | Error Resilience |

#### Proposed Surface Categories

**Category 8: Data Presentation (10pts)**

| Pts | Criterion | Precision | Verify With |
|-----|-----------|-----------|-------------|
| 2 | Key metrics prominently displayed | fuzzy | Primary data visible above fold |
| 2 | Numeric formatting correct (COP, dates, %) | exact | `fmtCOP()` output matches displayed text |
| 1 | Empty states have clear messaging + CTA | fuzzy | Empty-state element visible when data=[] |
| 1 | Loading skeletons during data fetch | exact | Skeleton visible during `waitForTimeout` |
| 1 | Data updates reactively | range | Value changes in-place after mock update |
| 1 | Tabular data sortable/filterable (if applicable) | range | Sort control exists and changes order |
| 1 | Large numbers use grouping | exact | `textContent` matches formatted output |
| 1 | Relative timestamps where appropriate | fuzzy | Relative time format in text content |

**Category 9: Navigation & Wayfinding (10pts)**

| Pts | Criterion | Precision | Verify With |
|-----|-----------|-----------|-------------|
| 2 | Current page visually indicated in nav | exact | Active nav item has distinct style |
| 2 | Breadcrumbs or page title present | fuzzy | Breadcrumb or `<h1>` visible |
| 1 | Navigation consistent across pages | range | Same nav structure on 3+ pages |
| 1 | Deep links work (URL → correct view) | range | Direct URL load shows correct content |
| 1 | Back button returns to previous state | range | `page.goBack()` → correct content |
| 1 | Unsaved changes warning | range | Dialog on navigate with dirty form |
| 1 | Keyboard-navigable sidebar/tabs | exact | Tab key reaches all nav items |
| 1 | Mobile: hamburger menu or bottom nav | fuzzy | Mobile nav toggle exists |

**Category 10: Error Resilience (10pts)**

| Pts | Criterion | Precision | Verify With |
|-----|-----------|-----------|-------------|
| 2 | API failure shows user-friendly message | fuzzy | Error message visible after mock failure |
| 2 | Retry mechanism for failed operations | range | Retry button present in error state |
| 1 | Partial failures don't break entire page | range | Failed widget shows error, rest renders |
| 1 | Network offline handled gracefully | fuzzy | Offline message or cached content visible |
| 1 | Form validation errors inline near fields | exact | Error adjacent to invalid input |
| 1 | Session expiry redirects to login | range | After token clear, redirect to auth |
| 1 | 404 page has navigation back | fuzzy | 404 page has link to dashboard |
| 1 | No uncaught exceptions during errors | exact | `page.on('console')` error count = 0 |

#### Surface Context

```yaml
Role: Manage loans, track payments, submit documents, view application status
Entry points: Post-login redirect, direct URL, notification link
Exit points: Logout, navigate to public pages
Key interactions: View data, submit forms, download documents, make payments
Emotional state: Task-oriented, sometimes anxious (payment due, application pending)
```

---

### 12. Application: New Product Integration

The three-layer model, the Critical Constraint, the Measurability Gate,
the scoring system, and the anti-patterns are product-agnostic. When
applying to a new product:

1. **Install the skill** — Copy `.opencode/skills/ux-score-audit/` into
   the new project.
2. **Replace platform constants** — Edit SKILL.md §2 (design tokens,
   breakpoints, typography, animation, a11y floor) for the new project.
3. **Write the first surface spec** — Create `specs/[surface].md` before
   any component code. Apply the Measurability Gate to every criterion.
4. **Build to spec** — Every component traces to a criterion.
5. **Audit and converge** — Fresh build → measure → judge → fix → repeat.
6. **Maintain as living documentation** — Spec evolves with the product.

**Integration checklist:**

- [ ] Skill directory copied
- [ ] Platform constants updated for new project
- [ ] `specs/` directory created
- [ ] First surface spec written (before code)
- [ ] Playwright installed
- [ ] First audit executed and scored
- [ ] Iteration loop run until 10/10
- [ ] Spec committed to version control

---

### 13. The Spec-Driven Development Lifecycle

```
1. DEFINE platform constants
2. WRITE surface spec (10/10 criteria before code)
3. IMPLEMENT (code traces to spec criteria)
4. AUDIT (measure → judge → diagnose → fix → re-measure)
5. CONVERGE (iterate until score stops improving)
6. SHIP (passing audit = quality gate)
7. MAINTAIN (spec evolves, re-audit on change)
```

---

### 14. Audit Scope: When to Use What

| Change Type | Scope | Protocol |
|-------------|-------|----------|
| **New surface** (new page, new view) | Full audit | All layers, all viewports, all contexts, all categories |
| **New component on existing surface** | Targeted | Affected categories only, desktop + 1 mobile viewport |
| **Style tweak** (color, spacing, font) | Spot check | Visual Fidelity + Layout only, 1 viewport |
| **Bug fix** (interaction, a11y) | Targeted | Affected category only, verify no regression in neighbors |
| **Refactor** (no visual change) | Regression check | All categories at 1 viewport, compare to prior score |
| **Copy change** (text only) | Skip | Not measurable unless copy format is in spec |

**Rule of thumb**: < 3 criteria touched → targeted audit. 3+ → full audit.
Unsure → full audit. The cost of a false positive (shipping a regression)
always exceeds the cost of over-auditing.

---

## Appendix A: Terminology

| Term | Definition |
|------|-----------|
| **Spec** | Declarative contract defining what 10/10 means for a surface |
| **Criterion** | A single measurable assertion within a spec |
| **Measurability Gate** | Every criterion must be Playwright-verifiable |
| **Precision Level** | How exact a criterion's expected value is (exact, range, fuzzy) |
| **Surface** | A distinct UI type (landing, dashboard, ephemeral, shared component) |
| **Category** | A quality dimension scored 0-10 (7 universal + N surface-specific) |
| **Baseline** | Average of the 7 universal categories |
| **Surface Score** | Average of the surface-specific categories |
| **Floor Rule** | Any universal category < 5/10 caps overall at 7/10 |
| **Audit Report** | Structured output showing criterion-level scores and evidence |
| **⚠️** | LLM-interpreted fuzzy criterion, ~80% reliability |

---

## Appendix B: Self-Audit — Dogfooding the Specification

This specification should be able to audit itself. If the spec can't pass
its own Measurability Gate, it's not precise enough to produce reliable
scores for UIs.

### Applying the Three Layers to This Document

| Layer | Question | Status |
|-------|----------|--------|
| 1. Spec | Does every section define a measurable principle? | **Partial** — §1–9 define measurable principles. §10–12 are untested drafts. |
| 2. Measurement | Can we measure whether this document meets its own standards? | **Partial** — We can count criteria passing the Gate, count fuzzy criteria, check formula consistency. |
| 3. Judgment | Can we score this document? | **Yes** — see below. |

### Self-Audit Scorecard

#### Visual Fidelity: 8/10
- Terminology consistent across both files ✅
- Cross-references bidirectional ✅
- Application drafts use Credalia-specific examples without marking them ⚠️

#### Layout & Composition: 7/10
- Clear ownership boundary between SKILL.md and SPECIFICATION.md ✅
- §8–9 overlaps with SKILL.md §4 ⚠️
- Part V could be split into `specs/` files ⚠️

#### Interaction & Behavior: 9/10
- Every section has an action implication ✅
- Audit report template directly usable ✅

#### Data Integrity: 8/10
- Scoring formula consistent between files ✅
- Floor rule handles edge cases ✅
- 80% fuzzy reliability is unvalidated ⚠️

#### Accessibility: 6/10
- No non-English accommodations ⚠️
- No machine-readable format (all prose + tables) ⚠️
- Assumes familiarity with Playwright, a11y standards ⚠️

#### Performance & Bundle: 7/10
- ~1100 lines total — reasonable context cost ✅
- Application drafts inflate; could be separate `specs/` files ⚠️

### Known Gaps

| Gap | Severity | Remediation |
|-----|----------|-------------|
| Fuzzy reliability unvalidated | Medium | Track audit results; measure fuzzy vs. exact agreement rate |
| Application drafts untested | Medium | Validate when those surfaces are built; revise from real audits |
| Floor rule thresholds unvalidated | Medium | Track whether 5/10 and 7/10 caps produce sensible outcomes |
| No machine-readable format | Low | Consider JSON Schema from spec tables |
| Assumes technical audience | Low | Add quick-start section if needed |

### How to Use This Self-Audit

1. **Before extending**: Does the new section maintain consistency? Does it
   pass the Measurability Gate?
2. **After a real audit**: Did the spec produce reliable scores? Feed
   observations back into the spec.
3. **When onboarding a new product**: Apply the self-audit to the new
   product's surface specs. A spec that can't audit itself can't reliably
   audit a UI.
