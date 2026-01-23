# Codebase Concerns

**Analysis Date:** 2026-01-22

## Security Issues

**Hardcoded Credentials in Source:**
- Issue: Test user credentials are stored as plaintext in `src/config/users.ts`
- Files: `src/config/users.ts`, `src/store/useAuthStore.ts`
- Impact: High - Credentials visible in version control and in production builds
- Current mitigation: None
- Recommendations:
  - Move credentials to environment variables
  - Implement real backend authentication
  - Use secure token-based auth (JWT) instead of local credential matching
  - Never commit plaintext passwords

**Insecure Local Authentication:**
- Issue: Authentication logic compares plaintext passwords client-side in `src/store/useAuthStore.ts`
- Files: `src/store/useAuthStore.ts` (lines 22-26)
- Risk: Client-side password validation provides no real security; attackers can bypass by modifying JS
- Current mitigation: None
- Recommendations:
  - Implement real backend authentication endpoint
  - Validate credentials server-side only
  - Use HTTPS for credential transmission
  - Consider OAuth/SSO for enterprise scenarios

**Console Logging of Sensitive Data:**
- Issue: Form submissions and credentials are logged to console
- Files: `src/forms/login/LoginForm.tsx` (lines 34, 40), `src/forms/rent/RentVehicleForm.tsx` (line 29), `src/forms/return/ReturnVehicleForm.tsx` (line 25)
- Risk: Sensitive user data, emails, and form values visible in browser console and logs
- Recommendations:
  - Remove `console.log()` statements from production builds
  - Use proper logging framework with log levels (only log errors, not data)
  - Never log user credentials, emails, or PII

**Missing CORS/Security Headers:**
- Issue: No apparent CORS, CSP, or security headers configuration
- Files: `vite.config.ts`
- Risk: Vulnerable to XSS, CSRF attacks; third-party script injection possible
- Recommendations:
  - Add helmet.js or similar for security headers in production
  - Configure CORS properly for API endpoints
  - Implement Content Security Policy (CSP)

**Hardcoded External API URL:**
- Issue: External API URL hardcoded in source code
- Files: `src/features/rent-vehicle/api.ts` (lines 22-25)
- Impact: API endpoint exposed; difficult to manage different environments (dev/staging/prod)
- Recommendations:
  - Move API base URL to environment variables
  - Use `import.meta.env` for Vite environment variables

## Tech Debt

**Incomplete API Integration:**
- Issue: Forms have placeholder API calls (`// API call here`)
- Files: `src/forms/rent/RentVehicleForm.tsx` (line 30), `src/forms/return/ReturnVehicleForm.tsx` (line 26)
- Impact: Forms cannot persist data; no real backend integration
- Fix approach: Implement actual API endpoints and mutation hooks using react-query

**Mock/Dummy Data in Production:**
- Issue: Using dummy JSON endpoint instead of real backend
- Files: `src/features/rent-vehicle/api.ts` (line 24)
- Impact: Application cannot function with real data; no persistence
- Fix approach:
  - Replace hardcoded URL with real API endpoint
  - Update API types to match production schema
  - Implement proper error handling for API failures

**Missing Error Handling in HTTP Client:**
- Issue: Generic error throwing without typed error responses
- Files: `src/lib/api/http.ts` (lines 12-14)
- Impact: Errors not properly handled or displayed to users; no error details propagated
- Fix approach:
  - Create custom error types
  - Parse error responses properly
  - Return typed error information to callers

**Incomplete User Information:**
- Issue: User info hardcoded in Sidebar instead of pulled from auth store
- Files: `src/components/Sidebar.tsx` (line 218)
- Impact: Hardcoded "GEHDOFF" shown regardless of logged-in user
- Fix approach: Use `useAuthStore` to get actual username/user info

**Version Number Hardcoded:**
- Issue: Application version hardcoded in Sidebar
- Files: `src/components/Sidebar.tsx` (line 189)
- Impact: Version gets out of sync; requires manual updates
- Fix approach: Move version to `package.json` and import dynamically

**Index Keys in Component Arrays:**
- Issue: Using array index as React key in maps
- Files: `src/components/Sidebar.tsx` (line 258), `src/components/reservation-lookup-components/FiltersComponent.tsx` (line 231), `src/pages/ReservationLookupPage.tsx` (line 136)
- Impact: Can cause UI bugs when data reorders or filters change
- Fix approach: Use unique identifiers from data (e.g., `item.id`) instead of index

## Performance Bottlenecks

**Large Sidebar Component:**
- Issue: `src/components/Sidebar.tsx` is 279 lines with mixed concerns (styling, navigation, auth)
- Files: `src/components/Sidebar.tsx`
- Cause: Multiple nested components and logic in one file
- Improvement path:
  - Extract SidebarMenuItem to separate file
  - Extract quick links to separate component
  - Extract user info section to separate component
  - Consider memoization for expensive renders

**Table Rendering Large Datasets:**
- Issue: ReservationLookupPage renders full table without pagination
- Files: `src/pages/ReservationLookupPage.tsx`
- Cause: All filtered data rendered at once; no pagination or virtualization
- Current capacity: Unknown (depends on dummy API response size)
- Improvement path:
  - Implement pagination in DataTable component
  - Add virtualization for large lists
  - Consider server-side filtering for large datasets
  - Add loading states during data fetch

**Missing Query Caching Strategy:**
- Issue: React Query configured with 5-minute stale time but no refetch strategy details
- Files: `src/lib/react-query/queryClient.ts`
- Impact: Stale data served if user navigates quickly between pages
- Improvement path: Adjust stale times based on data volatility

## Test Coverage Gaps

