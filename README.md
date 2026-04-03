# rinha2-back-end-go

> Go 1.25 implementation for the Rinha de Backend 2024/Q1 challenge with chi router, pgx driver, and PostgreSQL stored procedures

[![Build Check](https://github.com/jonathanperis/rinha2-back-end-go/actions/workflows/build-check.yml/badge.svg)](https://github.com/jonathanperis/rinha2-back-end-go/actions/workflows/build-check.yml) [![Main Release](https://github.com/jonathanperis/rinha2-back-end-go/actions/workflows/main-release.yml/badge.svg)](https://github.com/jonathanperis/rinha2-back-end-go/actions/workflows/main-release.yml) [![CodeQL](https://github.com/jonathanperis/rinha2-back-end-go/actions/workflows/codeql.yml/badge.svg)](https://github.com/jonathanperis/rinha2-back-end-go/actions/workflows/codeql.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**[Live demo →](https://jonathanperis.github.io/rinha2-back-end-go/)** | **[Documentation →](https://jonathanperis.github.io/rinha2-back-end-go/docs/)**

---

## About

A Go implementation of the Brazilian backend challenge Rinha de Backend 2024/Q1, where a fictional bank API must handle concurrent transactions under strict resource constraints (1.5 CPU, 550MB RAM total). Built as a minimal single-file API (~221 lines) using chi/v5 for routing and pgx/v5 for PostgreSQL access, with business logic in stored procedures. Built for learning purposes.

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Go | 1.25 | API implementation |
| chi | v5 | HTTP router |
| pgx | v5 | PostgreSQL driver with connection pool |
| PostgreSQL | - | Database with stored procedures |
| Nginx | - | Reverse proxy and load balancer (least-conn) |
| Docker | - | Multi-stage build and orchestration |
| k6 | - | Stress testing |

## Features

- Minimal single-file API implementation (~221 lines of Go)
- Idiomatic Go with chi/v5 router and pgx/v5 driver
- PostgreSQL stored procedures for server-side business logic
- PostgreSQL tuned with synchronous_commit=0, fsync=0, full_page_writes=0
- All requests under 800ms at 250MB RAM usage (60% below limit)

## Getting Started

### Prerequisites

- Docker with Docker Compose

### Quick Start

```bash
git clone https://github.com/jonathanperis/rinha2-back-end-go.git
cd rinha2-back-end-go
docker compose up nginx -d --build
```

API available at `http://localhost:9999`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/clientes/{id}/transacoes` | POST | Submit debit or credit transaction |
| `/clientes/{id}/extrato` | GET | Get account balance statement |

## Project Structure

```
rinha2-back-end-go/
├── src/WebApi/         — API implementation
├── docker-compose.yml  — Full stack: API x2, Nginx, PostgreSQL, k6, observability
└── .github/workflows/  — CI/CD pipelines
```

## CI/CD

- **PR:** Go build + Docker health check (`build-check.yml`)
- **Main:** Build + Multi-platform Docker push (amd64/arm64) to GHCR + k6 load test + GitHub Pages report (`main-release.yml`)
- **Security:** CodeQL analysis on push, PRs, and weekly schedule (`codeql.yml`)
- **Docs:** Auto-generated from wiki and deployed to GitHub Pages (`deploy-docs.yml`)
- **Image:** `ghcr.io/jonathanperis/rinha2-back-end-go:latest`

## License

MIT — see [LICENSE](LICENSE)
