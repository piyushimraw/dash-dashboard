# BFF (Hono) package

This package implements a small Hono-based BFF and publishes an OpenAPI spec at `/openapi.json` (derived from `openapi.yaml`).

Useful scripts:

- `pnpm --filter @packages/bff dev` — run the Hono server in dev mode
- `pnpm --filter @packages/bff gen:types` — generate TypeScript types: writes `../mfe-types/src/generated/bff.ts` (requires `openapi-typescript`)

Notes:
- The spec is available at `http://localhost:3001/openapi.json` while the server runs.
- After running `gen:types`, rebuild `@packages/mfe-types` to pick up types.
