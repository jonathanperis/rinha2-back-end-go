---
title: Home
---

# Documentation

Operator notes for the Go 1.25 Rinha de Backend 2024/Q1 implementation. The docs are split into short pages so each route has one job: understand the challenge, inspect the runtime shape, run the stack, read the performance evidence, or follow the CI pipeline.

<div class="docs-status-grid">
  <div class="status-tile"><span>Runtime</span><strong>Go 1.25</strong></div>
  <div class="status-tile"><span>Resource cap</span><strong>1.5 CPU</strong></div>
  <div class="status-tile"><span>Memory cap</span><strong>550MB</strong></div>
  <div class="status-tile"><span>API shape</span><strong>2 routes</strong></div>
</div>

## Start here

<div class="docs-card-grid">
  <div class="doc-card">
    <span>01 · challenge</span>
    <a href="challenge/">Read the contest contract</a>
    <p>Required endpoints, client model, resource limits, and the source specification.</p>
  </div>
  <div class="doc-card">
    <span>02 · architecture</span>
    <a href="architecture/">Inspect the runtime topology</a>
    <p>NGINX least-connection balancing, two Go API containers, PostgreSQL stored procedures, and observability services.</p>
  </div>
  <div class="doc-card">
    <span>03 · getting started</span>
    <a href="getting-started/">Run the local stack</a>
    <p>Clone, compose, smoke-test transactions, and query statements through port 9999.</p>
  </div>
  <div class="doc-card">
    <span>04 · performance</span>
    <a href="performance/">Review benchmark evidence</a>
    <p>Resource envelope, published report links, and the meaning of the headline claims.</p>
  </div>
</div>

## Implementation snapshot

| Signal | Value | Source |
|--------|-------|--------|
| Language | Go 1.25 | `README.md`, site metadata |
| Router | chi/v5 | `go.mod`, API implementation |
| Database client | pgx/v5 with pgxpool | `go.mod`, API implementation |
| Database strategy | PostgreSQL stored procedures | `docker-entrypoint-initdb.d/` |
| Load balancer | NGINX `least_conn` | `nginx.conf` |
| Reports | Static k6 HTML archive | `docs/public/reports/` |

## Fast path

```bash
git clone https://github.com/jonathanperis/rinha2-back-end-go.git
cd rinha2-back-end-go
docker compose up nginx -d --build
curl http://localhost:9999/clientes/1/extrato
```

## Proof links

- [Latest stress reports](../reports/)
- [Source repository](https://github.com/jonathanperis/rinha2-back-end-go)
- [Rinha de Backend 2024/Q1 specification](https://github.com/zanfranceschi/rinha-de-backend-2024-q1)
