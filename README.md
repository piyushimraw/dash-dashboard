# DASH Portal

A micro-frontend architecture for Hertz vehicle rental operations, built with React 19, TypeScript, and Vite.

## Architecture Overview

This project uses a **build-time micro-frontend composition** approach:

- **Monorepo** managed with pnpm workspaces
- **Turborepo** for build orchestration and caching
- **Vite** for fast development and optimized production builds
- **TanStack Router** for type-safe routing
- **TanStack Query** for server state management
- **Zustand** for client state management

```
new-dash-ui/
├── apps/
│   └── shell/                 # Main application shell
├── packages/
│   ├── mfe-types/            # Shared TypeScript types
│   ├── shared-utils/         # Utilities (cn, http)
│   ├── shared-state/         # Auth store, query client
│   ├── shared-ui/            # UI components
│   ├── mfe-rentals/          # Rentals micro-frontend
│   ├── mfe-returns/          # Returns micro-frontend
│   └── mfe-aao/              # AAO micro-frontend
├── pnpm-workspace.yaml       # Workspace configuration
├── turbo.json                # Turborepo pipeline
└── tsconfig.base.json        # Shared TypeScript config
```

## Prerequisites

- **Node.js** >= 18.x
- **pnpm** >= 9.x (install with `npm install -g pnpm`)

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Development Server

```bash
# Start all packages in dev mode
pnpm dev

# Or start only the shell application
pnpm --filter @dash/shell dev
```

The application will be available at `http://localhost:5173`

### 3. Login Credentials (Development)

Use any username/password combination on the login screen.

## Development Workflow

### Running Commands

```bash
# Start development
pnpm dev

# Build all packages
pnpm build

# Run TypeScript checks
pnpm typecheck

# Run linting
pnpm lint

# Run tests
pnpm test
```

### Working with Specific Packages

Use the `--filter` flag to target specific packages:

```bash
# Build only rentals MFE
pnpm --filter @dash/mfe-rentals build

# Run tests for shell
pnpm --filter @dash/shell test

# Start dev server for shell only
pnpm --filter @dash/shell dev
```

### Turborepo Caching

Turborepo automatically caches build outputs. To see cache status:

```bash
pnpm turbo build --dry-run
```

To clear the cache:

```bash
pnpm turbo daemon clean
```

## Project Structure

### Apps

| Package | Description |
|---------|-------------|
| `@dash/shell` | Main application shell - handles routing, layout, and MFE composition |

### Shared Packages

| Package | Description |
|---------|-------------|
| `@dash/mfe-types` | TypeScript interfaces for MFE contracts (navigation, dialogs, routes) |
| `@dash/shared-ui` | Reusable UI components (Button, Card, Dialog, Input, Table, etc.) |
| `@dash/shared-utils` | Utility functions (`cn()` for classnames, `http()` for API calls) |
| `@dash/shared-state` | Shared state management (auth store, query client, query keys) |

### Micro-Frontends

| Package | Description |
|---------|-------------|
| `@dash/mfe-rentals` | Rentals domain - rent page, rent forms, vehicle rental dialogs |
| `@dash/mfe-returns` | Returns domain - return page, return forms |
| `@dash/mfe-aao` | AAO (Authorization and Operations) domain |

## Creating a New Micro-Frontend

### 1. Create Package Structure

```bash
mkdir -p packages/mfe-{name}/src/{pages,features,forms,dialogs}
```

### 2. Create `package.json`

```json
{
  "name": "@dash/mfe-{name}",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@dash/mfe-types": "workspace:*",
    "@dash/shared-ui": "workspace:*",
    "@dash/shared-utils": "workspace:*",
    "lucide-react": "^0.562.0",
    "react": "^19.2.0"
  },
  "devDependencies": {
    "@types/react": "^19.2.5",
    "typescript": "~5.9.3"
  }
}
```

### 3. Create Navigation Export

```typescript
// packages/mfe-{name}/src/navigation.ts
import { SomeIcon } from "lucide-react";
import type { NavigationGroup } from "@dash/mfe-types";

export const navigation: NavigationGroup[] = [
  {
    id: "{name}-section",
    label: "Section Label",
    icon: SomeIcon,
    order: 20, // Controls position in sidebar
    items: [
      { label: "Page 1", icon: SomeIcon, pathname: "/page1" },
      { label: "Page 2", pathname: "/page2" },
    ],
  },
];
```

