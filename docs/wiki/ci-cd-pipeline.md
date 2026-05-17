# CI/CD Pipeline

## Workflows

The repository uses GitHub Actions for pull-request checks, main-branch releases, security scanning, and the GitHub Pages documentation deploy.

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `build-check.yml` | Pull requests | Build the Go application and run a Docker Compose health check before merge. |
| `main-release.yml` | Push to `main` | Build and push multi-platform GHCR images, run container health checks, and execute k6 validation. |
| `codeql.yml` | Push, pull request, weekly schedule | Run CodeQL security analysis for Go code. |
| `deploy.yml` | Push to `main` | Build the Astro documentation site and deploy GitHub Pages. |

## Release path

```text
pull request
  └─ build-check.yml
       └─ merge to main
            ├─ main-release.yml  -> GHCR image + k6 evidence
            ├─ codeql.yml        -> security analysis
            └─ deploy.yml        -> GitHub Pages documentation
```

## Published artifacts

- Documentation: [jonathanperis.github.io/rinha2-back-end-go/docs/](https://jonathanperis.github.io/rinha2-back-end-go/docs/)
- Stress reports: [jonathanperis.github.io/rinha2-back-end-go/reports/](https://jonathanperis.github.io/rinha2-back-end-go/reports/)
- Container image: `ghcr.io/jonathanperis/rinha2-back-end-go:latest`

## Operator notes

- PR checks protect the documentation and runtime from obvious regressions.
- Main-branch workflows are the deployment path; the live docs update after the GitHub Pages workflow finishes.
- Stress-test reports should be treated as run-specific evidence, not timeless proof of a single absolute ranking.
