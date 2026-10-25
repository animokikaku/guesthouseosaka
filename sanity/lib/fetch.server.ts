import { cacheHeaders } from '@/lib/cache-control'
import { cached } from '@/lib/edge-cache.server'
import { env } from '@/lib/env'
import type { QueryParams } from '@sanity/client'
import { setResponseHeaders } from '@tanstack/react-start/server'
import { client } from './client'
import { getDraftPerspective, isDraftModeEnabled } from './draft-mode.server'

// The dataset is public: published content needs no token, so it comes from
// the API CDN, which Sanity invalidates as soon as a document is published.
const publishedClient = client.withConfig({ useCdn: true, perspective: 'published' })
const draftClient = client.withConfig({ useCdn: false, token: env.SANITY_API_READ_TOKEN })

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
    : // Published results are cached at the edge (see `cached`): every page
      // shares its layout's queries, so most renders skip Sanity.
      await cached(JSON.stringify([query, params]), () => publishedClient.fetch(query, params))
  return { data }
}

/** Sets {@link cacheHeaders} on a server function's response. */
export function setCacheHeaders() {
  setResponseHeaders(new Headers(cacheHeaders(isDraftModeEnabled())))
}
