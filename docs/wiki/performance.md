# Performance

## Resource envelope

The project targets the official Rinha de Backend 2024/Q1 limit of **1.5 CPU** and **550MB RAM** across the challenge-counted stack.

| Metric | Limit | Documented result | Margin |
|--------|-------|-------------------|--------|
| RAM | 550MB | ~250MB | About 60% below the limit |
| Response time | Challenge-sensitive | < 800ms | All documented requests under the headline threshold |
| API replicas | 2 | 2 | Balanced by NGINX `least_conn` |

## Published reports

Stress-test HTML reports are published with the static site under [`/reports/`](../reports/). Use them as the durable evidence trail for individual runs rather than treating a single number as universal performance truth.

## How to read the results

- **Resource usage** is the important first-pass signal because the challenge budget is very small.
- **Latency claims** should be read alongside the exact k6 run and host environment that produced the report.
- **Repeated runs matter.** Backend benchmark results can vary across hosts and CI runners, so compare multiple reports before drawing conclusions.
- **Correctness still wins.** A fast run is only useful if transaction validation, limits, and final statements remain correct.

## Benchmark-oriented choices

<div class="docs-metric-grid">
  <div class="metric-tile"><span>Hot path</span><strong>SQL</strong><p>Stored procedures keep balance mutation close to PostgreSQL.</p></div>
  <div class="metric-tile"><span>Fan-out</span><strong>2 APIs</strong><p>Two Go API containers share requests behind NGINX.</p></div>
  <div class="metric-tile"><span>DB tuning</span><strong>write-heavy</strong><p>PostgreSQL settings reduce write overhead for contest runs.</p></div>
</div>

## Run locally

```bash
docker compose up nginx -d --build
docker compose up k6
```

For development dashboards, start the observability services too and keep the k6 service in development mode. For publishable evidence, prefer the generated HTML reports that are archived by the site.
