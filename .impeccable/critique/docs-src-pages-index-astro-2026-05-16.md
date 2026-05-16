# Impeccable Design Evaluation and Overhaul Plan

Target: `docs/src/pages/index.astro`
URL inspected locally: `http://127.0.0.1:4327/rinha2-back-end-go/`
Repo state: main synced to `97ecd2e`, work continued on branch `chore/impeccable-design-context`.

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---:|---:|---|
| 1 | Visibility of system status | 3 | CI and report links exist, but headline metrics are not tied to a specific run. |
| 2 | Match system / real world | 3 | Go benchmark identity is clear. Some generic neon-tech styling weakens precision. |
| 3 | User control and freedom | 3 | Main routes are obvious. Historical reports need stronger information scent. |
| 4 | Consistency and standards | 3 | Visual system is coherent. Go version is inconsistent between badge and metadata. |
| 5 | Error prevention | 2 | Build-time report directory read has no guard. Claims lack nearby evidence context. |
| 6 | Recognition rather than recall | 3 | Stack, docs, GitHub, and reports are visible. Report cards are repetitive. |
| 7 | Flexibility and efficiency | 3 | Developers can jump to docs/source quickly. No current-run shortcut. |
| 8 | Aesthetic and minimalist design | 2 | Strong base aesthetic, but gradient text, particles, glass nav, and emoji labels add template noise. |
| 9 | Error recovery | 2 | No meaningful page-level fallback for missing reports or failed generated content. |
| 10 | Help and documentation | 4 | Docs, GitHub, CI, and reports are present and easy to find. |
| **Total** |  | **28/40** | **Good foundation, needs credibility-first visual tightening.** |

## Anti-pattern verdict

### LLM assessment

This does not look like low-effort AI output, because the content is specific, the Go/Rinha context is real, and the archived stress reports create credibility. It does, however, carry several common AI-template tells: gradient text, ambient particles, glassy sticky nav, glowing cyan accents, emoji section labels, and repeated metric cards.

The aesthetic to preserve is clear: dark Go teal, cyan instrumentation, monospace benchmark-console energy. The overhaul should not replace that. It should make the same aesthetic more disciplined.

### Deterministic scan

`npx impeccable detect --json docs/src/pages/index.astro docs/src/components/home docs/src/layouts/BaseLayout.astro` found:

- `single-font`: only Fira Code is used across the page.

A delegated automated pass later returned no findings in its environment, so treat this as a weak automated signal but a valid design concern. Mono-forward is right for this project, but hierarchy needs more role separation.

### Source-backed issues

- Gradient text in `.hero h1` at `docs/src/styles/globals.css:228-237` violates the loaded design law.
- Go version mismatch: `Hero.astro` says Go 1.22; `index.astro`, `BaseLayout.astro`, and `CLAUDE.md` say Go 1.25.
- Landing animations have no `prefers-reduced-motion` accommodation in `globals.css`.
- Hover states exist without matching explicit `:focus-visible` rules for primary nav, CTAs, stress links, report links, and footer links.
- Repeated content is visually grouped but not semantically represented as lists: badges, architecture items, stress metrics, and reports.
- Historical report cards are repetitive and do not expose status, top metric, or run context.
- `Dashboard.astro` reads `public/reports` synchronously at build time with no guard.

## Overall impression

The page is already pointed in the right direction. The best redesign is not a new personality. It is the current personality with better discipline: less ambient gloss, more proof density, stronger report semantics, clearer metric provenance, and a tighter instrument-panel layout.

## What's working

1. **The core aesthetic fits.** Dark teal and Go cyan are correct for a Go backend benchmark site.
2. **The information flow is understandable.** Hero, stack, performance envelope, stress results, reports, footer is the right order.
3. **The reports are a real asset.** Archived stress-test runs are more persuasive than a decorative screenshot or generic metric row.

## Priority issues

### P0: Trust break from version mismatch

**What:** The hero badge says Go 1.22 while metadata and project docs say Go 1.25.

**Why it matters:** Benchmark audiences punish precision errors. If the language version is wrong, performance claims feel less reliable.

**Fix:** Normalize the version source. Ideally derive the badge from one constant or from `go.mod`/repo metadata.

**Suggested command:** `impeccable clarify`

### P1: Proof hierarchy is weaker than the claims

**What:** The page shows `47k+`, `<50ms`, and `99.9%`, but does not attach the values to workload, run date, commit, CI link, resource envelope, or a specific report.

**Why it matters:** The site says “trust these numbers” before it proves them.

**Fix:** Add a “latest validated run” strip or hero-adjacent proof rail with date, commit, workload, CPU/memory limits, report link, and CI run link.

**Suggested command:** `impeccable layout`

### P1: AI-template decorative effects dilute the lean Go story

**What:** Gradient headline text, particles, ambient radial drift, glass nav, emoji labels, and glow effects are doing more atmosphere than evidence.

**Why it matters:** The implementation sells restraint. The page should feel similarly tuned.

**Fix:** Replace gradient text with solid type plus single cyan emphasis, simplify the nav into an instrument rail, remove or dramatically reduce particles, and replace emoji section labels with benchmark-native labels.

**Suggested command:** `impeccable quieter`

### P1: Accessibility states are incomplete

**What:** Motion lacks reduced-motion handling, and hover affordances are richer than keyboard focus affordances.

**Why it matters:** This is a visible quality problem for keyboard and motion-sensitive users.

**Fix:** Add `prefers-reduced-motion`, explicit `:focus-visible` rings, and semantic lists for repeated groups.

