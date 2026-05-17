# Getting Started

## Prerequisites

- Docker with Docker Compose and a reachable Docker daemon.
- A shell with `curl` for quick smoke tests.

> The full benchmark stack depends on Docker daemon access. In this Hermes environment the Docker CLI exists, but daemon access is not available, so local compose verification must run in CI or on a machine with Docker permissions.

## Clone and run

```bash
git clone https://github.com/jonathanperis/rinha2-back-end-go.git
cd rinha2-back-end-go
docker compose up nginx -d --build
```

The API is exposed through NGINX at `http://localhost:9999`.

## Smoke-test the API

Check the health endpoint used by CI:

```bash
curl -i http://localhost:9999/healthz
```

Create a credit transaction:

```bash
curl -sS -X POST http://localhost:9999/clientes/1/transacoes   -H "Content-Type: application/json"   -d '{"valor": 1000, "tipo": "c", "descricao": "deposito"}'
```

Read the statement:

```bash
curl -sS http://localhost:9999/clientes/1/extrato
```

Try an invalid debit to confirm validation still rejects overdrafts beyond the credit limit:

```bash
curl -i -X POST http://localhost:9999/clientes/1/transacoes   -H "Content-Type: application/json"   -d '{"valor": 999999999, "tipo": "d", "descricao": "limite"}'
```

## Useful compose targets

| Command | Use |
|---------|-----|
| `docker compose up nginx -d --build` | Build and start the challenge-counted stack behind NGINX. |
| `docker compose logs -f nginx webapi1-go webapi2-go db` | Follow request path and database startup logs. |
| `docker compose up k6 --build --force-recreate` | Run the configured k6 service after the API is healthy. Root compose runs `MODE=dev`; prod compose runs `MODE=prod`. |
| `docker compose down -v` | Stop services and remove the database volume for a clean run. |

## Endpoint summary

| Endpoint | Method | Payload / response |
|----------|--------|--------------------|
| `/healthz` | `GET` | Returns `Healthy`; used by compose/CI health checks. |
| `/clientes/{id}/transacoes` | `POST` | JSON body with `valor`, `tipo`, and `descricao`. Returns `id`, `limite`, and updated `saldo`. |
| `/clientes/{id}/extrato` | `GET` | Returns `saldo` metadata and up to 10 recent `ultimas_transacoes`. |

## Local Go build

```bash
cd src/WebApi
go build -ldflags="-s -w" -o rinha2-back-end-go .
```

The binary requires `DATABASE_URL`; inside the Docker network it should point at the `db` service with credentials matching the compose/PostgreSQL environment.
