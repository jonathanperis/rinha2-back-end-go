---
title: Home
---

# Documentation

Operator notes for the Go 1.25.0 Rinha de Backend 2024/Q1 implementation. These pages are source-backed against the current repository: the Go API lives in `src/WebApi/main.go`, compose topology in `docker-compose.yml` and `prod/docker-compose.yml`, database functions in `docker-entrypoint-initdb.d/rinha.dump.sql`, and the docs routes in `docs/src/lib/sidebar.config.ts`.

<div class="docs-status-grid">
  <div class="status-tile"><span>Runtime</span><strong>Go 1.25.0</strong></div>
  <div class="status-tile"><span>Resource cap</span><strong>1.5 CPU</strong></div>
  <div class="status-tile"><span>Memory cap</span><strong>550MB</strong></div>
  <div class="status-tile"><span>Implemented endpoints</span><strong>3 routes</strong></div>
</div>

## Start here

<div class="docs-card-grid">
  <div class="doc-card">
    <span>01 · challenge</span>
    <a href="challenge/">Read the contest contract</a>
    <p>Required banking endpoints, client model, validation rules, and resource limits.</p>
  </div>
  <div class="doc-card">
    <span>02 · architecture</span>
    <a href="architecture/">Inspect the runtime topology</a>
    <p>NGINX least-connection balancing, two Go API containers, PostgreSQL stored procedures, and dev-only observability services.</p>
  </div>
  <div class="doc-card">
    <span>03 · getting started</span>
    <a href="getting-started/">Run the local stack</a>
    <p>Clone, compose, health-check, smoke-test transactions, and query statements through port 9999.</p>
  </div>
  <div class="doc-card">
    <span>04 · performance</span>
    <a href="performance/">Review benchmark evidence</a>
    <p>Resource envelope, report archive, and the limits of historical benchmark claims.</p>
  </div>
</div>

## Implementation snapshot

| Signal | Value | Source |
|--------|-------|--------|
| Language | Go 1.25.0 | `src/WebApi/go.mod` |
| Router | chi/v5.2.5 | `go.mod`, `main.go` |
| Database client | pgx/v5.9.2 with `pgxpool` | `go.mod`, `main.go` |
| Database strategy | PostgreSQL stored procedures over UNLOGGED tables | `docker-entrypoint-initdb.d/rinha.dump.sql` |
| Load balancer | NGINX `least_conn` on port 9999 | `nginx.conf` |
| API endpoints | `/healthz`, `/clientes/{id}/transacoes`, `/clientes/{id}/extrato` | `src/WebApi/main.go` |
| Reports | 34 committed k6 HTML reports | `docs/public/reports/` |

## Fast path

```bash
git clone https://github.com/jonathanperis/rinha2-back-end-go.git
cd rinha2-back-end-go
docker compose up nginx -d --build
curl http://localhost:9999/healthz
curl http://localhost:9999/clientes/1/extrato
```

## Proof links

- [Latest stress reports](../reports/)
- [Source repository](https://github.com/jonathanperis/rinha2-back-end-go)
- [Rinha de Backend 2024/Q1 specification](https://github.com/zanfranceschi/rinha-de-backend-2024-q1)