**Suggested command:** `impeccable harden`

### P2: Historical reports are underused

**What:** Report cards show only date/time. They are visually repetitive and make users click before knowing which run matters.

**Why it matters:** The archive is the strongest credibility feature, but it reads like a date grid.

**Fix:** Surface latest, best, and recent reports with status, top metric, and quick labels. Keep “view all reports” as the archive route.

**Suggested command:** `impeccable layout`

## Overhaul direction, same aesthetic

**North Star:** Instrumented Restraint.

Keep:
- Dark teal base.
- Go cyan accent.
- Mono-forward voice.
- Developer-native headline wit.
- Performance and report focus.

Change:
- Make cyan functional, not atmospheric.
- Make the latest benchmark evidence the central artifact.
- Replace generic cards with proof modules.
- Reduce motion to intentional state feedback.
- Make the report archive a credibility system.

## Proposed page structure

1. **Instrument rail nav**
   - Left: `rinha2-go` plus a small status dot only if it means something.
   - Right: Docs, Reports, GitHub.
   - Explicit focus ring and no decorative glass blur.

2. **Hero with proof rail**
   - Solid headline: “Less is More. Except Error Handling.”
   - Shorter subcopy focused on challenge, Go stack, and constraints.
   - CTAs: `Read docs`, `Inspect code`, secondary `Latest report`.
   - Inline proof rail: latest run date, commit short SHA, workload, 1.5 CPU, 550MB, report link.

3. **Performance envelope as a constraint diagram**
   - Not just three number cards.
   - Show NGINX, two API instances, Postgres, CPU/memory split, request flow.
   - Keep it flat, technical, and compact.

4. **Benchmark evidence module**
   - Latest validated run first.
   - Best recent run second if different.
   - Show requests, P95, success rate, and link to report/CI.

5. **Report archive preview**
   - Three lanes: Latest, Best, Recent history.
   - Archive link remains available.
   - Date-only grid becomes secondary.

6. **Footer with ownership and challenge context**
   - Keep small, but include docs/source/report anchors if useful.

## A/B testing plan

### Test 1: Hero proof density

**Hypothesis:** Visitors will trust and continue when the hero ties performance claims to evidence immediately.

**A/control:** Current hero with headline, stack badges, and two CTAs.

**B variant:** Add a compact proof rail under the hero: latest report date, CI run, resource limits, and commit.

**C variant:** Make “Latest validated run” the right-side hero object, with metrics and report link, balancing the currently empty right side.

**Primary metric:** Click-through to reports or CI from the landing page.

**Recommendation:** Try C first. It uses the empty desktop hero space and improves trust without changing the aesthetic.

### Test 2: Metric presentation

**Hypothesis:** Constraint-aware metrics will outperform isolated big numbers for a technical audience.

**A/control:** Current metric cards: `47k+`, `1.5`, `550`, plus stress metric cards.

**B variant:** Merge constraints and results into a single “under 1.5 CPU / 550MB” benchmark strip.

**C variant:** Replace the repeated cards with a request-flow diagram plus metrics anchored at each node.

**Primary metric:** Scroll depth into reports section and clicks on documentation architecture page.

**Recommendation:** Try C for the overhaul concept. It keeps the technical identity and makes the page feel custom.

### Test 3: Visual restraint level

**Hypothesis:** Removing decorative AI-template effects will improve perceived credibility without making the page bland.

**A/control:** Current particles, ambient drift, glass nav, gradient text, emoji section labels.

**B variant:** Remove gradient text and emojis, keep subtle grid and limited ambient background.

**C variant:** Remove particles/glass entirely, use a static instrumentation grid and cyan only for values/focus/actions.

**Primary metric:** GitHub CTA clicks and docs CTA clicks from first viewport.

**Recommendation:** Try B first if risk-sensitive, C if the goal is the strongest “lean benchmark” posture.

### Test 4: Report archive information scent

**Hypothesis:** Report cards with summary data will get more engagement than date-only links.

**A/control:** Date/time grid.

**B variant:** Latest 3 reports with date, status, requests/sec, P95, and direct view links.

**C variant:** Three curated tiles: Latest, Best valid run, Full archive.

**Primary metric:** Report link clicks and archive clicks.

**Recommendation:** Try C first. It reduces cognitive load and turns the archive into a story.

### Test 5: CTA hierarchy

**Hypothesis:** A report CTA in the hero will convert better than putting reports only below stress results.

**A/control:** Docs primary, GitHub secondary.

**B variant:** Docs primary, Latest report secondary, GitHub tertiary text link.

**C variant:** Latest report primary, Docs secondary, GitHub tertiary.

**Primary metric:** CTA distribution, especially report and docs clicks.

**Recommendation:** Try B first. Docs remains the safe primary route while evidence becomes visible earlier.

## Implementation sequence

1. `impeccable clarify`: fix version mismatch and tighten performance copy.
2. `impeccable quieter`: remove gradient text, emoji scaffolding, decorative glass/particles, and excess glow.
3. `impeccable layout`: restructure hero proof rail, benchmark evidence, and report archive.
4. `impeccable harden`: add reduced motion, focus-visible states, semantic lists, and report-directory fallback.
5. `impeccable polish`: final responsive, copy, contrast, and interaction pass.

## Files added for context

- `PRODUCT.md`
- `DESIGN.md`
- `.impeccable/design.json`

These capture the inferred brand strategy and current visual system so future impeccable work stays aligned with this same aesthetic.
