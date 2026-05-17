# Challenge

## Rinha de Backend 2024/Q1

Rinha de Backend is a Brazilian backend programming challenge. The 2024/Q1 edition models a tiny financial API: five predefined clients start with credit limits and balances, and the service must accept concurrent credits, debits, and statement reads under a strict container resource cap.

## Required API contract

| Endpoint | Method | Expected behavior |
|----------|--------|-------------------|
| `/clientes/{id}/transacoes` | `POST` | Submit a debit (`d`) or credit (`c`) transaction for clients 1 through 5. |
| `/clientes/{id}/extrato` | `GET` | Return current balance, credit limit, statement timestamp, and recent transactions. |

## Validation rules

- Client IDs outside the seeded range should fail.
- Transaction values must be positive integers.
- Transaction type is constrained to debit (`d`) or credit (`c`).
- Descriptions are short strings and must satisfy the official challenge limits.
- Debits cannot exceed the current balance plus the configured client limit.

## Resource constraints

The official stack budget is intentionally tight:

<div class="docs-metric-grid">
  <div class="metric-tile"><span>Total CPU</span><strong>1.5</strong><p>Shared across API, NGINX, and PostgreSQL.</p></div>
  <div class="metric-tile"><span>Total RAM</span><strong>550MB</strong><p>Shared across all challenge-counted containers.</p></div>
  <div class="metric-tile"><span>Workload</span><strong>k6</strong><p>Concurrent transactions, validations, and statement queries.</p></div>
</div>

## Why this implementation is interesting

The repository explores a compact Go approach: a small API surface, a simple NGINX fan-out, and PostgreSQL stored procedures for the hot transaction path. The goal is not to build a feature-complete banking system; it is to study performance trade-offs under a fixed resource envelope.

## Source specification

Full specification: [github.com/zanfranceschi/rinha-de-backend-2024-q1](https://github.com/zanfranceschi/rinha-de-backend-2024-q1)
