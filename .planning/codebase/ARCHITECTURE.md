# Architecture

**Analysis Date:** 2026-01-22

## Pattern Overview

**Overall:** Client-side SPA with file-based routing, state management via Zustand, server communication via TanStack Query (React Query)

**Key Characteristics:**
- File-based routing convention with TanStack Router
- Centralized authentication state management via Zustand with persistence
- Declarative form handling using React Hook Form + Zod validation
- Server data fetching with React Query for caching and synchronization
- Radix UI + Tailwind CSS component architecture
- Route-based authentication guards with redirect fallbacks
- Feature-scoped form validation schemas

## Layers

**Presentation Layer (Components):**
- Purpose: UI rendering and user interaction
- Location: `src/components/`, `src/pages/`
- Contains: Reusable UI components (button, card, dialog, input), page containers, feature-specific components
- Depends on: Form layer, hooks, stores, utilities
- Used by: Routes, other components

**Routing & Layout Layer:**
- Purpose: Application navigation and page layout structure
- Location: `src/routes/`
- Contains: Route definitions using TanStack Router file-based convention, layout components (root, auth layout)
- Depends on: Presentation components, store (auth context), redirect utilities
- Used by: Main application entry point

**Forms & Validation Layer:**
- Purpose: User input handling and validation
- Location: `src/forms/`, `src/components/form/`
- Contains: Form components (FormProvider, FormInput, FormSelect, FormError), schema definitions (Zod), type definitions
- Depends on: React Hook Form, Zod, UI components
- Used by: Pages, features

**State Management Layer:**
- Purpose: Application state persistence and access
- Location: `src/store/`
- Contains: Zustand stores with persistence middleware (auth state)
- Depends on: Config (user/role definitions)
- Used by: All components that need state, auth guards, routes

**Data Fetching & API Layer:**
- Purpose: Server communication and caching
- Location: `src/lib/api/`, `src/lib/react-query/`, `src/features/`
- Contains: HTTP client, query client setup, query key factory, feature-specific API hooks
- Depends on: Configuration
- Used by: Components, pages, features

**Configuration & Types Layer:**
- Purpose: Application constants and type definitions
- Location: `src/config/`, `src/types/`, `src/auth/`
- Contains: Role definitions, user fixtures, sidebar menu config, React table type augmentations, role-based auth utilities
- Depends on: Nothing (lowest level)
- Used by: All layers

**Utilities & Hooks Layer:**
- Purpose: Reusable logic and helpers
- Location: `src/lib/utils.ts`, `src/hooks/`
- Contains: Utility functions (cn for classname merging), custom hooks (useFormSubmit, usePWAInstall, useRentVehicleFilters)
- Depends on: External libraries (clsx, tailwind-merge)
- Used by: Components, forms, features

## Data Flow

**Authentication Flow:**

1. User navigates to `/login` route
2. LoginPage renders LoginForm component
3. LoginForm collects credentials and submits
4. useAuthStore.login() validates against DUMMY_USERS and updates Zustand store
5. Store persists auth state to localStorage (via persist middleware)
6. Router context receives updated isLoggedIn status
7. Protected routes (/_auth) check isLoggedIn via beforeLoad hook
8. If not logged in, router redirects to /login

**Form Submission Flow:**

1. Page (e.g., RentPage) renders Form component (e.g., RentVehicleForm)
2. Form uses useForm from React Hook Form with Zod schema resolver
3. Form validation happens on change (mode: "onChange")
4. User submits form -> handleSubmit validates against schema
5. On validation success, onSubmit callback executes
6. Errors display via FormError component with field-level error messages
7. Loading state managed via useFormSubmit hook or local state

**Data Fetching Flow:**

1. Component initializes with React Query hook
2. Query client (configured with 5min staleTime, 1 retry) manages cache
3. HTTP client (`src/lib/api/http.ts`) executes fetch with JSON headers
4. Response validated and cached; errors throw for component error boundaries
5. Component refetches on window focus or manual invalidation

