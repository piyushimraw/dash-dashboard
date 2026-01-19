# Product Requirements Document: DASH Portal

## 1. Executive Summary

DASH Portal is a modern, customer-facing vehicle rental management dashboard designed for Hertz operations. The application provides a streamlined interface for rental counter employees and fleet managers to process vehicle rentals, returns, exchanges, and manage inventory across multiple locations.

Built as a Progressive Web Application (PWA), DASH Portal delivers a native app-like experience with offline capabilities, fast performance, and installability on any device. The application leverages React 19 with TypeScript for type-safe development, TanStack Router for file-based routing, and a modern design system built on Radix UI primitives.

**MVP Goal Statement:** Deliver a fully functional rental counter application that enables employees to efficiently process vehicle rentals, returns, and exchanges with real-time data synchronization and offline resilience.

---

## 2. Mission

### Product Mission Statement

To empower Hertz rental counter employees with an intuitive, fast, and reliable digital tool that streamlines vehicle rental operations, reduces transaction times, and enhances the customer service experience across all locations.

### Core Principles

1. **Speed First** - Every interaction should feel instant; transaction processing under 2 seconds
2. **Offline Resilient** - Critical operations must work without network connectivity
3. **Accessible by Default** - WCAG 2.1 AA compliant for all user interfaces
4. **Type-Safe Development** - End-to-end TypeScript for maintainability and reduced runtime errors
5. **Progressive Enhancement** - Works everywhere, enhanced where supported

---

## 3. Target Users

### Primary Personas

#### Rental Counter Agent
- **Role:** Frontline employee processing customer rentals and returns
- **Technical Comfort:** Moderate; comfortable with web applications but not technical
- **Key Needs:**
  - Quick access to rental forms
  - Real-time vehicle availability
  - Fast customer lookup
  - Offline capability for high-traffic periods
- **Pain Points:**
  - Slow legacy systems causing customer wait times
  - Multiple systems for different operations
  - Frequent connectivity issues at counters

#### Fleet Manager
- **Role:** Oversees vehicle inventory and allocation across locations
- **Technical Comfort:** Moderate to High
- **Key Needs:**
  - Dashboard view of fleet status
  - Transfer and exchange management
  - Reporting and analytics
  - Multi-location visibility
- **Pain Points:**
  - Lack of real-time inventory visibility
  - Manual tracking of vehicle transfers
  - Difficulty balancing fleet across locations

#### Location Supervisor
- **Role:** Manages day-to-day operations at a single location
- **Technical Comfort:** Moderate
- **Key Needs:**
  - Monitor employee transactions
  - Handle exceptions and escalations
  - View location-specific metrics
- **Pain Points:**
  - Limited visibility into employee activity
  - No centralized exception handling

---

## 4. MVP Scope

### In Scope

#### Core Functionality
- ✅ User authentication and session management
- ✅ Main dashboard with quick action navigation
- ✅ Vehicle rental processing (new rentals)
- ✅ Vehicle return processing
- ✅ Vehicle exchange operations
- ✅ Rented vehicles list with filtering and sorting
- ✅ Responsive sidebar navigation

#### Technical
- ✅ PWA installation and offline support
- ✅ Type-safe routing with TanStack Router
- ✅ Global state management with Zustand
- ✅ Server state caching with React Query
- ✅ Form validation with Zod schemas
- ✅ Accessible UI components via Radix UI

#### Integration
- ✅ REST API integration for rental operations
- ✅ Data persistence to localStorage for offline
- ✅ Service worker for caching strategies

#### Deployment
- ✅ Production build optimization
- ✅ PWA manifest and service worker generation
- ✅ Environment-based configuration

### Out of Scope (Future Phases)

#### Features
- ❌ Customer profile management
- ❌ Payment processing integration
- ❌ Reporting and analytics dashboard
- ❌ Multi-language support (i18n)
- ❌ Push notifications
- ❌ Real-time collaborative editing

#### Technical
- ❌ Native mobile applications
- ❌ Biometric authentication
- ❌ Offline-first conflict resolution
- ❌ Advanced search with Elasticsearch

#### Integration
- ❌ Third-party insurance APIs
- ❌ GPS/Telematics integration
- ❌ Loyalty program integration
- ❌ Email/SMS notification services

---

## 5. User Stories

### Primary User Stories

#### US-1: Employee Login
**As a** rental counter agent,
**I want to** log in with my employee credentials and location,
**So that** my transactions are associated with my account and location.

*Example:* Agent enters userId "EMP123", password, selects "JFK Airport" as both user and login location, clicks "Sign In", and is redirected to the dashboard.

---

