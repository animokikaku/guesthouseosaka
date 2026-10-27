import { cacheHeaders, SANITY_CACHE_TAG } from '@/lib/cache-control'
import { serverEnv } from '@/lib/env.server'
import type { QueryParams } from '@sanity/client'
import { setResponseHeaders } from '@tanstack/react-start/server'
import { cache } from 'cloudflare:workers'
import { client } from './client'
import { getDraftPerspective, isDraftModeEnabled } from './draft-mode.server'

// The dataset is public, so published content needs no token. It comes from
// the live API rather than the API CDN: Workers Cache already keeps renders
// rare, and a render that `/api/revalidate` triggers must read what was just
// published, which the API CDN may not have caught up with yet.
const publishedClient = client.withConfig({ useCdn: false, perspective: 'published' })
const draftClient = client.withConfig({ useCdn: false, token: serverEnv.SANITY_API_READ_TOKEN })

/**
 * Runs a GROQ query for the current request: published content normally, the
 * selected drafts or releases with stega encoding in draft mode, as
 * `sanityFetch` from `next-sanity/live` did.
 */
export async function sanityFetch<const QueryString extends string>({
  query,
  params = {}
}: {
  query: QueryString
  params?: QueryParams
}) {
  const data = isDraftModeEnabled()
    ? await draftClient.fetch(query, params, {
        perspective: getDraftPerspective(),
        stega: { enabled: true, studioUrl: '/studio' }
      })
    : await publishedClient.fetch(query, params)
  return { data }
}

/** Sets {@link cacheHeaders} on a server function's response. */
export function setCacheHeaders() {
  setResponseHeaders(new Headers(cacheHeaders(isDraftModeEnabled())))
}

/**
 * Drops every page and server-function response Workers Cache holds from
 * published content, everywhere, so the next request renders fresh. Async so
 * that a runtime without Workers Cache rejects rather than throwing.
 */
export async function purgePublishedResponses() {
  return cache.purge({ tags: [SANITY_CACHE_TAG] })
}
