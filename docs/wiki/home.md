---
title: Home
---

# Home

Go 1.25 implementation for the Rinha de Backend 2024/Q1 challenge. Manages a fictional bank API with transaction processing and balance statements under strict resource constraints (1.5 CPU, 550MB RAM total across all containers). Written in ~221 lines of pure Go.

## Wiki Pages

| Page | Description |
|------|-------------|
| [Challenge](challenge) | What is Rinha de Backend 2024/Q1 |
| [Architecture](architecture) | Stack, services, resource constraints |
| [Getting Started](getting-started) | Prerequisites and how to run |
| [Performance](performance) | Results, benchmarks, resource usage |
| [CI/CD Pipeline](ci-cd-pipeline) | GitHub Actions workflows |

## Key Features

- Go 1.25 with minimal standard library usage (~221 lines)
- chi/v5 router for high-performance HTTP routing
- pgx/v5 with pgxpool for efficient PostgreSQL connection pooling
- PostgreSQL stored procedures for server-side business logic
- Extreme throughput under strict resource constraints

---

*[GitHub](https://github.com/jonathanperis/rinha2-back-end-go) · [Jonathan Peris](https://jonathanperis.github.io/)*
