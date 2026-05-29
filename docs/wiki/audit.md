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

## Current API contract

### `GET /healthz`

Used by Docker Compose and CI as a readiness smoke check.

```http
HTTP/1.1 200 OK

Healthy
```

### `POST /clientes/{id}/transacoes`

Request body accepted by the Go handler:

```json
{
  "valor": 1000,
  "tipo": "c",
  "descricao": "deposito"
}
```

Successful response shape:

```json
{
  "id": 1,
  "limite": 100000,
  "saldo": 1000
}
```

Validation and error behavior currently implemented:

| Case | Status | Source-backed note |
|---|---:|---|
| Non-integer `{id}` | `400` | `strconv.Atoi` failure in `postTransacaoHandler`. |
| Unknown client ID | `404` | Client not found in the in-memory `clientes` map. |
| Invalid JSON | `400` | JSON decode failure. |
| Invalid `tipo`, empty/long `descricao`, or non-positive `valor` | `422` | `isTransacaoValid` failure. |
| Over-limit debit | `200` | `InsertTransacao` refuses the mutation and returns the existing balance; the handler serializes that value. |
| Database/query failure | `500` | Handler returns the database error as an internal server error. |

### `GET /clientes/{id}/extrato`

Successful response shape currently emitted by Go:

```json
{
  "saldo": {
    "total": 1000,
    "limite": 100000,
    "data_extrato": "2026-05-29T22:00:00Z"
  },
  "ultimas_transacoes": [
    {
      "valor": 1000,
      "tipo": "c",
      "descricao": "deposito"
    }
  ]
}
```

Statement error behavior currently implemented:

| Case | Status | Source-backed note |
|---|---:|---|
| Non-integer `{id}` | `400` | `strconv.Atoi` failure in `getExtratoHandler`. |
| Unknown client ID | `404` | Client not found in the in-memory `clientes` map. |
| Database row missing | `404` | Defensive `sql.ErrNoRows` branch after the stored-function call. |
| Database/query failure | `500` | Handler returns the database error as an internal server error. |
| Transaction JSON unmarshal failure | `200` | Handler logs the failure and emits an empty `ultimas_transacoes` array. |

## Behaviors that differ from the original challenge shape

### Over-limit debits

The Go handler validates JSON shape, `tipo`, `descricao`, and positive `valor` before calling PostgreSQL. The stored procedure refuses to apply a debit that would exceed the negative credit limit, but it returns the current balance instead of raising an error. The handler then serializes that balance with HTTP `200` unless the database call itself fails.

That means the current implementation behavior is:

- malformed client IDs: `400`
- unknown client IDs: `404`
- invalid transaction fields: `422`
- over-limit debit: no balance mutation; current balance returned by the stored procedure with `200`

If strict challenge compatibility requires a `422` for over-limit debits, that is an implementation follow-up rather than a docs-only change.

### Statement transaction timestamp

The SQL function includes `RealizadoEm` in the JSON row source, but the Go response DTO has no timestamp field. The public statement response currently documents the stable fields emitted by Go: `valor`, `tipo`, and `descricao` inside `ultimas_transacoes`.

If the project wants full challenge response parity, add a timestamp field to `TransacaoDto` with the expected JSON name and then update the docs.

## Runtime stacks

### Development/root compose

The root compose file is the local/dev stack:

- builds the Go image from `src/WebApi/Dockerfile`
- exposes NGINX at `localhost:9999`
- exposes direct API containers on `4200` and `4201`
- runs two API containers behind NGINX `least_conn`
- includes PostgreSQL, Grafana, Prometheus, InfluxDB, postgres-exporter, and k6
- runs k6 with `MODE=dev`

### Production/release compose

The `prod/` compose file is the CI/release stack:

- consumes the GHCR image instead of building from local source
- maps API containers to `8081` and `8082`
- uses config from `prod/conf/`
- runs k6 with `MODE=prod`
- writes the HTML stress report uploaded by `main-release.yml`

## CI/CD boundaries

Pull-request checks are intentionally path-filtered:

- `build-check.yml` watches `src/**`, root Go/Docker/Compose inputs, and its workflow file.
- CodeQL watches `src/**`, root Go module files, and its workflow file.
- Docs-only changes usually skip Docker runtime jobs.
- `prod/**` changes are not part of the PR runtime health filter today; they are exercised by `main-release.yml` after merge to `main`.

Main-branch flows remain the deployment and release path:

- `deploy.yml` publishes the Astro static site to GitHub Pages.
- `main-release.yml` builds/pushes the GHCR image, runs prod compose health checks, runs k6, and uploads the stress-test report artifact.

## Implementation decisions still open

These are now documented, not hidden, but they are implementation choices the project may still want to change later:

- Whether over-limit debits should keep returning unchanged balance with `200` or be changed to strict `422` behavior.
- Whether `ultimas_transacoes` should expose the stored `RealizadoEm` timestamp for full challenge response parity.
- Whether PR path filters should include `prod/**` and `prod/conf/**` so release-stack config changes run the runtime health gate before merge.
