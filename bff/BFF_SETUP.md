# BFF (Backend For Frontend) - Setup Documentation

## Overview

The BFF (Backend For Frontend) is a dedicated backend service that acts as an intermediary between the frontend applications and external APIs. It provides a unified interface for frontend clients to fetch aggregated data and handles cross-origin requests through CORS.

## Purpose

- **Data Aggregation**: Combines data from multiple external APIs into single endpoints
- **API Gateway**: Acts as a proxy for frontend applications to communicate with external services
- **CORS Management**: Handles cross-origin requests from the shell and micro-frontend applications
- **Error Handling**: Centralized error management and consistent error responses
- **Performance**: Reduces client-side logic and improves response times through server-side aggregation

## Architecture

```
┌─────────────────────────────────────────┐
│         Frontend Applications            │
│  (Shell, MFE Dashboard, MFE Rental, etc) │
└──────────────────┬──────────────────────┘
                   │
                   ▼
          ┌────────────────┐
          │      BFF       │
          │   Port 3001    │
          └────────┬───────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
   External APIs          External APIs
   (DummyJSON, etc)       (Other Services)
```

## Technology Stack

### Runtime & Framework
- **Node.js**: JavaScript runtime environment
- **Express.js** (v5.2.1): Lightweight web framework for building HTTP server
- **TypeScript** (v5.9.3): Static typing for JavaScript

### HTTP & Networking
- **Axios** (v1.13.4): Promise-based HTTP client for making external API calls
- **CORS** (v2.8.6): Middleware for handling Cross-Origin Resource Sharing

### Development Tools
- **Nodemon** (v3.1.11): Watches for file changes and auto-restarts the server
- **ts-node** (v10.9.2): Directly executes TypeScript files without compilation step
- **TypeScript** (v5.9.3): Compiles TypeScript to JavaScript

### Type Definitions
- `@types/express` (v5.0.6): Express type definitions
- `@types/cors` (v2.8.19): CORS type definitions
- `@types/node` (v25.2.0): Node.js type definitions

## File Structure

```
bff/
├── server.ts              # Main server file with all endpoints
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── BFF_SETUP.md          # This documentation
└── node_modules/         # Installed dependencies
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- pnpm or npm package manager

### Installation

1. Navigate to the bff directory:
```bash
cd bff
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

### Running the Server

**Development Mode** (with auto-reload):
```bash
pnpm dev
```

**Production Mode**:
```bash
node dist/server.js
# (after building TypeScript)
```

The server will start on **Port 3001** and log:
```
BFF running on port 3001
```

## API Endpoints

### 1. `/api/vehicles` - GET
Fetches vehicle data from external API.

**Response:**
```json
{
  "vehicles": [...]
}
```

**Error Response:**
```json
{
  "message": "Failed to fetch vehicles"
}
```

---

### 2. `/api/dashboard` - GET
Aggregates data from multiple external APIs for dashboard display.

**Response:**
```json
{
  "vehicles": [...],
  "pricing": [...],
  "availability": [...]
}
```

**Data Sources:**
- `vehicles`: https://dummyjson.com/c/1394-326c-4220-88d7
- `pricing`: https://dummyjson.com/products
- `availability`: https://dummyjson.com/users

**Error Response:**
```json
{
  "message": "Dashboard fetch failed"
}
```

## API Flow

```
Client Request
     ↓
Express Router (Port 3001)
     ↓
CORS Middleware (Allow cross-origin requests)
     ↓
Route Handler
     ↓
Axios HTTP Client
     ↓
External API Call
     ↓
Response Processing
     ↓
JSON Response to Client
```

## Features

### CORS Support
The server is configured with CORS middleware to allow requests from:
- Frontend shell application (http://localhost:5173)
- Micro-frontend applications
- Development environment

### Error Handling
- Try-catch blocks for all async operations
- HTTP 500 status code for server errors
- Consistent error response format

### Parallel Data Fetching
Uses `Promise.all()` for concurrent API calls:
- Improves performance by fetching multiple data sources simultaneously
- Future optimization: Consider `Promise.allSettled()` for partial failure handling

### JSON Parsing
- Automatic request body parsing via `express.json()` middleware
- Consistent JSON response formatting

## Configuration

### TypeScript Configuration (`tsconfig.json`)
- **Module**: CommonJS (compatible with Node.js)
- **Target**: ES2020
- **Strict Mode**: Enabled for type safety
- **ESModule Interop**: Enabled for proper import handling
- **Root Directory**: `.` (project root for TypeScript source)

### Environment
- **Port**: 3001
- **Module Type**: CommonJS
- **Node Support**: @types/node included

## Development Workflow

1. **Edit** `server.ts`
2. **Save** the file
3. **Nodemon** automatically restarts the server
4. **Test** the API using curl, Postman, or browser

Example curl request:
```bash
curl http://localhost:3001/api/vehicles
```

## Scaling & Future Improvements

### Potential Enhancements
1. **Environment Variables**: Add `.env` support for API endpoints and ports
2. **Error Handling**: Implement `Promise.allSettled()` for partial failure scenarios
3. **Caching**: Add Redis or in-memory caching for frequently accessed data
4. **Authentication**: Add JWT or OAuth2 support
5. **Rate Limiting**: Implement rate limiting for API protection
6. **Logging**: Add structured logging with Winston or Pino
7. **Testing**: Add unit and integration tests with Jest
8. **Middleware**: Add request validation and sanitization
9. **Database**: Connect to persistent data storage as needed
10. **Documentation**: Auto-generated API docs with Swagger/OpenAPI

### Monorepo Integration
- Part of the pnpm workspace
- Can be referenced by other packages
- Shares TypeScript base configuration

## Troubleshooting

### Port Already in Use
If port 3001 is in use:
```bash
# Change PORT in server.ts or use environment variable
PORT=3002 pnpm dev
```

### Module Not Found Errors
Ensure dependencies are installed:
```bash
pnpm install
```

### TypeScript Compilation Errors
Check `tsconfig.json` for correct configuration:
- `esModuleInterop` should be `true`
- `rootDir` should point to `.`

## Team Information

- **Version**: 1.0.0
- **License**: ISC
- **Type**: CommonJS module

## Related Documentation

- [Express.js Documentation](https://expressjs.com/)
- [Axios Documentation](https://axios-http.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

**Last Updated**: February 2, 2026