#### US-2: Quick Access Dashboard
**As a** rental counter agent,
**I want to** see a dashboard with quick action cards,
**So that** I can immediately start the most common tasks without navigating menus.

*Example:* After login, agent sees 4 cards: "New Rental", "Process Return", "Vehicle Exchange", and "AAO". Clicking "New Rental" navigates to the rent page.

---

#### US-3: Process New Rental
**As a** rental counter agent,
**I want to** create a new vehicle rental with customer and vehicle details,
**So that** the rental is recorded and the vehicle is marked as rented.

*Example:* Agent clicks "Add New Vehicle" button, fills in Vehicle ID "VH-2024-001", Customer ID "CUST-789", selects dates and pickup location, submits form. Rental appears in the table with "Pending" status.

---

#### US-4: View Active Rentals
**As a** rental counter agent,
**I want to** view a list of all active rentals at my location,
**So that** I can quickly find information about ongoing rentals.

*Example:* Agent navigates to Rent page, sees a data table with columns for Vehicle ID, Customer ID, Rent Date, Expected Return Date, Location, and Status. Can click column headers to sort.

---

#### US-5: Process Vehicle Return
**As a** rental counter agent,
**I want to** process a vehicle return with condition notes,
**So that** the rental is closed and the vehicle is marked available.

*Example:* Agent navigates to Return page, enters rental ID, records mileage and fuel level, notes any damage, submits form. Vehicle status changes to "Available".

---

#### US-6: Sidebar Navigation
**As a** location supervisor,
**I want to** navigate to different sections via a collapsible sidebar,
**So that** I can access all application features while maximizing screen space for content.

*Example:* Supervisor clicks the hamburger menu, sidebar expands showing categories like "Counter Functions", "Inventory Management", "Admin". Clicks category to expand submenu items.

---

#### US-7: PWA Installation
**As a** rental counter agent,
**I want to** install the app on my tablet,
**So that** I can access it quickly without opening a browser.

*Example:* Agent sees "Install DASH Portal" banner on first visit, clicks "Install", app icon appears on home screen. Next time, agent taps icon and app launches in standalone mode.

---

#### US-8: Session Persistence
**As a** rental counter agent,
**I want to** stay logged in between browser sessions,
**So that** I don't have to re-authenticate every time I open the app.

*Example:* Agent logs in at 8 AM, closes browser at lunch, opens browser at 1 PM - still logged in and can continue working immediately.

---

### Technical User Stories

#### US-T1: Type-Safe Forms
**As a** developer,
**I want** forms to be validated with Zod schemas that infer TypeScript types,
**So that** form data is guaranteed to match expected shapes at compile time.

---

#### US-T2: Optimistic Updates
**As a** developer,
**I want** mutations to optimistically update the UI before server confirmation,
**So that** the interface feels instant to users.

---

## 6. Core Architecture & Patterns

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     DASH Portal (SPA)                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   Routes    │  │   Pages      │  │   Components     │   │
│  │  (TanStack) │──│  (Screens)   │──│  (Design System) │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
│         │                │                    │             │
│  ┌──────┴────────────────┴────────────────────┴──────┐     │
│  │                    Features                        │     │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │     │
│  │  │   API    │  │  Queries │  │    Mutations     │ │     │
│  │  └──────────┘  └──────────┘  └──────────────────┘ │     │
│  └───────────────────────────────────────────────────┘     │
│         │                                                   │
│  ┌──────┴──────────────────────────────────────────────┐   │
│  │                    State Layer                       │   │
│  │  ┌───────────────┐          ┌────────────────────┐  │   │
│  │  │    Zustand    │          │   React Query      │  │   │
│  │  │ (Client State)│          │  (Server State)    │  │   │
│  │  └───────────────┘          └────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│         │                                                   │
│  ┌──────┴──────────────────────────────────────────────┐   │
│  │                   Service Worker                     │   │
│  │            (PWA / Offline / Caching)                 │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   REST API      │
                    │   (Backend)     │
                    └─────────────────┘
