/**
 * packages/api-client/src/bff.ts
 * ----------------------------------
 * Small, typed wrappers around the BFF endpoints. These functions centralize
 * the HTTP contract used by frontend code and surface typed responses by
 * importing the generated types from `@packages/mfe-types`.
 *
 * The underlying `http` helper handles JSON content-type, error parsing, and
 * can be extended for auth, retries, or other shared concerns.
 */

import { http } from './http'
import type {
  GetRentedVehiclesResponse,
} from '@packages/mfe-types'

// Returns a typed array of rented vehicles via the BFF proxy
export const getRentedVehicles = (query?: Record<string, string | number>) => {
  const qs = query
    ? '?' +
      Object.entries(query)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join('&')
    : ''
  return http<GetRentedVehiclesResponse>(`/api/rented-vehicles${qs}`)
} 
