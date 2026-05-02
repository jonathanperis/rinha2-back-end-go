# CI/CD Pipeline

## Workflows

This repository uses four GitHub Actions workflows:

### build-check.yml

- **Trigger:** Pull requests
- **Steps:** Builds the Go application and runs a Docker Compose health check to verify the service starts correctly
- **Purpose:** Catch build failures and regressions before merging

### main-release.yml

- **Trigger:** Push to main branch
- **Steps:** Builds the Go application, creates a multi-platform Docker image (amd64/arm64), pushes to GitHub Container Registry (GHCR), runs container health check, and executes k6 load tests
- **Purpose:** Automated release of production-ready container images with stress test validation

### codeql.yml

- **Trigger:** Push to main, pull requests, and weekly schedule
- **Steps:** Runs CodeQL security analysis on Go code
- **Purpose:** Detect security vulnerabilities and code quality issues

### deploy.yml

- **Trigger:** Push to main branch
- **Steps:** Deploys the `docs/` directory to GitHub Pages using the GitHub Actions deployment model
- **Purpose:** Publish project documentation and landing page
