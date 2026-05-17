---
name: Go Rinha Architecture
description: Single-file chi/v5 API, pgx connection pooling, context-based timeouts, minimal dependencies
type: project
---

## Design Decisions

**Single-file API (221 lines in main.go):**
- Types → router setup → request handlers, all in one file
- Only 2 direct dependencies: chi/v5 (router) and pgx/v5 (database)
- Uses Go stdlib for JSON, HTTP server, logging

**Why:** Go's stdlib is sufficient for most HTTP needs. chi adds only idiomatic routing. Minimal deps = minimal attack surface and fast compilation.

**How to apply:** Keep it single-file. Use stdlib where possible. Only add dependencies if Go stdlib genuinely lacks the feature.

## Key Technical Choices

- **chi/v5 router**: Lightweight, idiomatic. `chi.URLParam(r, "id")` for path params.
- **pgxpool.New()**: Managed connection pool — no manual pool sizing.
- **Context timeouts**: `context.WithTimeout(r.Context(), 5*time.Second)` on all DB calls — prevents hanging.
- **Hardcoded client map**: `map[int]int{1: 100000, ...}` — same pattern as Rust's lazy static.
- **`-ldflags="-s -w"`**: Strips debug symbols for smaller binary (~15-20MB final image).

## Docker Image

Multi-stage: `golang:1.25-alpine3.21` (build) → `alpine:3.23` (runtime). Final image ~15-20MB.

## Shared Infrastructure

Same PostgreSQL schema, stored procedures, NGINX config, and k6 tests as Rust, .NET, and Python implementations.
