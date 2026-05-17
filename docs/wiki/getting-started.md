# Getting Started

## Prerequisites

- Docker with Docker Compose.
- A shell with `curl` for quick smoke tests.

> The full benchmark stack depends on a reachable Docker daemon. In this Hermes environment the Docker CLI exists, but daemon access is not available, so local compose verification must run on a machine with Docker permissions.

## Clone and run

```bash
git clone https://github.com/jonathanperis/rinha2-back-end-go.git
cd rinha2-back-end-go
docker compose up nginx -d --build
```

The API is exposed through NGINX at `http://localhost:9999`.

## Smoke-test the API

Create a credit transaction:

```bash
curl -sS -X POST http://localhost:9999/clientes/1/transacoes \
  -H "Content-Type: application/json" \
  -d '{"valor": 1000, "tipo": "c", "descricao": "deposito"}'
```

Read the statement:

```bash
curl -sS http://localhost:9999/clientes/1/extrato
```

Try an invalid debit to confirm validation still rejects overdrafts beyond the credit limit:

```bash
curl -i -X POST http://localhost:9999/clientes/1/transacoes \
  -H "Content-Type: application/json" \
  -d '{"valor": 999999999, "tipo": "d", "descricao": "limite"}'
```

## Useful compose targets

| Command | Use |
|---------|-----|
| `docker compose up nginx -d --build` | Build and start the challenge-counted stack behind NGINX. |
| `docker compose logs -f nginx webapi1-go webapi2-go db` | Follow request path and database startup logs. |
| `docker compose up k6` | Run the configured k6 service after the API is healthy. |
| `docker compose down -v` | Stop services and remove the database volume for a clean run. |

## Endpoint summary

| Endpoint | Method | Payload / response |
|----------|--------|--------------------|
| `/clientes/{id}/transacoes` | `POST` | JSON body with `valor`, `tipo`, and `descricao`. Returns updated `limite` and `saldo`. |
| `/clientes/{id}/extrato` | `GET` | Returns `saldo` metadata and recent `ultimas_transacoes`. |