**Navigation Flow:**

1. User clicks menu item or action button
2. Navigate function from TanStack Router triggers route change
3. Router matches file-based route (e.g., `/rent` -> `_auth.rent.tsx`)
4. beforeLoad hooks execute for auth/role checks
5. Component renders or redirect executes
6. Outlet renders child routes within layout

## Key Abstractions

**Router Context:**
- Purpose: Application-wide router context with auth state
- Examples: `src/routerContext.ts`, `src/router.ts`
- Pattern: TanStack Router context provider with auth.isLoggedIn flag passed to routes

**Auth Store (Zustand):**
- Purpose: Centralized authentication state with persistence
- Examples: `src/store/useAuthStore.ts`
- Pattern: Zustand store with persist middleware; exports single hook for accessing state and actions

**Form Schema:**
- Purpose: Single source of truth for form validation and TypeScript types
- Examples: `src/forms/rent/rent.schema.ts`, `src/forms/rent/rent.types.ts`
- Pattern: Zod schema defines validation rules; TypeScript type inferred from schema via z.infer

**Query Client:**
- Purpose: Centralized React Query configuration with caching strategy
- Examples: `src/lib/react-query/queryClient.ts`
- Pattern: Single QueryClient instance with default options (staleTime, retry, refetchOnWindowFocus)

**UI Component System:**
- Purpose: Reusable, styled components built on Radix UI primitives
- Examples: `src/components/ui/button.tsx`, `src/components/ui/card.tsx`
- Pattern: Class Variance Authority for variants; Tailwind for styling

## Entry Points

**Application Entry Point:**
- Location: `src/main.tsx`
- Triggers: Browser loads index.html
- Responsibilities:
  - Renders React app into DOM root
  - Wraps app with QueryClientProvider for React Query
  - Wraps RouterProvider for TanStack Router
  - Renders GlobalDialog for modals
  - Registers PWA service worker

**Root Route:**
- Location: `src/routes/__root.tsx`
- Triggers: Router initialization
- Responsibilities:
  - Renders PWAInstallBanner global component
  - Provides Outlet for child routes

**Auth Guard Layout:**
- Location: `src/routes/_auth.tsx`
- Triggers: Navigation to protected routes (/_auth/*)
- Responsibilities:
  - Validates isLoggedIn via beforeLoad hook, redirects to /login if not authenticated
  - Renders sidebar with role-based menu items
  - Renders header with user info and logout
  - Renders main content area with Outlet
  - Renders footer with legal notice

**Login Route:**
- Location: `src/routes/login.tsx`
- Triggers: Unauthenticated user navigation or redirect from /_auth
- Responsibilities:
  - Renders login page with branding and LoginForm
  - No authentication required

## Error Handling

**Strategy:** Error state management via component state with user-facing error messages

**Patterns:**
- **Form Validation Errors:** React Hook Form collects field-level errors; FormError component displays message
- **API Errors:** HTTP client throws response errors; components catch in try-catch or via error boundaries
- **Route Guards:** TanStack Router beforeLoad hook throws redirect() for auth/role failures
- **Login Failure:** LoginForm sets loginError state to display "Invalid credentials" message
- **Generic Handler:** useFormSubmit hook catches errors and displays generic fallback message ("Something went wrong. Please try again.")

## Cross-Cutting Concerns

**Logging:** console.log used for form submission data and validation errors (non-production logging)

**Validation:**
- Form-level: Zod schemas define all rules (email format, required fields, min/max length)
- UI feedback: Real-time validation on change; error messages displayed below fields

**Authentication:**
- Store-based: Zustand provides isLoggedIn flag persisted to localStorage
- Route guards: beforeLoad hooks check auth context and redirect unauthenticated users
- Role-based: ROLES enum defines access levels; sidebar menu filters items by user role

**State Persistence:** Zustand persist middleware saves auth state to localStorage under "auth-storage" key

---

*Architecture analysis: 2026-01-22*
