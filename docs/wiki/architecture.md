# Architecture

## Runtime topology

The runtime shape is deliberately small: two Go API instances sit behind NGINX, and both API containers share a single PostgreSQL database. Observability and k6 are present for local development and stress testing, but they are outside the challenge resource budget.

<div class="arch-diagram">
<pre>[k6 runner] ──▶ [nginx :9999 · least_conn]
                       ├──▶ [webapi1-go :8080]
                       └──▶ [webapi2-go :8080]
                                  │
                                  ▼
                         [postgresql :5432]
                                  │
                                  └──▶ stored procedures</pre>
</div>

## Challenge-counted services

| Service | Role | CPU | RAM |
|---------|------|-----|-----|
| `webapi1-go` | Go 1.25 API instance using chi/v5 and pgx/v5 | 0.4 | 100MB |
| `webapi2-go` | Second identical API instance | 0.4 | 100MB |
| `nginx` | Reverse proxy and load balancer using `least_conn` | 0.2 | 20MB |
| `db` | PostgreSQL 16 with stored procedures | 0.5 | 330MB |

Total counted envelope: **1.5 CPU** and **550MB RAM**.

## Development and test services

| Service | Purpose | Counted in challenge budget? |
|---------|---------|------------------------------|
| `k6` | Runs the external stress-test suite | No |
| `postgres-exporter` | Exposes PostgreSQL metrics | No |
| `prometheus` | Stores local metrics | No |
| `grafana` | Local dashboards | No |
| `influxdb` | Optional k6 time-series output in development mode | No |

## Load balancing

NGINX uses `least_conn` to distribute requests across the two API instances. That keeps pressure away from a busy worker when concurrent transaction bursts hit the same endpoint family.

## Database strategy

Business rules run in PostgreSQL stored procedures so balance updates and validation stay close to the data. The database is tuned for write-heavy benchmark behavior:

- `synchronous_commit=0`: do not wait for WAL flush on each commit.
- `fsync=0`: skip forced syncs during the benchmark run.
- `full_page_writes=0`: reduce write amplification.

These settings are benchmark-oriented. They are useful for understanding the contest trade-off, not a general production banking recommendation.

## Implementation notes

- The API implementation is intentionally compact, roughly 221 lines for the Go API source.
- `chi/v5` provides the HTTP router.
- `pgx/v5` and `pgxpool` handle PostgreSQL access and pooling.
- The Dockerfile uses a multi-stage build for a smaller runtime image.
