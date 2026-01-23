# Technology Stack

**Analysis Date:** 2026-01-22

## Languages

**Primary:**
- TypeScript 5.9.3 - Full application source code
- JSX/TSX - React components

**Secondary:**
- CSS 3 - Styling via Tailwind CSS

## Runtime

**Environment:**
- Node.js (version not explicitly specified in .nvmrc)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- React 19.2.0 - UI framework and rendering
- TanStack React Router 1.146.2 - Client-side routing
- TanStack React Query 5.90.17 - Server state and data fetching management

**Styling:**
- Tailwind CSS 4.1.18 - Utility-first CSS framework
- @tailwindcss/vite 4.1.18 - Vite integration for Tailwind

**Forms:**
- React Hook Form 7.71.1 - Form state management
- @hookform/resolvers 5.2.2 - Schema validation for forms
- Zod 4.3.5 - TypeScript-first schema validation

**State Management:**
- Zustand 5.0.9 - Lightweight state management

**UI Components:**
- @radix-ui/react-dialog 1.1.15 - Accessible dialog component
- @radix-ui/react-dropdown-menu 2.1.16 - Accessible dropdown menu
- @radix-ui/react-collapsible 1.1.12 - Collapsible UI primitive
- @radix-ui/react-label 2.1.8 - Form label component
- @radix-ui/react-separator 1.1.8 - Separator/divider component
- @radix-ui/react-slot 1.2.4 - Radix UI slot primitive

**Icons:**
- lucide-react 0.562.0 - Icon library

**Utilities:**
- class-variance-authority 0.7.1 - CSS class composition
- clsx 2.1.1 - Utility for conditional CSS classes
- tailwind-merge 3.4.0 - Merge Tailwind CSS classes

**PWA Support:**
- vite-plugin-pwa 1.2.0 - PWA plugin for Vite with service worker support

## Testing

**Test Runner:**
- Vitest 4.0.16 - Unit and integration test framework
- @vitest/ui 4.0.16 - Test UI dashboard
- @vitest/coverage-v8 4.0.16 - Code coverage reporting

**Assertion & Testing Utilities:**
- @testing-library/react 16.3.1 - React component testing
- @testing-library/jest-dom 6.9.1 - Extended DOM assertions
- @testing-library/user-event 14.6.1 - User interaction simulation

**E2E Testing:**
- @playwright/test 1.51.1 - End-to-end browser testing

**Environment:**
- jsdom 27.4.0 - DOM implementation for testing

## Build & Development

**Build Tool:**
- Vite 7.2.4 - Frontend build tool and dev server
- @vitejs/plugin-react 5.1.1 - Vite plugin for React with Fast Refresh

**Code Generation:**
- @tanstack/router-plugin 1.147.3 - TanStack Router file-based routing generator

**Compilation:**
- TypeScript 5.9.3 - Type checking and compilation (CLI: `tsc`)
- babel-plugin-react-compiler 1.0.0 - React compiler plugin for optimizations

**Linting:**
- ESLint 9.39.1 - Code linting
- @eslint/js 9.39.1 - ESLint JavaScript configs
- typescript-eslint 8.46.4 - TypeScript ESLint rules
- eslint-plugin-react-hooks 7.0.1 - Rules of hooks enforcement
- eslint-plugin-react-refresh 0.4.24 - React Fast Refresh rules

**Development Utilities:**
- globals 16.5.0 - Global variable definitions
- @types/node 24.10.1 - Node.js type definitions
- @types/react 19.2.5 - React type definitions
- @types/react-dom 19.2.3 - React DOM type definitions

**Animation:**
- tw-animate-css 1.4.0 - Tailwind CSS animation utilities

## Configuration

**Environment:**
- No .env file required or present
- Environment variables are not used (no process.env or import.meta.env detected)
- Configuration is hardcoded in source files

**Build:**
- `vite.config.ts` - Vite configuration with React, Tailwind, Router, and PWA plugins
- `tsconfig.json` - TypeScript project configuration with path aliases
- `tsconfig.app.json` - App-specific TypeScript config (ES2022 target, strict mode enabled)
- `eslint.config.js` - ESLint configuration with React and TypeScript rules
- `src/setupTests.ts` - Vitest setup file

**Path Aliases:**
- `@/*` maps to `./src/*` for import statements

## Platform Requirements

**Development:**
- Node.js (version unspecified, no .nvmrc file)
- npm for package management

**Production:**
- Modern web browsers with ES2022 support
- Service Worker support (for PWA functionality)
- PWA installability requirements (HTTPS, manifest, service worker)

## Scripts

**Development:**
- `npm run dev` - Start Vite dev server
- `npm run build` - Type check and build for production
- `npm run preview` - Preview production build locally

**Testing:**
- `npm test` - Run all tests once
- `npm run test:watch` - Watch mode for tests
- `npm run test:ui` - Visual test UI
- `npm run test:coverage` - Generate coverage report
- `npm run test:e2e` - Run Playwright e2e tests
- `npm run test:e2e:ui` - Playwright test UI

**Code Quality:**
- `npm run lint` - Run ESLint

---

*Stack analysis: 2026-01-22*
