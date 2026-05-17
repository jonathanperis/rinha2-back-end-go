# CI/CD Pipeline

## Workflows

The repository uses GitHub Actions for pull-request checks, main-branch releases, security scanning, and GitHub Pages documentation deployment.

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `build-check.yml` | Pull requests to `main`, manual dispatch | Filters runtime-relevant changes, builds the Go application, starts the root Docker Compose stack for `/healthz`, and fails on an unhealthy response. |
| `main-release.yml` | Push to `main`, manual dispatch | Builds amd64 and arm64 GHCR images, merges a multi-arch `latest` manifest, runs the prod compose health check, and runs k6 with report artifact upload. |
| `codeql.yml` | Push to `main`, pull requests to `main`, weekly schedule | Runs Go CodeQL with manual build mode when source/workflow paths are relevant. |
| `deploy.yml` | Push to `main`, manual dispatch | Uses the shared Pages docs workflow with Bun to build `docs/` and deploy GitHub Pages. |

## Release path

```text
pull request
  ├─ build-check.yml      -> Go build + root compose /healthz when runtime paths changed
  └─ codeql.yml           -> Go security analysis when source paths changed
       └─ rebase merge to main
            ├─ main-release.yml  -> GHCR latest/latest-arm64 + k6 artifact
            ├─ codeql.yml        -> security analysis
            └─ deploy.yml        -> Astro docs to GitHub Pages
```

## Published artifacts

- Documentation: [jonathanperis.github.io/rinha2-back-end-go/docs/](https://jonathanperis.github.io/rinha2-back-end-go/docs/)
- Stress reports: [jonathanperis.github.io/rinha2-back-end-go/reports/](https://jonathanperis.github.io/rinha2-back-end-go/reports/)
- Container image: `ghcr.io/jonathanperis/rinha2-back-end-go:latest`
- Arm64 staging tag before manifest merge: `ghcr.io/jonathanperis/rinha2-back-end-go:latest-arm64`

## Operator notes

- PR checks are path-filtered: docs-only changes may not run runtime Docker checks, but Pages still builds on `main` after merge.
- Main-branch workflows are the deployment path; the live docs update after `deploy.yml` finishes.
- Stress-test reports should be treated as run-specific evidence, not timeless proof of a single absolute ranking.
- The production compose file reads SQL/NGINX config from `prod/conf/`; the development compose file reads from the repository root.
