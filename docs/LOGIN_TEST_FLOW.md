# Login Flow in Project

This document explains how the login flow works in **dev, prod, and test environments**, including integration testing with MSW.

---

## 1. Login Form

- User inputs:
  - `userId`
  - `password`
  - `userLocation`
  - `loginLocation`
- Clicks **Sign In**
- `onSubmit` is triggered, which calls `loginService`.

---

## 2. `loginService` Behavior

| Environment | Behavior |
|-------------|---------|
| **Dev / Prod** | No network call. Local check of credentials:<br>`userId === 'admin' && password === 'admin123' && userLocation && loginLocation` |
| **Test** | Calls `fetch('/api/login')`. MSW intercepts request and returns a **fake response**: 200 OK (success) or 401 Unauthorized (failure) |

---

## 3. MSW (Mock Service Worker)

- Intercepts network requests **only during tests**.
- Fake API `/api/login` returns:
  - 200 → success
  - 401 → invalid credentials
- **No real API is called**.

---

## 4. Navigation Handling

- `useNavigate()` is used to redirect after successful login.
- During tests:
  - `useNavigate` is **mocked** to prevent errors.
  - Allows testing **UI behavior** without a router context.

---

## 5. Test Flow (Integration Test)

1. Test types all required fields using `user-event`.
2. Test clicks the Sign In button → triggers `onSubmit`.
3. `loginService` is called:
   - Test mode → MSW intercepts fetch → returns 200/401
   - Dev/prod → local credentials checked
4. `LoginForm` updates state (`setLoginError`).
5. Test checks UI:
   - `await screen.findByText(/user id or password is incorrect/i)` for failure
   - Ensures error message appears/disappears as expected.

---

## 6. Summary

- **Dev / Prod:** Frontend-only login, no API call  
- **Test:** Simulates real API via MSW  
- **useNavigate:** Mocked in test to avoid errors  
- **Integration tests:** Ensure user flow works correctly, including all fields (`userId`, `password`, `userLocation`, `loginLocation`)  