```

### Directory Structure

```
src/
├── routes/                 # File-based routing (TanStack Router)
│   ├── __root.tsx         # Root layout wrapper
│   ├── index.tsx          # Home redirect
│   ├── login.tsx          # Public login route
│   ├── _auth.tsx          # Protected route layout
│   └── _auth.*.tsx        # Protected feature routes
│
├── pages/                  # Page-level components
│   ├── DashboardPage.tsx
│   ├── LoginPage.tsx
│   ├── RentPage.tsx
│   └── ReturnPage.tsx
│
├── components/
│   ├── ui/                # Design system primitives
│   ├── form/              # Form utilities
│   ├── dialogs/           # Modal dialog system
│   └── Sidebar.tsx        # Navigation
│
├── features/              # Feature modules
│   └── rent-vehicle/
│       ├── api.ts         # API functions
│       ├── query.ts       # React Query hooks
│       └── mutations.ts   # Mutation hooks
│
├── forms/                 # Form schemas and components
│   ├── login/
│   ├── rent/
│   └── return/
│
├── store/                 # Zustand stores
├── lib/                   # Utilities and configurations
├── hooks/                 # Custom React hooks
└── types/                 # Shared TypeScript types
```

### Key Design Patterns

#### 1. Component Composition with CVA
```typescript
const buttonVariants = cva("base-styles", {
  variants: {
    variant: { default: "...", destructive: "..." },
    size: { sm: "...", default: "...", lg: "..." }
  }
})
```

#### 2. Type-Safe Form Pattern
```typescript
// Schema defines validation AND TypeScript type
const schema = z.object({ vehicleId: z.string().min(1) })
type FormValues = z.infer<typeof schema>

// Form is fully typed
const form = useForm<FormValues>({ resolver: zodResolver(schema) })
```

#### 3. Feature Module Pattern
```typescript
// Each feature encapsulates its own API, queries, and mutations
features/rent-vehicle/
├── api.ts       // getRentedVehicles(), createRental()
├── query.ts     // useGetRentedVehicles()
└── mutations.ts // useCreateRental()
```

#### 4. Global Dialog Registry
```typescript
// Type-safe dialog opening
openDialog("RENT_VEHICLE", { customerId: "123" })
// Dialogs rendered at root level via portal
```

---

## 7. Tools/Features

### 7.1 Authentication Module

**Purpose:** Secure user authentication and session management

**Operations:**
- Login with credentials and location selection
- Session persistence via localStorage
- Automatic redirect for unauthenticated access
- Logout with session cleanup

**Key Features:**
- Split-panel login UI with Hertz branding
- Form validation with Zod
- Route guards via TanStack Router `beforeLoad`
- Persistent state with Zustand middleware

---

### 7.2 Dashboard Quick Actions

**Purpose:** Immediate access to primary workflows

**Operations:**
- Display 4 action cards for common tasks
- Navigate to feature pages on click

**Key Features:**
- Responsive grid layout (2x2 on mobile, 4x1 on desktop)
- Icon + text labeling
- Keyboard accessible

---

### 7.3 Rental Management

**Purpose:** Create and manage vehicle rentals

**Operations:**
- List active rentals in sortable data table
- Create new rental via modal form
- View rental details and status

**Key Features:**
- TanStack Table for sorting/filtering
- Status badges (Pending/Approved/Rejected)
- Modal dialog for new rental form
- Responsive table with horizontal scroll

---

### 7.4 Return Processing

**Purpose:** Process vehicle returns and close rentals

**Operations:**
- Lookup rental by ID
- Record return details (mileage, fuel, condition)
- Submit return and update vehicle status

**Key Features:**
- Form-based workflow
- Validation for required fields
- Confirmation before submission

---

### 7.5 Navigation Sidebar

**Purpose:** Access all application features

**Operations:**
- Expand/collapse sidebar
- Navigate to feature pages
- Show active page indicator

**Key Features:**
- Collapsible on desktop, drawer on mobile
- Grouped menu items by category
- Icons for visual recognition
- Keyboard navigation support

---

### 7.6 PWA Installation

**Purpose:** Native app-like experience

**Operations:**
- Prompt user to install
- Cache critical assets
- Enable offline access

**Key Features:**
- Custom install banner with dismiss option
- Service worker with Workbox strategies
- Standalone display mode
- App icons for various platforms

---

## 8. Technology Stack

### Frontend Core

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI component framework with React Compiler |
| TypeScript | ~5.9.3 | Static typing and IDE support |
| Vite | 7.2.4 | Build tool with HMR |

### Routing & State

| Technology | Version | Purpose |
|------------|---------|---------|
| TanStack Router | 1.146.2 | Type-safe file-based routing |
| Zustand | 5.0.9 | Client state management |
| TanStack Query | 5.90.17 | Server state and caching |

### UI & Styling

| Technology | Version | Purpose |
|------------|---------|---------|
| Tailwind CSS | 4.1.18 | Utility-first styling |
| Radix UI | Latest | Accessible primitives |
| Lucide React | 0.562.0 | Icon library |
| Class Variance Authority | Latest | Component variants |

### Forms & Validation

| Technology | Version | Purpose |
|------------|---------|---------|
| React Hook Form | 7.71.1 | Form state management |
| Zod | 4.3.5 | Schema validation |
| @hookform/resolvers | 5.2.2 | Zod integration |

### Development & Testing

| Technology | Version | Purpose |
|------------|---------|---------|
| Vitest | 4.0.16 | Unit testing |
| Playwright | 1.51.1 | E2E testing |
| React Testing Library | 16.3.1 | Component testing |
| ESLint | 9.39.1 | Code linting |

### Optional Dependencies

- **vite-plugin-pwa** (1.2.0) - PWA generation
- **Workbox** - Service worker strategies
- **Babel Plugin React Compiler** - Build-time optimization

---

## 9. Security & Configuration

### Authentication Approach

**Current Implementation:**
- Client-side session storage via Zustand with localStorage persistence
- Route-level protection via TanStack Router `beforeLoad` guards
- Automatic redirect to login for unauthenticated users
- Session includes: `userId`, `isLoggedIn` flag

**Future Enhancement:**
- JWT token-based authentication with backend
- Token refresh mechanism
- Role-based access control (RBAC)

### Configuration Management

**Environment Variables:**
```bash
VITE_API_BASE_URL=https://api.hertz.com
VITE_APP_VERSION=$npm_package_version
VITE_ENABLE_PWA=true
```

**Runtime Configuration:**
- React Query: 5-minute stale time, 1 retry, no refetch on focus
- PWA: Auto-update service worker registration
- localStorage key: `auth-storage`

### Security Scope

#### In Scope for MVP
- ✅ Input validation via Zod schemas
- ✅ XSS prevention via React's default escaping
- ✅ HTTPS enforcement (deployment config)
- ✅ Secure localStorage usage

#### Out of Scope for MVP
- ❌ CSRF token handling (requires backend)
- ❌ Rate limiting (requires backend)
- ❌ Audit logging (requires backend)
- ❌ Data encryption at rest

### Deployment Considerations

- Static asset hosting (Vercel, Netlify, S3+CloudFront)
- Environment-specific builds via Vite modes
- Service worker versioning for cache invalidation
- CSP headers configuration at CDN/proxy level

---

## 10. API Specification

### Base URL
```
Production: https://api.hertz.com/v1
Development: https://api-dev.hertz.com/v1
Mock: https://dummyjson.com/c/fd99-532e-4733-83a3
```

### Authentication
```
Header: Authorization: Bearer <jwt_token>
```

### Endpoints

#### GET /rentals
**Purpose:** List active rentals

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "vehicleId": "string",
      "customerId": "string",
      "rentDate": "2024-01-15T09:00:00Z",
      "expectedReturnDate": "2024-01-20T09:00:00Z",
      "pickupLocation": "string",
      "status": "pending" | "approved" | "rejected"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```

