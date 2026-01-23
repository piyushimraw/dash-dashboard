# Testing Patterns

**Analysis Date:** 2026-01-22

## Test Framework

**Runner:**
- Vitest v4.0.16
- Config: Configured via `vite.config.ts` test object
- Environment: jsdom (DOM simulation for React components)
- Global functions enabled: `globals: true` (no need to import describe/it/expect)

**Assertion Library:**
- Vitest's built-in assertions
- Additional: @testing-library/jest-dom for DOM-specific matchers

**Run Commands:**
```bash
npm run test              # Run all tests once
npm run test:watch       # Watch mode - reruns tests on file changes
npm run test:ui          # Visual test UI dashboard
npm run test:coverage    # Generate coverage report
```

## Test File Organization

**Location:**
- Co-located pattern: Tests exist in `src/__tests__/` directory
- Single test file found: `LoginPage.test.tsx`
- Pattern recommendation: Either co-locate with source (`*.test.tsx` next to source) or use `__tests__` directory

**Naming:**
- Pattern: `[ComponentName].test.tsx`
- Example: `LoginPage.test.tsx` tests `LoginPage` component

**Structure:**
```
src/
├── __tests__/
│   └── LoginPage.test.tsx
├── pages/
│   └── LoginPage.tsx
└── ...
```

## Test Structure

**Suite Organization:**
```typescript
// From src/__tests__/LoginPage.test.tsx
describe("LoginPage", () => {
  it("renders login form fields", () => {
    // Test body
  });
});

describe("LoginPage Button behavior in UI", () => {
  it("keeps Sign in button disabled until both fields are filled", () => {
    // Test body
  });
});
```

**Patterns:**

**Setup Pattern:**
- No explicit beforeEach/afterEach blocks found
- Component rendering done directly in test: `render(<LoginPage />)`
- Setup file: `src/setupTests.ts` configured in `vite.config.ts`
  - Imports: `@testing-library/jest-dom` (adds DOM matchers)

**Teardown Pattern:**
- Automatic cleanup after each test via testing-library (default behavior)
- No explicit cleanup code observed

**Assertion Pattern:**
```typescript
// DOM matchers from testing-library/jest-dom
expect(screen.getByPlaceholderText("...")).toBeInTheDocument();
expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();

// State assertions
expect(signInButton).toBeDisabled();
expect(signInButton).toBeEnabled();
```

## Mocking

**Framework:** No explicit mocking library detected
- Testing Library provides: `fireEvent` for simulating user interactions
- Vitest provides: `vi` for mocking (not observed in current tests)

**Patterns:**
- User interactions: `fireEvent.change()` to simulate input changes
- Example from `LoginPage.test.tsx`:
  ```typescript
  fireEvent.change(emailInput, { target: { value: "test@test.com" } });
  ```

**What to Mock:**
- External API calls (not demonstrated in current tests)
- Zustand stores (recommendation: use `vi.mock()` for store hooks)
- Router navigation (useNavigate hook - likely needs mocking)

**What NOT to Mock:**
- React Hook Form (integration testing approach preferred)
- UI components from radix-ui (test actual behavior)
- Tailwind classes (rely on CSS classes, don't mock)

## Fixtures and Factories

**Test Data:**
- Constants defined at test file top:
  ```typescript
  const EmailPlaceHolder = "Enter your user ID";
  const PasswordPlaceHolder = "Enter your password";
  ```
- No factory pattern observed
- Recommendation: Create factory functions in separate test utilities

**Location:**
- Test constants: Inline in test file
- Recommendation: Create `src/__tests__/fixtures/` or `src/__tests__/factories/` for shared test data

## Coverage

**Requirements:** No coverage requirement enforced
- Coverage config available via npm script but not configured as CI gate
- Check coverage:
  ```bash
  npm run test:coverage
  ```

**Current State:**
- Only 1 test file found (`LoginPage.test.tsx`)
- Coverage significantly incomplete across codebase
- No coverage thresholds configured

## Test Types

**Unit Tests:**
- Scope: Component rendering and user interactions
- Approach: Integration-focused (testing rendered output, not isolated functions)
- Example: `LoginPage.test.tsx` tests form field rendering and button enable/disable behavior
- Pattern: Query DOM elements via accessible methods (getByRole, getByPlaceholderText)

**Integration Tests:**
- Scope: Form submission with validation
- Approach: Full component interaction testing
- Example from `LoginPage.test.tsx`:
  ```typescript
  it("keeps Sign in button disabled until both fields are filled", () => {
    render(<LoginPage />);
    const emailInput = screen.getByPlaceholderText(EmailPlaceHolder);
    const passwordInput = screen.getByPlaceholderText(PasswordPlaceHolder);
    const signInButton = screen.getByRole("button", { name: /sign in/i });

    expect(signInButton).toBeDisabled();
    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    expect(signInButton).toBeDisabled();
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    expect(signInButton).toBeEnabled();
  });
  ```

**E2E Tests:**
- Framework: Playwright v1.51.1 installed
- Config: Not found in current codebase
- Run command: `npm run test:e2e` and `npm run test:e2e:ui`
- Status: Not yet implemented

## Common Patterns

**Async Testing:**
- Not demonstrated in current tests
- Recommendation for async operations:
  ```typescript
  it("loads data", async () => {
    render(<Component />);
    const element = await screen.findByText("Loaded");
    expect(element).toBeInTheDocument();
  });
  ```

**Error Testing:**
- Not demonstrated in current tests
- Form validation tested implicitly (button enable/disable based on field validation)
- Recommendation:
  ```typescript
  it("shows error message on invalid input", () => {
    render(<LoginPage />);
    const emailInput = screen.getByPlaceholderText("...");
    fireEvent.change(emailInput, { target: { value: "invalid" } });
    // Check for error message display
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });
  ```

## Best Practices Observed

1. **Accessible Queries First:** Tests use `screen.getByRole()` and `screen.getByPlaceholderText()` - good accessibility-focused testing
2. **User-Centric Testing:** Tests simulate actual user workflows (filling form, clicking button)
3. **Minimal Mocking:** Direct component testing without over-mocking dependencies
4. **Clear Test Names:** Describe what the test checks, not implementation details

## Gaps and Recommendations

**Critical Gaps:**
- Limited test coverage (only 1 test file for ~4000 lines of code)
- No API mocking tests (features rely on external API calls)
- No Zustand store tests
- No form submission tests (only validation UI tested)

**Recommended Additions:**
1. Test utils setup in `src/__tests__/utils/test-utils.tsx`:
   ```typescript
   export function renderWithProviders(component) {
     // Wrap with QueryClientProvider, RouterProvider, etc.
   }
   ```
2. Fixtures directory: `src/__tests__/fixtures/` for mock data
3. API mocking via `vitest.mock()` or MSW (Mock Service Worker)
4. Store testing patterns for Zustand
5. Form submission integration tests

---

*Testing analysis: 2026-01-22*
