---
name: rinha2-back-end-go
description: Lean Go benchmark landing page for Rinha de Backend 2024/Q1.
colors:
  deep-teal-bg: "#0c1f1f"
  teal-surface: "#0f2e2e"
  go-cyan: "#00ADD8"
  go-cyan-light: "#5DC9E2"
  dark-cyan: "#0a3040"
  text-primary: "#e0f5f8"
  text-secondary: "#7dd3e8"
  text-muted: "#2e7a90"
typography:
  display:
    fontFamily: "Fira Code, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: "clamp(2.5rem, 7vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.1
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Fira Code, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: "0.8rem"
    fontWeight: 600
    letterSpacing: "0.05em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  section: "5rem"
components:
  button-primary:
    backgroundColor: "{colors.go-cyan}"
    textColor: "{colors.deep-teal-bg}"
    rounded: "{rounded.sm}"
    padding: "1rem 2rem"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.go-cyan}"
    rounded: "{rounded.sm}"
    padding: "1rem 2rem"
  metric-card:
    backgroundColor: "{colors.teal-surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
---

# Design System: rinha2-back-end-go

## 1. Overview

**Creative North Star: "Instrumented Restraint"**

The site should feel like a benchmark console that learned just enough art direction to be memorable. It is dark, teal, compact, and mechanical, but not theatrical. The current Go cyan identity is worth preserving because it ties the surface to the implementation language and makes the project instantly recognizable.

This is a brand surface for a technical project, so the design itself must communicate competence. The page should look fast because it is measured, not because it glows. The best version keeps the terminal-performance mood while removing decorative excess, tightening proof hierarchy, and turning archived reports into a credibility asset.

**Key Characteristics:**
- Dark teal base with Go cyan as a precise instrumentation color.
- Mono-forward typography, used with stronger hierarchy and better body readability.
- Tonal layering and thin borders instead of heavy shadows or glass effects.
- Metrics tied to evidence, dates, resource constraints, and report links.
- Minimal motion, only when it clarifies state or directs attention.

## 2. Colors

The palette is Go cyan on deep engineered teal. It should stay narrow, but the accent must behave like an instrument reading, not a decorative glow.

### Primary
- **Go Instrument Cyan**: The primary action and data-accent color. Use for primary buttons, important metric values, focus rings, and active states.
- **Light Cyan Signal**: Secondary accent for hover states, badge text, and supporting highlights.

### Neutral
- **Deep Teal Console**: The page background. Never use pure black as the base.
- **Teal Steel Surface**: Section panels, metric containers, and report tiles.
- **Dark Cyan Structural**: Subtle separators, underlays, and low-emphasis borders.
- **Mist Text**: Primary readable text on dark surfaces.
- **Muted Cyan Text**: Secondary text, captions, and labels.

### Named Rules

**The Instrument Rule.** Cyan is an instrument reading. It marks actions, values, focus, and status. It does not decorate empty space.

**The No Pure Extremes Rule.** Do not use pure `#000` or `#fff`. Keep darks and lights tinted toward the project teal.

## 3. Typography

**Display Font:** Fira Code with system monospace fallbacks
**Body Font:** Inter with system sans-serif fallbacks
**Label/Mono Font:** Fira Code with system monospace fallbacks

**Character:** The current mono-forward voice fits the project, but long-form readability improves when body copy uses a quiet sans while headings, labels, metrics, and controls retain the instrument-console mono voice.

### Hierarchy
- **Display** (700, `clamp(2.5rem, 7vw, 3.5rem)`, 1.1): Hero headline and one dominant idea per fold.
- **Headline** (700, `clamp(1.75rem, 4vw, 2.5rem)`, 1.2): Major sections such as performance envelope and stress results.
- **Title** (600, `1.25rem`, 1.3): Report groups and component-level headings.
- **Body** (400, `1rem`, 1.6): Explanatory copy. Keep paragraphs under 65 to 75 characters.
- **Label** (600, `0.75rem` to `0.875rem`, tracked): Badges, metric labels, nav items, and report metadata.

### Named Rules

**The Mono With Purpose Rule.** Monospace is allowed because this is a developer benchmark site. It still needs typographic contrast through size, weight, color, and line length.

## 4. Elevation

The system should be mostly flat. Depth comes from tonal surfaces, thin borders, grid texture, and state changes. Shadows and glows are allowed only as state feedback or data emphasis, not as a permanent atmospheric layer.

### Shadow Vocabulary
- **Signal Glow** (`0 0 16px rgba(0, 173, 216, 0.18)`): Use only on active focus, hover, or a single signature metric.
- **Panel Lift** (`0 12px 32px rgba(0, 0, 0, 0.20)`): Use sparingly for elevated report previews or hover states.

### Named Rules

**The Flat Until Touched Rule.** Surfaces rest flat. They lift only when a user interacts or when a metric needs explicit priority.

## 5. Components

### Buttons
- **Shape:** Sharp technical corners with slight rounding (4px).
- **Primary:** Go cyan fill with deep teal text, uppercase mono label, generous horizontal padding.
- **Hover / Focus:** Shift tone and add a visible cyan focus ring. Keyboard focus must be as obvious as hover.
- **Secondary / Ghost:** Transparent surface, cyan border, cyan text. Use for GitHub or secondary documentation routes.

### Chips
- **Style:** Compact teal surface, cyan text, subtle cyan border.
- **State:** Static tech badges should not look clickable. If a chip becomes interactive, add focus and hover states.

### Cards / Containers
- **Corner Style:** Moderate rounding (12px) for major panels, smaller rounding for report links.
- **Background:** Teal steel surfaces on deep teal console background.
- **Shadow Strategy:** Flat at rest. Use borders and tonal contrast first.
- **Border:** Thin cyan-tinted borders. No thick side stripes.
- **Internal Padding:** 1.5rem to 2rem for cards; larger rhythm only around major sections.

### Inputs / Fields
- **Style:** Dark teal fill, cyan border on focus, mono text.
- **Focus:** Visible outline or ring. Never remove outlines without replacing them.
- **Error / Disabled:** Use text and icon/status affordances, not color alone.

### Navigation
- Sticky top navigation may stay, but it should feel like a slim instrument rail, not a glass panel. Use a tinted opaque or near-opaque background, thin border, clear focus states, and short labels.

### Reports
- Historical report links are proof artifacts, not decorative tiles. Each report item should expose date, time, and ideally a small status or metric summary when available.

## 6. Do's and Don'ts

### Do:
- **Do** keep the Go teal/cyan identity, but use cyan only for action, proof, focus, and state.
- **Do** tie every major performance claim to a report, CI run, or explicit workload context.
- **Do** use semantic lists for badges, metrics, architecture items, and historical reports.
- **Do** include `prefers-reduced-motion` handling for ambient and entrance animations.
- **Do** preserve the developer-native wit when it is specific and concise.

### Don't:
- **Don't** use gradient text. It is prohibited on this project.
- **Don't** use decorative glassmorphism, floating particles, or glows as default atmosphere.
- **Don't** repeat generic metric cards without adding context or proof.
- **Don't** use emoji as section-label scaffolding.
- **Don't** present vague performance claims without benchmark context.
- **Don't** use thick side-stripe borders as accents.
- **Don't** let terminal styling become cosplay. The code and benchmark evidence are the identity.