#### POST /rentals
**Purpose:** Create new rental

**Request:**
```json
{
  "vehicleId": "VH-2024-001",
  "customerId": "CUST-789",
  "rentDate": "2024-01-15T09:00:00Z",
  "expectedReturnDate": "2024-01-20T09:00:00Z",
  "pickupLocation": "JFK-TERMINAL-4"
}
```

**Response:** `201 Created` with rental object

#### POST /returns
**Purpose:** Process vehicle return

**Request:**
```json
{
  "rentalId": "RENT-123",
  "returnDate": "2024-01-19T14:30:00Z",
  "mileage": 15420,
  "fuelLevel": 0.75,
  "conditionNotes": "Minor scratch on rear bumper"
}
```

**Response:** `200 OK` with updated rental object

---

## 11. Success Criteria

### MVP Success Definition

The MVP is successful when rental counter agents can complete a full rental cycle (create rental → process return) using only the DASH Portal, with measurable improvements in transaction time and user satisfaction.

### Functional Requirements

- ✅ Users can authenticate and maintain sessions
- ✅ Dashboard displays all quick action options
- ✅ Rental form validates all required fields
- ✅ Rentals list displays with sorting capability
- ✅ Return form processes and updates status
- ✅ Navigation accessible via sidebar
- ✅ App installable as PWA on supported devices

### Quality Indicators

| Metric | Target |
|--------|--------|
| Lighthouse Performance Score | > 90 |
| Lighthouse Accessibility Score | 100 |
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Bundle Size (gzipped) | < 200KB |

### User Experience Goals

- Transaction completion without errors
- Clear feedback for all user actions
- Intuitive navigation without training
- Consistent experience across devices
- Graceful handling of network issues

---

## 12. Implementation Phases

### Phase 1: Foundation (Current)

**Goal:** Establish core architecture and authentication

