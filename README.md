# new-dash-ui

A micro-frontend (MFE) dashboard application built with React 19, TypeScript, and Vite. Uses build-time federation in a pnpm monorepo for team ownership boundaries with unified deployment.

## Quick Start

### Development

```bash
# Install dependencies
pnpm install

# Start development server (port 5173)
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Preview (HTTPS)

To test PWA features like the install prompt locally, you need HTTPS with trusted certificates:

```bash
# One-command setup and preview
pnpm run preview:https
```

This uses [mkcert](https://github.com/FiloSottile/mkcert) to create locally-trusted certificates.

**First-time setup:**

1. Install mkcert: `brew install mkcert`
2. Run setup: `pnpm run setup:https` (requires password for CA installation)
3. **Restart your browser** (quit and reopen to trust the new CA)
4. Build and preview: `pnpm run build && pnpm run preview`

Open [https://localhost:4173](https://localhost:4173) in Chrome. The PWA install banner should appear.

**Manual certificate setup:**

```bash
# Install mkcert (macOS)
brew install mkcert

# Install local CA (requires password)
mkcert -install

# Generate certificates (run from project root)
mkdir -p apps/shell/certs
cd apps/shell/certs
mkcert localhost 127.0.0.1 ::1
cd -

# Build and preview
pnpm run build && pnpm run preview
```

### Production (Docker)

```bash
# Build and run with Docker Compose (port 8080)
docker-compose up --build

# Stop containers
docker-compose down
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

## Project Structure

```
new-dash-ui/
├── apps/
│   ├── shell/              # Host application (orchestrator)
│   ├── mfe-dashboard/      # Dashboard MFE
│   ├── mfe-rent/           # Rent workflow MFE
│   ├── mfe-return/         # Return workflow MFE
│   └── ...                 # Other MFEs
├── packages/
│   ├── ui/                 # Shared UI components
│   ├── api-client/         # React Query setup
│   ├── event-bus/          # Cross-MFE communication
│   └── mfe-types/          # Type contracts
├── docker/
│   └── nginx.conf          # Production server config
└── docker-compose.yml      # Local production demo
```

## Architecture Overview

The application uses a **build-time federation** approach:

- **Shell** (`apps/shell`) - Orchestrates MFEs, handles auth, provides layout
- **MFEs** (`apps/mfe-*`) - Independent features, lazy-loaded per route
- **Shared packages** - UI components, types, and event bus for loose coupling

Each MFE maps to a single page/route, creating clear team ownership boundaries.

For detailed architecture documentation, see [ARCHITECTURE.md](ARCHITECTURE.md).

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Build-time over runtime federation | Simpler ops, single Docker deployment |
| Each page = 1 MFE | Clear ownership, simple mental model |
| Event bus for cross-MFE communication | Loose coupling, typed events |
| Shared types package | Compile-time contract verification |

## Development Guide

### Adding a New MFE

1. Create MFE directory: `mkdir -p apps/mfe-newfeature/src`
2. Add `package.json` with workspace dependencies
3. Create page component in `apps/shell/src/pages/`
4. Add route in `apps/shell/src/routes/`
5. Update navigation config

### Working with Shared Packages

Changes to `packages/*` are immediately available in dev mode via pnpm workspace linking. Run `pnpm build` in the package directory to update compiled output.

### Event Bus Usage

```typescript
import { eventBus } from '@packages/event-bus';

// Emit notification
eventBus.emit('notification:show', {
  type: 'success',
  message: 'Saved!'
});

// Listen for navigation
eventBus.on('navigation:change', (event) => {
  console.log('Navigate to:', event.path);
});
```

For event types and payloads, see [docs/CONTRACTS.md](docs/CONTRACTS.md).

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start shell dev server |
| `pnpm build` | Build all packages and shell |
| `pnpm preview` | Preview production build (HTTPS) |
| `pnpm preview:https` | Setup certs + build + preview (one command) |
| `pnpm setup:https` | Setup mkcert certificates only |
| `pnpm typecheck` | Run TypeScript checks |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm test:e2e` | Run E2E tests (Playwright) |

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 with React Compiler |
| Language | TypeScript (strict mode) |
| Build | Vite with TanStack Router plugin |
| Monorepo | pnpm workspaces |
| Routing | TanStack Router (file-based, auto code-splitting) |
| State | Zustand (auth), TanStack Query (server state) |
| Styling | Tailwind CSS v4, Radix UI, shadcn/ui-style components |
| Forms | React Hook Form + Zod |
| Testing | Vitest, React Testing Library, Playwright |
| Icons | lucide-react |
| PWA | vite-plugin-pwa |

## Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - Full MFE architecture documentation
- [docs/CONTRACTS.md](docs/CONTRACTS.md) - Event bus events and type contracts

## License

Private - Internal use only.
