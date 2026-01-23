# Coding Conventions

**Analysis Date:** 2026-01-22

## Naming Patterns

**Files:**
- Components: PascalCase (e.g., `LoginForm.tsx`, `RentVehicleForm.tsx`, `Sidebar.tsx`)
- Utilities/Helpers: camelCase (e.g., `useAuthStore.ts`, `queryKeys.ts`, `http.ts`)
- Schema/Config: camelCase with descriptive suffix (e.g., `login.schema.ts`, `rent.schema.ts`, `sidebar-menu.config.ts`)
- Type definition files: camelCase.types.ts (e.g., `rent.types.ts`, `login.types.ts`)

**Functions:**
- React components: PascalCase (e.g., `LoginForm()`, `RentVehicleForm()`, `LoginPage()`)
- Hooks: camelCase with "use" prefix (e.g., `useAuthStore()`, `useForm()`, `useQuery()`)
- Utility functions: camelCase (e.g., `cn()`, `http()`, `getRentedVehicleList()`)
- Event handlers: camelCase with "on" prefix (e.g., `onSubmit()`)

**Variables:**
- Constants: UPPER_SNAKE_CASE (e.g., `LOCATION_OPTIONS`, `ROLES`, `DUMMY_USERS`)
- Regular variables: camelCase (e.g., `methods`, `custName`, `loginError`)
- State variables: camelCase (e.g., `isLoggedIn`, `userId`, `role`)
- Form field names: camelCase (e.g., `custName`, `custEmail`, `rentDate`)

**Types:**
- Interfaces: PascalCase (e.g., `TableType`, `FilterState`, `AuthState`, `ButtonProps`)
- Type aliases: PascalCase (e.g., `RentedVehicleResponseType`, `RentVehicleFormValues`)
- Unions: PascalCase or union literal (e.g., `"Gold" | "Silver" | "Platinum"`)

## Code Style

**Formatting:**
- No explicit formatter configured (Prettier not detected)
- 2-space indentation observed throughout codebase
- Line length: ~100 characters (based on vite.config.ts style)
- Semicolons: Used consistently at end of statements
- Quotes: Double quotes for strings, except in JSX attributes where single quotes appear

**Linting:**
- ESLint with typescript-eslint enabled
- Config: `eslint.config.js` using flat config format
- Rules enforced: `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports`
- React hooks linting enabled via `eslint-plugin-react-hooks`
- React refresh linting enabled via `eslint-plugin-react-refresh`

## Import Organization

**Order:**
1. External libraries (React, third-party packages): `import React from "react"`
2. UI library imports: `import { Slot } from "@radix-ui/react-slot"`
3. CVA/styling imports: `import { cva, type VariantProps } from "class-variance-authority"`
4. Local utilities: `import { cn } from "@/lib/utils"`
5. Local components/hooks: `import FormProvider from "@/components/form/FormProvider"`
6. Relative imports: `import LoginForm from "../forms/login/LoginForm"` (for barrel files)

**Path Aliases:**
- Base alias: `@/` maps to `/src/`
- Example usage: `@/components`, `@/lib/utils`, `@/forms/login`, `@/store/useAuthStore`

## Error Handling

**Patterns:**
- Form validation errors: Handled via Zod schema validation and react-hook-form error states
- Example in `FormInput.tsx`:
  ```typescript
  const { errors } = useFormState({ name });
  const error = errors?.[name];
  ```
- API errors: Thrown directly and caught in component state
  - Example in `LoginForm.tsx`: Try-catch not shown, but login state managed with `setLoginError(true)`
- Error display: Custom `FormError` component for form-specific errors
- Generic error handling: `catch (error: any)` used in `useFormSubmit.ts` (avoid pattern - use proper typing)

## Logging

**Framework:** `console` object (no logging library detected)

**Patterns:**
- Development logging: `console.log()` used for debugging
- Examples observed:
  ```typescript
  console.log("Rent Vehicle Data:", data);
  console.log('dataonSubmit>>>>', data);
  console.log("Validation Errors:", errors);
  console.log('Wrong credentials....');
  ```
- Current state: Debug logs left in production code - should be removed or gated by env check

## Comments

**When to Comment:**
- Usage examples provided in component prop descriptions
  - Example in `FormInput.tsx`: Usage example block showing prop combinations
  - Example in `FormProvider.tsx`: Complete usage example showing integration pattern
- Implementation logic comments: Minimal; code is generally self-explanatory
- Inline comments used for non-obvious behavior
  - Example in `LoginPage.test.tsx`: Comments explaining test purpose

**JSDoc/TSDoc:**
- Not consistently used; minimal documentation at function level
- Props interfaces documented via TypeScript types only
- Example missing: `useAuthStore` has interface but no JSDoc

## Function Design

**Size:** Functions generally kept small and focused
- Components: 50-150 lines typical (e.g., `LoginForm.tsx` is 111 lines)
- Hooks: 20-40 lines (e.g., `useGetRentedVehicleList` is 9 lines)
- Utilities: 5-20 lines (e.g., `cn()` is 5 lines, `http()` is 18 lines)

**Parameters:**
- Destructured parameters in components (e.g., `FormInput` destructures all props)
- Props typed via TypeScript interfaces
- Rest parameters used for spreading props (e.g., `...options` in `http()`)

**Return Values:**
- Components return JSX.Element or ReactNode
- Hooks return custom objects or values
- Utility functions return typed values matching their purpose
  - `http()` returns generic `Promise<T>`
  - `cn()` returns string

## Module Design

**Exports:**
- Named exports for utilities and configs: `export const queryKeys = {...}`
- Default exports for React components: `export default function LoginForm()`
- Default exports for page components: `export function LoginPage()`
- Mixed pattern: Some components use `export function` (named), some use `export default function`

**Barrel Files:**
- Observed in `src/components/ui/table/index.tsx`: Re-exports from `table.tsx`
- Pattern: Central export point for component groups

## State Management

**Store Pattern:**
- Zustand used for global state (`useAuthStore.ts`)
- Hook naming: `useAuthStore` follows "use" prefix convention
- Persistence: Middleware-based with `persist()` wrapper
- Example structure:
  ```typescript
  const useAuthStore = create<AuthState>()(
    persist(
      (set) => ({
        userId: "",
        role: null,
        isLoggedIn: false,
        login: (username, password) => {...},
        logout: () => {...},
      }),
      { name: "auth-storage" }
    )
  );
  ```

## Form Handling

**Framework:** react-hook-form with Zod validation
- Schema-first approach: Define Zod schema, derive TypeScript types
- Type inference: `z.infer<typeof rentVehicleSchema>`
- Resolver pattern: `zodResolver(rentVehicleSchema)`
- Form state: `useForm()` hook with methods spread via `FormProvider`
- Validation mode: `onChange` revalidation on each input change

---

*Convention analysis: 2026-01-22*