**Deliverables:**
- ✅ Project scaffolding with Vite + React + TypeScript
- ✅ TanStack Router setup with file-based routing
- ✅ Design system primitives (Button, Card, Input, Dialog)
- ✅ Authentication flow with Zustand persistence
- ✅ Protected route guards
- ✅ Responsive sidebar navigation
- ✅ PWA manifest and service worker

**Validation:** User can log in, navigate sidebar, and install PWA

---

### Phase 2: Core Rental Operations

**Goal:** Implement primary rental workflows

**Deliverables:**
- ✅ Rent page with data table
- ✅ Rental creation modal form
- ✅ Return page with form
- ⬜ Backend API integration
- ⬜ React Query mutations for form submissions
- ⬜ Optimistic updates for instant feedback

**Validation:** User can create rental and process return end-to-end

---

### Phase 3: Enhanced Features

**Goal:** Complete remaining features and improve UX

**Deliverables:**
- ⬜ Vehicle exchange functionality
- ⬜ AAO feature implementation
- ⬜ Search and filtering in tables
- ⬜ Pagination for large data sets
- ⬜ Error boundary and fallback UI
- ⬜ Loading skeletons for async content

**Validation:** All sidebar navigation items functional

---

### Phase 4: Quality & Polish

**Goal:** Production readiness and testing

**Deliverables:**
- ⬜ Unit tests for utilities and hooks
- ⬜ Component tests for UI primitives
- ⬜ Integration tests for auth flow
- ⬜ E2E tests for critical user journeys
- ⬜ Performance optimization and code splitting
- ⬜ Accessibility audit and fixes
- ⬜ Documentation updates

**Validation:** All tests passing, Lighthouse scores met

---

## 13. Future Considerations

### Post-MVP Enhancements

1. **Customer Management**
   - Customer profile lookup
   - Rental history view
   - Loyalty program integration

2. **Fleet Analytics**
   - Vehicle utilization reports
   - Location performance dashboards
   - Predictive maintenance alerts

3. **Advanced Operations**
   - Multi-vehicle reservations
   - Group bookings
   - Corporate account management

### Integration Opportunities

- **Payment Gateways:** Stripe, Square for card processing
- **Insurance APIs:** Coverage verification and upselling
- **Telematics:** Real-time vehicle location and diagnostics
- **CRM Systems:** Salesforce integration for customer data

### Advanced Features

- **Real-time Updates:** WebSocket for live status changes
- **Offline-first:** Conflict resolution for offline mutations
- **Multi-language:** i18n support for international locations
- **Voice Interface:** Hands-free operation for agents

---

## 14. Risks & Mitigations

### Risk 1: Backend API Delays
**Impact:** High - Blocks core functionality
**Mitigation:** Continue development with mock APIs (dummyjson); implement API interface allowing easy swap when backend ready

### Risk 2: PWA Browser Compatibility
**Impact:** Medium - Some users may not get full PWA experience
**Mitigation:** Graceful degradation to standard web app; document minimum browser requirements

### Risk 3: Offline Data Sync Conflicts
**Impact:** Medium - Data loss or duplication possible
**Mitigation:** MVP uses online-only mutations; implement conflict resolution in future phase with user notification

### Risk 4: Performance on Low-End Devices
**Impact:** Medium - Counter tablets may have limited resources
**Mitigation:** Performance budgets enforced; regular Lighthouse audits; code splitting by route

### Risk 5: Authentication Security
**Impact:** High - Unauthorized access possible
**Mitigation:** Client-side auth is temporary MVP solution; prioritize backend JWT implementation in Phase 2

---

## 15. Appendix

### Related Documents

- `ARCHITECTURE.md` - Technical architecture documentation
- `README.md` - Developer setup guide

### Key Dependencies

| Package | Documentation |
|---------|---------------|
| TanStack Router | https://tanstack.com/router |
| TanStack Query | https://tanstack.com/query |
| Zustand | https://zustand-demo.pmnd.rs |
| React Hook Form | https://react-hook-form.com |
| Zod | https://zod.dev |
| Radix UI | https://radix-ui.com |
| Tailwind CSS | https://tailwindcss.com |
| Vite | https://vitejs.dev |

### Repository Structure

```
new-dash-ui/
├── src/                   # Application source code
├── public/                # Static assets
├── e2e/                   # Playwright E2E tests
├── index.html             # HTML entry point
├── vite.config.ts         # Build configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Dependencies and scripts
├── ARCHITECTURE.md        # Architecture documentation
├── PRD.md                 # This document
└── README.md              # Setup instructions
```

---

*Document Version: 1.0*
*Last Updated: January 2026*
*Generated with Claude Code*
