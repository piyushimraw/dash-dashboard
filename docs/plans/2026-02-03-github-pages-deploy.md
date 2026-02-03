# GitHub Pages Deployment Workflow Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a GitHub Actions workflow that builds the monorepo and deploys the shell app to GitHub Pages on pushes to `main`.

**Architecture:** A single workflow file uses the modern GitHub Pages deployment approach (artifact upload + deploy action) instead of the legacy `gh-pages` branch. The Vite build `base` path is set conditionally so local dev still uses `/` while CI builds target `/dash-dashboard/`. The PWA manifest `start_url` is also updated to be relative so it works under any base path.

**Tech Stack:** GitHub Actions, pnpm, Vite, `actions/upload-pages-artifact`, `actions/deploy-pages`

---

### Task 1: Set Vite `base` for GitHub Pages

GitHub Pages serves this repo at `https://piyushimraw.github.io/dash-dashboard/`. All asset URLs must be prefixed with `/dash-dashboard/`. We use an environment variable so local dev is unaffected.

**Files:**
- Modify: `apps/shell/vite.config.ts:21` (the `defineConfig` return object)

**Step 1: Add `base` to the Vite config**

In `apps/shell/vite.config.ts`, add a `base` property to the config object. Use the `VITE_BASE` environment variable so CI can set it and local dev defaults to `/`:

```typescript
export default defineConfig(({ mode }) => ({
  base: process.env.VITE_BASE || '/',
  plugins: [
```

This is added as the first property in the returned config object, right before `plugins`.

**Step 2: Make PWA `start_url` relative**

In the same file, change the PWA manifest `start_url` from `"/"` to `"."` so it works regardless of the base path:

```typescript
        start_url: ".",
```

**Step 3: Make PWA `navigateFallback` relative to base**

Change the workbox `navigateFallback` from `'/index.html'` to `'index.html'`:

```typescript
        navigateFallback: 'index.html',
```

**Step 4: Verify the build works locally**

Run:
```bash
VITE_BASE=/dash-dashboard/ pnpm build
```
Expected: Build succeeds. Check that `apps/shell/dist/index.html` contains asset URLs prefixed with `/dash-dashboard/`.

**Step 5: Verify default (no env var) build still works**

Run:
```bash
pnpm build
```
Expected: Build succeeds. Asset URLs in `apps/shell/dist/index.html` use `/` prefix (no subpath).

**Step 6: Commit**

```bash
git add apps/shell/vite.config.ts
git commit -m "feat: add configurable Vite base path for GitHub Pages deployment"
```

---

### Task 2: Create the GitHub Pages deployment workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

**Step 1: Create the workflow file**

Create `.github/workflows/deploy.yml` with the following content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install pnpm
        uses: pnpm/action-setup@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build
        env:
          VITE_BASE: /dash-dashboard/

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: apps/shell/dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Step 2: Validate the workflow YAML syntax**

Run:
```bash
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/deploy.yml'))" && echo "YAML valid"
```
Expected: `YAML valid`

**Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Pages deployment workflow"
```

---

### Task 3: Update existing CI workflow to also target `main`

The existing CI workflow (`.github/workflows/ci.yml`) only runs on the `microfrontend-arch` branch. It should also run on `main` so tests execute before deployments.

**Files:**
- Modify: `.github/workflows/ci.yml:3-9`

**Step 1: Update the CI trigger branches**

Replace the `on` block to include both `main` and `microfrontend-arch`:

```yaml
on:
  pull_request:
    branches:
      - main
      - microfrontend-arch
  push:
    branches:
      - main
      - microfrontend-arch
```

**Step 2: Use pnpm/action-setup instead of npm install -g pnpm**

The existing CI installs pnpm via `npm install -g pnpm`. The official `pnpm/action-setup@v4` action is more reliable and auto-detects the version from `packageManager` in `package.json`. Replace:

```yaml
      - name: Install pnpm
        uses: pnpm/action-setup@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
```

This replaces the old "Setup Node" and "Install pnpm" steps. Note: `pnpm/action-setup` must come **before** `actions/setup-node` so that pnpm is available for Node's cache setup.

**Step 3: Use --frozen-lockfile for CI installs**

Change the install step to:

```yaml
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
```

**Step 4: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: update CI to run on main branch and use official pnpm action"
```

---

### Task 4: Enable GitHub Pages in repo settings (manual step)

This is a manual step the developer must perform in the GitHub UI.

**Step 1: Configure GitHub Pages source**

1. Go to `https://github.com/piyushimraw/dash-dashboard/settings/pages`
2. Under **Source**, select **GitHub Actions**
3. Save

This is required for the `actions/deploy-pages` action to work. Without this setting, the deploy job will fail with a permissions error.

**Step 2: Verify deployment**

After pushing the commits to `main`, check:
1. The workflow runs at `https://github.com/piyushimraw/dash-dashboard/actions`
2. The site is live at `https://piyushimraw.github.io/dash-dashboard/`

---

## Summary of changes

| File | Action | Purpose |
|------|--------|---------|
| `apps/shell/vite.config.ts` | Modify | Add `base` from env var, fix PWA paths |
| `.github/workflows/deploy.yml` | Create | Build + deploy to GitHub Pages |
| `.github/workflows/ci.yml` | Modify | Add `main` branch, use official pnpm action |

## Post-deployment notes

- The `VITE_BASE` env var approach means local dev (`pnpm dev`) is unaffected — it defaults to `/`.
- The `workflow_dispatch` trigger allows manual re-deploys from the Actions tab.
- The `concurrency` setting prevents parallel deployments from conflicting.
- `--frozen-lockfile` ensures CI never silently modifies the lockfile.
