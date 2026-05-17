# Docs

Astro static site for `rinha2-back-end-go`, deployed to GitHub Pages by `.github/workflows/deploy.yml` using the shared `jonathanperis/.github/.github/workflows/pages-docs-deploy.yml` workflow.

## Source layout

| Path | Purpose |
|---|---|
| `wiki/*.md` | Source Markdown for `/docs/` pages. |
| `src/pages/docs/[...slug].astro` | Route-based docs renderer and sidebar/search wiring. |
| `src/lib/sidebar.config.ts` | Ordered docs route list. Add new wiki pages here. |
| `src/pages/reports/index.astro` | Builds the stress-report archive from `public/reports/*.html`. |
| `public/reports/` | Committed k6 HTML reports copied into the final site. |
| `out/` | Generated Astro build output; do not edit by hand. |

## Commands

Run from this directory (`docs/`):

| Command | Action |
|---|---|
| `bun install` | Install dependencies. |
| `bun run dev` | Start the local Astro dev server. |
| `bun run lint` | Run ESLint. |
| `bun run build` | Build the site to `./out/`. |
| `bun run preview` | Preview the production build locally. |

For production-equivalent route bases, build with `NODE_ENV=production`; `astro.config.mjs` sets `base: '/rinha2-back-end-go'` only in production.

## Environment

Copy `.env.example` to `.env` and fill in local values when needed.

| Variable | Description |
|---|---|
| `PUBLIC_GA_ID` | Optional Google Analytics 4 Measurement ID consumed by `src/components/Analytics.astro`. |
