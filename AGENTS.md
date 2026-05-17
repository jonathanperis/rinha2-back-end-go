# Rinha de Backend 2024/Q1 — Go Implementation

High-performance banking API built with Go/chi for the Rinha de Backend challenge. Handles concurrent transactions under strict resource constraints (1.5 CPU, 550MB RAM).

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| Go 1.25.0 | Language |
| chi/v5 | Lightweight HTTP router |
| pgx/v5 | PostgreSQL driver with connection pooling |
| PostgreSQL | Database with stored procedures |
| NGINX | Load balancer (least_conn) |
| Docker | Multi-stage builds (golang:1.25-alpine3.21 → alpine:3.23) |
| k6 | Load testing (shared suite) |

---

## Build Commands

```sh
cd src/WebApi
go build -ldflags="-s -w" -o rinha2-back-end-go .   # Release build (~15-20MB)
docker compose up nginx -d --build                     # Full dev stack
docker compose up k6 --build --force-recreate         # Run stress tests
```

---

## Architecture

```
NGINX (:9999, least_conn)
├── webapi1-go (:8080, 0.4 CPU, 100MB)
├── webapi2-go (:8080, 0.4 CPU, 100MB)
└── PostgreSQL (0.5 CPU, 330MB)
    ├── InsertTransacao() — atomic balance + validation
    └── GetSaldoClienteById() — statement with JSONB
```

**Single-file API** (221 lines in `src/WebApi/main.go`). Business logic in PostgreSQL stored procedures.

---

## Key Patterns

- **Minimal single-file architecture** — all code in main.go
- **chi router** — lightweight, idiomatic Go HTTP routing
- **pgx connection pool** — managed pooling, no manual sizing
- **Context-based timeouts** — 5-second deadline on all DB calls
- **Hardcoded client map** — `map[int]int` for 5 predefined clients
- **UNLOGGED tables** for write performance
- **Stored procedures** handle all transaction logic atomically

---

## API Endpoints

| Method | Path | Status Codes |
|--------|------|-------------|
| POST | `/clientes/{id}/transacoes` | 200, 404, 422 |
| GET | `/clientes/{id}/extrato` | 200, 404 |
| GET | `/healthz` | 200 |

---

## Project Structure

```
rinha2-back-end-go/
├── src/WebApi/
│   ├── main.go          # Complete API (221 lines)
│   ├── go.mod / go.sum  # Dependencies (chi/v5, pgx/v5)
│   └── Dockerfile        # Multi-stage: golang:1.25-alpine3.21 → alpine:3.23
├── docker-entrypoint-initdb.d/
│   └── rinha.dump.sql    # Schema + stored procedures + seed data
├── docker-compose.yml    # Dev stack with observability
├── prod/docker-compose.yml  # Prod stack with GHCR images
├── nginx.conf            # Load balancer config
└── .github/workflows/    # CI/CD
```

---

## CI/CD

- **PR:** Path-filtered Go build, Docker health check, and CodeQL for relevant source changes
- **Main:** Build + multi-platform Docker push (amd64/arm64) to GHCR, k6 load test, CodeQL, and GitHub Pages deploy
- **Docs:** `deploy.yml` builds the Astro documentation site with Bun
- **Image:** `ghcr.io/jonathanperis/rinha2-back-end-go:latest`

---

## Environment Variables

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `postgres://postgres:postgres@db:5432/rinha?sslmode=disable` |

---

## Contribution Workflow

- **All changes** must go through a branch + PR strategy (never commit directly to main)
- **Always sync main before branching** — run `git fetch origin main && git checkout main && git pull --rebase origin main` before creating a new branch
- **Always sync main before opening PRs** — fetch and pull main again before `gh pr create` to avoid conflicts
- **PRs are rebase only** — no merge commits
- **Repo-wide files** (SECURITY.md, CODE_OF_CONDUCT.md, CONTRIBUTING.md, FUNDING.yml, etc.) live in the `.github` repo — do not recreate them in this repository
- **Use `gh` CLI** for all GitHub operations (repos, PRs, checks, merges, releases)

---

## Standardized Agent Instrumentation

This repository uses the standardized `AGENTS.md` and `.agents/` locations for harness-readable project instructions and memory. Keep future agent guidance in the standardized AGENTS paths only.