### 4. Create Index Export

```typescript
// packages/mfe-{name}/src/index.ts
export { navigation } from "./navigation";
export { MyPage } from "./pages/MyPage";
// Export dialogs if needed
// export { dialogs } from "./dialogs";
```

### 5. Register in Shell

Update `apps/shell/src/main.tsx`:

```typescript
import { navigation as myNavigation } from "@dash/mfe-{name}";

mfeRegistry.register({
  id: "{name}",
  navigation: myNavigation,
});
```

Add route in `apps/shell/src/routes/`:

```typescript
// apps/shell/src/routes/_auth.{name}.tsx
import { createFileRoute } from "@tanstack/react-router";
import { MyPage } from "@dash/mfe-{name}";

export const Route = createFileRoute("/_auth/{name}")({
  component: RouteComponent,
});

function RouteComponent() {
  return <MyPage />;
}
```

### 6. Add to Shell Dependencies

```bash
pnpm --filter @dash/shell add @dash/mfe-{name}@workspace:*
```

## MFE Registry System

The shell uses a registry pattern for dynamic composition:

```typescript
// apps/shell/src/lib/mfe-registry.ts
mfeRegistry.register({
  id: "rentals",
  navigation: rentalsNavigation,  // Sidebar items
  dialogs: rentalsDialogs,        // Global dialogs
});

// Access registered items
mfeRegistry.getAllNavigation();   // Get all nav items (sorted by order)
mfeRegistry.getAllDialogs();      // Get all dialogs
mfeRegistry.getDialog("RENT_VEHICLE"); // Get specific dialog
```

## Dialog System

MFEs can register dialogs that are rendered by the shell:

```typescript
// packages/mfe-{name}/src/dialogs.ts
import type { DialogDefinition } from "@dash/mfe-types";
import { MyDialog } from "./dialogs/MyDialog";

export const dialogs: DialogDefinition[] = [
  { id: "MY_DIALOG", component: MyDialog },
];
```

Open dialogs from anywhere:

```typescript
import { useGlobalDialogStore } from "@/components/dialogs/useGlobalDialogStore";

const { openDialog } = useGlobalDialogStore();
openDialog("MY_DIALOG", { someData: "value" });
```

## Shared UI Components

Import from `@dash/shared-ui`:

```typescript
import { Button, Card, Input, Label, Dialog } from "@dash/shared-ui";
import { Form, FormField, FormItem, FormLabel } from "@dash/shared-ui";
```

## Shared Utilities

```typescript
// Class name utility
import { cn } from "@dash/shared-utils";
cn("base-class", isActive && "active-class");

// HTTP client
import { http } from "@dash/shared-utils";
const data = await http.get("/api/endpoint");
```

## Shared State

```typescript
// Auth store
import { useAuthStore } from "@dash/shared-state";
const { user, isAuthenticated, login, logout } = useAuthStore();

// Query client
import { queryClient, queryKeys } from "@dash/shared-state";
```

## Testing

```bash
# Run all tests
pnpm test

# Run tests with UI
pnpm --filter @dash/shell test:ui

# Run tests with coverage
pnpm --filter @dash/shell test:coverage

# Watch mode
pnpm --filter @dash/shell test:watch
```

## Building for Production

```bash
# Build all packages
pnpm build

# Preview production build
pnpm --filter @dash/shell preview
```

The production build output is in `apps/shell/dist/`.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI framework |
| TypeScript | 5.9.x | Type safety |
| Vite | 7.x | Build tool |
| TanStack Router | 1.x | Routing |
| TanStack Query | 5.x | Server state |
| Zustand | 5.x | Client state |
| Tailwind CSS | 4.x | Styling |
| Radix UI | Latest | Accessible primitives |
| pnpm | 9.x | Package management |
| Turborepo | 2.x | Build orchestration |

## PWA Support

The application is configured as a Progressive Web App with:
- Service worker for offline support
- App manifest for installability
- Automatic cache updates

## Additional Resources

- [TanStack Router Documentation](https://tanstack.com/router/latest)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://zustand.docs.pmnd.rs/)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
