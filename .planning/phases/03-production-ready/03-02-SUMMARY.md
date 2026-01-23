---
phase: 03-production-ready
plan: 02
status: complete
started: 2026-01-23
completed: 2026-01-23
duration: ~15min
subsystem: docker-production-setup
tags: [docker, nginx, docker-compose, containerization, spa-routing, caching]

dependency-graph:
  requires: [03-01]
  provides: [docker-build, nginx-config, production-orchestration]
  affects: [03-03]

tech-stack:
  added: [nginx:alpine, docker-compose]
  patterns: [multi-stage-docker-build, spa-routing-fallback, cache-headers]

key-files:
  created:
    - apps/shell/Dockerfile
    - docker/nginx.conf
    - docker-compose.yml
  modified: []

decisions:
  - decision: "Multi-stage Docker build (Node builder + nginx runtime)"
    rationale: "Minimizes final image size (~50MB) by compiling in ephemeral builder stage"
  - decision: "Immutable cache headers for hashed assets, no-cache for index.html"
    rationale: "Maximizes cache hit rate while ensuring updates are picked up"
  - decision: "SPA fallback routing (try_files $uri $uri/ /index.html)"
    rationale: "Enables client-side routing without 404 errors on refresh"
  - decision: "Docker healthcheck with wget"
    rationale: "Validates nginx is serving requests (wget available in alpine)"

metrics:
  duration: ~15min
  completed: 2026-01-23
---

# Plan 03-02 Summary: Docker production setup with multi-stage build and nginx

**One-liner:** Multi-stage Dockerfile with nginx SPA serving, nginx.conf with proper cache headers and routing fallback, and docker-compose.yml for local production demo

## What Was Done

### Task 1: Create multi-stage Dockerfile
- Created apps/shell/Dockerfile with two stages:
  - **Builder stage (node:23-alpine):** Runs pnpm install and pnpm build
  - **Production stage (nginx:alpine):** Copies compiled assets from builder
- Key features:
  - Corepack enabled for pnpm
  - Copy workspace config (package.json, pnpm-lock.yaml, pnpm-workspace.yaml) before source for layer caching
  - Copy all package.json files from packages/ and apps/ for workspace resolution
  - Copies dist/ from builder to /usr/share/nginx/html
  - Minimal final image (~50MB)
- Commit: `c479085`

### Task 2: Create nginx configuration for SPA
- Created docker/nginx.conf with:
  - **Security headers:** X-Frame-Options, X-Content-Type-Options, X-XSS-Protection
  - **Asset caching:** /assets/* with Cache-Control: max-age=31536000, immutable
  - **index.html:** Cache-Control: max-age=0, must-revalidate
  - **Service worker:** Cache-Control: max-age=0, must-revalidate
  - **Workbox runtime:** Cache-Control: max-age=31536000, immutable
  - **SPA fallback:** location / serves index.html for client-side routes
- Commit: `273bd11`

### Task 3: Create docker-compose.yml
- Created docker-compose.yml with:
  - Service web building from apps/shell/Dockerfile
  - Port mapping 8080:80 (avoid dev server conflicts)
  - Restart policy: unless-stopped
  - Healthcheck using wget to validate nginx
- Commit: `e3ec9bd`

### Task 4: Verify Docker production setup
- **Human verification performed:** All 4 success criteria met
  - docker-compose up --build succeeds
  - Application accessible at localhost:8080
  - SPA routing works (refresh on /dashboard doesn't 404)
  - Cache headers correct (index.html max-age=0, assets max-age=31536000)
- No issues found during verification

## Deliverables

| File | Purpose | Key Content |
|------|---------|-------------|
| apps/shell/Dockerfile | Production build artifact | Multi-stage: node builder + nginx runtime |
| docker/nginx.conf | SPA routing & caching | try_files fallback, cache headers |
| docker-compose.yml | Local orchestration | Build context, port mapping, healthcheck |

## Build Process

1. Builder stage: pnpm install + pnpm build (compiles TypeScript, Vite bundling)
2. Production stage: Copies dist/ to nginx html root
3. nginx serves on port 80, exposed as 8080 on host

## Cache Strategy

| File Type | Location | Cache Header | Rationale |
|-----------|----------|--------------|-----------|
| index.html | / | max-age=0, must-revalidate | Always check for updates |
| Assets (hashed) | /assets/*.js/css | max-age=31536000, immutable | 1 year cache (content hash in filename) |
| Service worker | *.webmanifest, sw.js | max-age=0, must-revalidate | Always fresh |
| Workbox runtime | workbox-*.js | max-age=31536000, immutable | Cache with assets |

## Verification Results

- [x] Dockerfile exists with two FROM statements
- [x] nginx.conf exists with try_files SPA fallback
- [x] docker-compose.yml exists with correct port mapping
- [x] docker-compose build succeeds
- [x] docker-compose up serves on localhost:8080
- [x] /dashboard refresh returns 200 (not 404)
- [x] Cache headers verified (index.html max-age=0, assets immutable)

## Commits

1. `c479085` - feat(03-02): create multi-stage Dockerfile for production build
2. `273bd11` - feat(03-02): add nginx configuration for SPA serving
3. `e3ec9bd` - feat(03-02): add docker-compose.yml for local production testing
4. `48c03a5` - fix(03-02): remove invalid package paths from Dockerfile

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Invalid package paths in Dockerfile**
- **Found during:** Task 1 verification
- **Issue:** Initial Dockerfile copied individual package.json files from packages/ and apps/ without proper wildcard patterns
- **Fix:** Removed invalid package path COPY statements and used proper workspace structure
- **Files modified:** apps/shell/Dockerfile
- **Commit:** 48c03a5

## Technical Notes

- Multi-stage builds reduce final image size by ~10x (compiling code doesn't remain in production image)
- pnpm workspace structure requires copying pnpm-workspace.yaml and all package.json files for proper dependency resolution
- nginx:alpine provides minimal base (lightweight, includes wget for healthcheck)
- SPA fallback routing (try_files $uri $uri/ /index.html) is critical for client-side routing
- Immutable cache headers for hashed assets allow aggressive caching without busting

## Next Steps

Plan 03-03 will add deployment orchestration and production monitoring.
