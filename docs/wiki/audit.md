# Source Audit

## Why this page exists

This page records the repo-vs-docs audit points that are easy to miss when reading only the README or landing page. It is source-backed against the current Go handlers, SQL functions, compose files, and GitHub Actions workflows.

## Confirmed implementation facts

| Area | Source-backed behavior | Source |
|---|---|---|
| HTTP routes | The API exposes `GET /healthz`, `GET /clientes/{id}/extrato`, and `POST /clientes/{id}/transacoes`. | `src/WebApi/main.go` |
| Server timeouts | The HTTP server uses a 5-second read timeout, 10-second write timeout, and 5-second DB context timeout per handler call. | `src/WebApi/main.go` |
| Client limits | Clients 1–5 are defined in both Go and SQL with limits `100000`, `80000`, `1000000`, `10000000`, and `500000`. | `main.go`, `rinha.dump.sql` |
| Statement rows | PostgreSQL stores `RealizadoEm` and selects it in the statement function, but the Go `TransacaoDto` currently serializes only `valor`, `tipo`, and `descricao`. | `rinha.dump.sql`, `main.go` |
| Binary startup | Running the Go binary outside compose requires `DATABASE_URL`; compose injects the service connection string. | `main.go`, compose files |
| PR filters | Pull-request runtime checks are path-filtered. Docs-only changes usually skip Docker runtime checks; `prod/**` changes are not part of the PR health filter today, while main-branch workflows still deploy Pages and run release checks. | `.github/workflows/*.yml` |

## Behaviors to document carefully

### Over-limit debits

The Go handler validates JSON shape, `tipo`, `descricao`, and positive `valor` before calling PostgreSQL. The stored procedure refuses to apply a debit that would exceed the negative credit limit, but it returns the current balance instead of raising an error. The handler then serializes that balance with HTTP `200` unless the database call itself fails.

That means the current implementation behavior is:

- malformed client IDs: `400`
- unknown client IDs: `404`
- invalid transaction fields: `422`
- over-limit debit: no balance mutation; current balance returned by the stored procedure

If strict challenge compatibility requires a `422` for over-limit debits, that is an implementation follow-up rather than a docs-only change.

### Statement transaction timestamp

The SQL function includes `RealizadoEm` in the JSON row source, but the Go response DTO has no timestamp field. The public statement response currently documents the stable fields emitted by Go: `valor`, `tipo`, and `descricao` inside `ultimas_transacoes`.

If the project wants full challenge response parity, add a timestamp field to `TransacaoDto` with the expected JSON name and then update the docs.

### Dev stack versus prod stack

The root compose file is the local/dev stack: it builds the Go image from source, exposes direct API ports `4200` and `4201`, and includes Grafana, Prometheus, InfluxDB, postgres-exporter, and the k6 service in `MODE=dev`.

The `prod/` compose file is the CI/release stack: it consumes the GHCR image, maps API containers to `8081` and `8082`, uses config from `prod/conf/`, and runs k6 in `MODE=prod` with an HTML report artifact.

## Documentation follow-ups worth considering

- Add exact example response bodies once the API shape is considered stable.
- Decide whether over-limit debit should remain a documented current behavior or be changed to return `422`.
- Decide whether statement transactions should expose the stored `RealizadoEm` timestamp.
- Consider extending PR path filters if prod compose/config changes should run the same runtime health gate before merge.
