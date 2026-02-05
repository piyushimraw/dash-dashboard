/*
 * packages/bff/src/index.ts
 * -------------------------
 * Minimal Hono-based BFF used by the frontend during development.
 * Acts as a thin proxy / aggregation layer.
 */

import { Hono } from 'hono'
import type { Context } from 'hono'
import { serve } from '@hono/node-server'
import fs from 'node:fs/promises'
import yaml from 'js-yaml'

const app = new Hono()

// -----------------------------------------------------------------------------
// Health check
// -----------------------------------------------------------------------------
app.get('/', (c: Context) => c.text('BFF (Hono) is running'))

// -----------------------------------------------------------------------------
// Proxy endpoint: rented vehicles
// -----------------------------------------------------------------------------
app.get('/api/rented-vehicles', async (c: Context) => {
  const upstream =
    process.env.RENTED_VEHICLES_URL ??
    'https://dummyjson.com/c/1394-326c-4220-88d7'

  const upstreamUrl = new URL(upstream)

  console.log('[bff] incoming /api/rented-vehicles', {
    query: c.req.query(),
  })

  // Forward query params
  for (const [key, value] of Object.entries(
    c.req.query() as Record<string, string>
  )) {
    upstreamUrl.searchParams.set(key, value)
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10_000)

    const res = await fetch(upstreamUrl.toString(), {
      signal: controller.signal,
    })

    clearTimeout(timeout)

    const bodyText = await res.text()
    const contentType = res.headers.get('content-type') ?? 'text/plain'

    console.log('[bff] upstream response', {
      url: upstreamUrl.toString(),
      status: res.status,
    })

    // ✅ Return a raw Response (proxy-safe, type-safe)
    return new Response(bodyText, {
      status: res.status,
      headers: {
        'content-type': contentType,
      },
    })
  } catch (err) {
    console.error('[bff] error fetching upstream rented vehicles', err)

    return new Response('Upstream fetch failed', {
      status: 502,
      headers: {
        'content-type': 'text/plain',
      },
    })
  }
})

// -----------------------------------------------------------------------------
// OpenAPI document endpoint
// -----------------------------------------------------------------------------
app.get('/openapi.json', async () => {
  const file = await fs.readFile(
    new URL('../openapi.yaml', import.meta.url),
    'utf8'
  )

  const doc = yaml.load(file)
  return new Response(JSON.stringify(doc), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  })
})

// -----------------------------------------------------------------------------
// Server bootstrap
// -----------------------------------------------------------------------------
const port = Number(process.env.PORT) || 3001

serve({
  fetch: app.fetch,
  port,
})

console.log(`BFF listening at http://localhost:${port}`)
