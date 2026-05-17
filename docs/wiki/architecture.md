# Architecture

## Runtime topology

The challenge path is deliberately small: two Go API instances sit behind NGINX, and both API containers share one PostgreSQL database. The root compose file also includes observability and k6 services for development, but those services are outside the official resource budget.

<div class="arch-diagram">
<pre>[client / k6] ──▶ [nginx :9999 · least_conn]
                       ├──▶ [webapi1-go :8080]
                       └──▶ [webapi2-go :8080]
                                  │
                                  ▼
                         [postgresql :5432]
                                  │
                                  ├──▶ InsertTransacao(...)
                                  └──▶ GetSaldoClienteById(...)</pre>
</div>

## Challenge-counted services

| Service | Role | CPU | RAM | Source |
|---------|------|-----|-----|--------|
| `webapi1-go` | Go 1.25.0 API instance using chi/v5 and pgx/v5 | 0.4 | 100MB | `docker-compose.yml`, `prod/docker-compose.yml` |
| `webapi2-go` | Second identical API instance | 0.4 | 100MB | `docker-compose.yml`, `prod/docker-compose.yml` |
| `nginx` | Reverse proxy and load balancer using `least_conn` | 0.2 | 20MB | `nginx.conf`, compose files |
| `db` | PostgreSQL with stored procedures | 0.5 | 330MB | compose files, SQL dump |

Total counted envelope: **1.5 CPU** and **550MB RAM**.

## Development and test services

| Service | Purpose | Counted in challenge budget? |
|---------|---------|------------------------------|
| `k6` | Runs the external stress-test suite (`MODE=dev` in root compose, `MODE=prod` in `prod/`) | No |
| `postgres-exporter` | Exposes PostgreSQL metrics | No |
| `prometheus` | Stores local metrics | No |
| `grafana` | Local dashboards | No |
| `influxdb` | Optional k6 time-series output in development mode | No |

## HTTP layer

`src/WebApi/main.go` creates a chi router and exposes three routes:

| Method | Route | Handler |
|---|---|---|
| `GET` | `/healthz` | `healthzHandler` returns `Healthy`. |
| `GET` | `/clientes/{id}/extrato` | `getExtratoHandler` validates the ID and calls `GetSaldoClienteById($1)`. |
| `POST` | `/clientes/{id}/transacoes` | `postTransacaoHandler` validates JSON and calls `InsertTransacao($1, $2, $3, $4)`. |

The HTTP server listens on `:8080`, uses a 5-second read timeout and a 10-second write timeout, and each database operation runs with a 5-second request-scoped context timeout.

## Database strategy

Business rules run in PostgreSQL stored procedures so balance updates and validation stay close to the data. The schema uses UNLOGGED `Clientes` and `Transacoes` tables and an index on `(ClienteId, Id DESC)` for recent statement retrieval.

Benchmark-oriented PostgreSQL flags configured in both compose files:

- `synchronous_commit=0`: do not wait for WAL flush on each commit.
- `fsync=0`: skip forced syncs during the benchmark run.
- `full_page_writes=0`: reduce write amplification.
- `checkpoint_timeout=600` and `max_wal_size=4096`: reduce checkpoint pressure during runs.

These settings are useful for understanding the contest trade-off; they are not general production-banking defaults.

## Build images

`src/WebApi/Dockerfile` currently builds with `golang:1.25-alpine3.21` and copies the binary into an `alpine:3.23` runtime image. CI publishes GHCR images from that Dockerfile.