**Minimal Test Coverage:**
- Issue: Only one test file exists for entire codebase
- Files: `src/__tests__/LoginPage.test.tsx`
- What's not tested:
  - Form submissions and validation
  - API integration and error handling
  - Authorization/role-based access control
  - Table filtering and sorting
  - Dialog state management
  - Auth store mutations
- Risk: Changes to core features can break silently
- Priority: High - Add tests for critical paths

**Test File Missing Exports:**
- Issue: LoginPage export in test doesn't match actual export
- Files: `src/__tests__/LoginPage.test.tsx` (line 2)
- Cause: Test imports `{ LoginPage }` but actual file exports default
- Fix approach: Update test to use default import or update page to named export

**No Integration Tests:**
- Issue: No tests for form submission flows or API calls
- Impact: Form-to-API integration bugs won't be caught
- Recommendations:
  - Add msw (Mock Service Worker) for API mocking
  - Test form submissions end-to-end
  - Test error handling flows

**No E2E Tests:**
- Issue: Playwright configured but no test files present
- Files: No files in `e2e/` or similar
- Impact: User workflows and navigation not validated
- Recommendations:
  - Create critical user journey tests (login → rent vehicle → logout)
  - Test across different screen sizes (responsive)
  - Test offline/PWA functionality

## Fragile Areas

**Authentication Context Passing:**
- Files: `src/main.tsx`, `src/router.ts`, `src/routes/_auth.tsx`
- Why fragile:
  - Auth state passed through router context instead of React Context
  - Router context created with default `isLoggedIn: false` (line 11 in router.ts)
  - Auth state from Zustand store doesn't automatically sync to router context
  - Route protection happens in beforeLoad but context may not be updated
- Safe modification:
  - Use Context API or TanStack Router's built-in auth patterns
  - Keep single source of truth for auth state
  - Test route protection thoroughly when modifying

**Form Submission Without Validation of Results:**
- Files: `src/forms/login/LoginForm.tsx` (lines 33-42), `src/forms/rent/RentVehicleForm.tsx`, `src/forms/return/ReturnVehicleForm.tsx`
- Why fragile:
  - Login form checks credentials immediately but doesn't handle async scenarios
  - No loading state during form submission
  - Console logs errors but doesn't display to user (except login error message)
  - No retry mechanism for failures
- Safe modification:
  - Add loading states
  - Implement proper error boundaries
  - Add async mutation hooks for form submission
  - Test form flows with network latency

**Type Safety in Dialog Props:**
- Files: `src/components/dialogs/useGlobalDialogStore.ts` (line 16)
- Why fragile:
  - `DialogRegistry` uses `unknown` for props (line 23)
  - Only RENT_VEHICLE dialog defined; adding new dialogs requires manual registry updates
  - Props typing is `0?: ""` which doesn't properly represent the actual props
- Safe modification:
  - Define proper prop interfaces for each dialog type
  - Use stricter typing in DialogState
  - Test dialog opening/closing with various prop types

**Filter State Management:**
- Files: `src/hooks/useRentVehicleFilters.ts`
- Why fragile:
  - Temp filter state and global filter state can get out of sync
  - No validation of filter values (could accept invalid dates)
  - Search functionality separate from filters makes state complex
- Safe modification:
  - Consolidate temp and global filter state
  - Add validation for filter values
  - Test filter reset and apply logic thoroughly

## Missing Critical Features

**Password Reset/Recovery:**
- Problem: No mechanism to reset forgotten passwords
- Blocks: Users locked out of accounts
- Current: Hard-coded test credentials only

**User Profile Management:**
- Problem: No user profile page or settings
- Blocks: Users can't update their information
- Current: User info hardcoded in sidebar

**Proper Error Pages:**
- Problem: No 404, 500, or error boundary components
- Blocks: Users see blank pages or browser errors on failures
- Impact: Poor user experience

**Audit Logging:**
- Problem: No audit trail of user actions
- Blocks: Compliance requirements; security incident investigation
- Current: Only console.log in some places

**Offline Capability:**
- Problem: PWA registered but no offline functionality
- Blocks: App doesn't work when offline
- Current: Service worker enabled but data persists only in browser cache

## Dependencies at Risk

**Outdated Test Infrastructure:**
- Package: `vitest` ^4.0.16
- Risk: Version 4 is old; newer versions available (5.x)
- Impact: Missing bug fixes, security patches in test runner
- Migration plan: Update to latest stable vitest with compatible testing-library versions

**Babel Plugin React Compiler:**
- Package: `babel-plugin-react-compiler` ^1.0.0
- Risk: Experimental/unstable feature; frequent breaking changes expected
- Impact: Build failures on updates; compilation changes could affect behavior
- Migration plan: Monitor React compiler stability; consider disabling if causes issues

**Missing Security Updates:**
- Issue: No npm audit run detected
- Impact: Potential vulnerable dependencies in node_modules
- Recommendations:
  - Run `npm audit` regularly
  - Enable Dependabot or similar automated checks
  - Pin security-critical dependencies to specific versions

## Scaling Limits

**Client-Side Filtering:**
- Current approach: All data fetched, filtered in React
- Limit: Performance degrades with 1000+ records
- Scaling path:
  - Implement server-side pagination and filtering
  - Use GraphQL with cursor-based pagination
  - Cache filter results with React Query

**Local Storage for Auth:**
- Current capacity: Limited by browser storage (~5-10MB)
- Impact: Auth state persists across sessions but vulnerable to XSS
- Scaling path:
  - Use secure HTTP-only cookies instead
  - Implement token refresh mechanism
  - Add session expiration

**PWA Offline Storage:**
- Issue: Service worker caches but no database for offline data persistence
- Limit: Can't support complex offline scenarios
- Scaling path:
  - Implement IndexedDB for structured data
  - Use Workbox for advanced caching strategies
  - Sync queued changes when online

---

*Concerns audit: 2026-01-22*
