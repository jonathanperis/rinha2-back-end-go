# Architecture

## Overview

The system follows a shared architecture across all Rinha de Backend implementations: two API instances behind an Nginx reverse proxy, with a single PostgreSQL database and an observability stack.

## Services

| Service | Role | CPU | RAM |
|---------|------|-----|-----|
| webapi1 | Go 1.25 API instance (chi/v5 + pgx/v5) | 0.4 | 100MB |
| webapi2 | Go 1.25 API instance (chi/v5 + pgx/v5) | 0.4 | 100MB |
| nginx | Reverse proxy / load balancer (least-conn) | 0.2 | 20MB |
| postgresql | Database with stored procedures | 0.5 | 330MB |
| k6 | Load testing | (not counted) | (not counted) |
| grafana + influxdb | Observability dashboards | (not counted) | (not counted) |

## Load Balancing

Nginx uses `least_conn` strategy to distribute requests across the two API instances.

## Database

Business logic is implemented in PostgreSQL stored procedures. The database is tuned for maximum write performance:

- `synchronous_commit=0` — no wait for WAL flush
- `fsync=0` — skip fsync on writes
- `full_page_writes=0` — skip full page writes

## Implementation Details

- Minimal single-file Go API (~221 lines)
- chi/v5 lightweight HTTP router
- pgx/v5 PostgreSQL driver with built-in connection pooling
- Multi-stage Docker build for minimal container image size
