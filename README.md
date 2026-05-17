# rinha2-back-end-go

> Go 1.25.0 implementation for the Rinha de Backend 2024/Q1 challenge with chi/v5, pgx/v5, PostgreSQL stored procedures, and an NGINX `least_conn` fan-out.

[![Build Check](https://github.com/jonathanperis/rinha2-back-end-go/actions/workflows/build-check.yml/badge.svg)](https://github.com/jonathanperis/rinha2-back-end-go/actions/workflows/build-check.yml) [![Main Release](https://github.com/jonathanperis/rinha2-back-end-go/actions/workflows/main-release.yml/badge.svg)](https://github.com/jonathanperis/rinha2-back-end-go/actions/workflows/main-release.yml) [![CodeQL](https://github.com/jonathanperis/rinha2-back-end-go/actions/workflows/codeql.yml/badge.svg)](https://github.com/jonathanperis/rinha2-back-end-go/actions/workflows/codeql.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**[Live demo →](https://jonathanperis.github.io/rinha2-back-end-go/)** | **[Documentation →](https://jonathanperis.github.io/rinha2-back-end-go/docs/)** | **[Stress reports →](https://jonathanperis.github.io/rinha2-back-end-go/reports/)**

---

## About

A Go implementation of the Brazilian backend challenge Rinha de Backend 2024/Q1, where a fictional bank API must handle concurrent transactions under strict resource constraints: **1.5 CPU** and **550MB RAM** across the two API containers, NGINX, and PostgreSQL. The current API is intentionally compact: `src/WebApi/main.go` contains the whole HTTP layer, input validation, and database calls, while balance mutation and statement assembly live in PostgreSQL functions.

This project is a benchmark/learning implementation, not a production banking service. The database settings intentionally trade durability for benchmark throughput.

## Source-backed implementation facts

| Area | Current value | Source |
|---|---|---|
| Go toolchain | `go 1.25.0` | `src/WebApi/go.mod` |
| Router | `github.com/go-chi/chi/v5 v5.2.5` | `src/WebApi/go.mod`, `main.go` |
| Database client | `github.com/jackc/pgx/v5 v5.9.2` with `pgxpool` | `src/WebApi/go.mod`, `main.go` |
| API process port | `:8080` | `src/WebApi/main.go`, `src/WebApi/Dockerfile` |
| Public stack port | `:9999` through NGINX | `nginx.conf`, `docker-compose.yml` |
| API replicas | `webapi1-go`, `webapi2-go` | `docker-compose.yml`, `prod/docker-compose.yml` |
| Database | PostgreSQL with `Clientes` and `Transacoes` UNLOGGED tables | `docker-entrypoint-initdb.d/rinha.dump.sql` |
| Stored procedures | `InsertTransacao`, `GetSaldoClienteById` | `docker-entrypoint-initdb.d/rinha.dump.sql` |
| Reports archive | 34 committed k6 HTML reports | `docs/public/reports/` |

## Runtime topology

```text
client / k6
  └─▶ nginx :9999 (`least_conn`)
        ├─▶ webapi1-go :8080
        └─▶ webapi2-go :8080
              └─▶ PostgreSQL :5432
                    ├─ InsertTransacao(id, valor, tipo, descricao)
                    └─ GetSaldoClienteById(id)
```

Challenge-counted resource limits in the compose files are:

| Service | CPU | Memory |
|---|---:|---:|
| `webapi1-go` | 0.4 | 100MB |
| `webapi2-go` | 0.4 | 100MB |
| `nginx` | 0.2 | 20MB |
| `db` | 0.5 | 330MB |
| **Total** | **1.5** | **550MB** |

Development-only observability services (`postgres-exporter`, Prometheus, Grafana, InfluxDB) and the `k6` runner are included in the root compose file but are outside the challenge budget.

## API contract

| Method | Path | Success | Validation / errors |
|---|---|---|---|
| `GET` | `/healthz` | `200`, body `Healthy` | Health check only. |
| `GET` | `/clientes/{id}/extrato` | `200`, JSON statement with `saldo` and `ultimas_transacoes` | Non-integer IDs return `400`; IDs outside 1–5 return `404`. |
| `POST` | `/clientes/{id}/transacoes` | `200`, JSON with `id`, `limite`, and updated `saldo` | Invalid JSON returns `400`; IDs outside 1–5 return `404`; invalid transaction fields return `422`. |

Transaction validation in `main.go` currently requires:

- `tipo` exactly `c` or `d`.
- `descricao` non-empty and at most 10 characters.
- `valor` greater than zero.
- Debits are accepted by the stored procedure only when the resulting balance is not below `-Limite`; credits are always allowed.

## Getting started

```bash
git clone https://github.com/jonathanperis/rinha2-back-end-go.git
cd rinha2-back-end-go
docker compose up nginx -d --build
curl -sS http://localhost:9999/healthz
curl -sS http://localhost:9999/clientes/1/extrato
```

Run the local k6 service after the API is healthy:

```bash
docker compose up k6 --build --force-recreate
```

> This workspace has Docker CLI installed but no reachable Docker daemon, so full compose verification must run in CI or on a host with Docker daemon access.

## Project structure

```text
rinha2-back-end-go/
├── src/WebApi/
│   ├── main.go          # HTTP handlers, validation, pgxpool calls
│   ├── go.mod / go.sum  # Go 1.25.0, chi/v5, pgx/v5
│   └── Dockerfile       # golang:1.25-alpine3.21 builder → alpine:3.23 runtime
├── docker-entrypoint-initdb.d/
│   └── rinha.dump.sql   # Dev schema, seed clients, stored procedures
├── docker-compose.yml   # Dev stack: API x2, NGINX, PostgreSQL, k6, observability
├── prod/
│   ├── docker-compose.yml
│   └── conf/            # Prod compose inputs used by CI release/load-test jobs
├── nginx.conf           # Dev NGINX config using least_conn
├── docs/                # Astro Pages site, wiki markdown, report archive
└── .github/workflows/   # Build, release, CodeQL, Pages deploy
```

## CI/CD

| Workflow | Trigger | What it does |
|---|---|---|
| `build-check.yml` | Pull requests and manual dispatch | Filters runtime-relevant changes, builds the Go app, and runs a Docker Compose health check for `/healthz`. |
| `main-release.yml` | Push to `main` and manual dispatch | Builds amd64/arm64 GHCR images, creates the `latest` manifest, runs the prod compose health check, and uploads a k6 report artifact. |
| `codeql.yml` | Push, pull request, weekly schedule | Runs Go CodeQL with manual build mode when Go/source workflow paths change. |
| `deploy.yml` | Push to `main` and manual dispatch | Calls the shared Pages docs workflow with Bun to build/deploy the Astro site. |

Published image tags:

- `ghcr.io/jonathanperis/rinha2-back-end-go:latest` — multi-arch manifest.
- `ghcr.io/jonathanperis/rinha2-back-end-go:latest-arm64` — arm64 image tag used before manifest merge.

## Documentation

The public docs are generated from `docs/wiki/*.md` via `docs/src/pages/docs/[...slug].astro`. The route set is defined in `docs/src/lib/sidebar.config.ts`, and the stress report index reads committed HTML reports from `docs/public/reports/`.

## License

MIT — see [LICENSE](LICENSE)
