import {
  cacheHeaders,
  cacheTags,
  mergeCacheTags,
  SANITY_CACHE_TAG,
  sanityTypeTag
} from '@/lib/cache-control'
import { env as serverEnv } from '@/env'
import type { QueryParams } from '@sanity/client'
import { getResponseHeader, setResponseHeaders } from '@tanstack/react-start/server'
import { cache } from 'cloudflare:workers'
import { client } from './client'
import { getDraftPerspective, isDraftModeEnabled } from './draft-mode.server'

// The dataset is public, so published content needs no token. It comes from
// the live API rather than the API CDN: Workers Cache already keeps renders
// rare, and a render that `/api/revalidate` triggers must read what was just
// published, which the API CDN may not have caught up with yet.
const publishedClient = client.withConfig({ useCdn: false, perspective: 'published' })
// Configured on use: `env` can only be read while handling a request.
const draftClient = () =>
  client.withConfig({ useCdn: false, token: serverEnv.SANITY_API_READ_TOKEN })

/**
 * Runs a GROQ query for the current request: published content normally, the
 * selected drafts or releases with stega encoding in draft mode.
 */
export async function sanityFetch<const QueryString extends string>({
  query,
  params = {}
}: {
  query: QueryString
  params?: QueryParams
}) {
  const data = isDraftModeEnabled()
    ? await draftClient().fetch(query, params, {
        perspective: getDraftPerspective(),
        stega: { enabled: true, studioUrl: '/studio' }
      })
    : await publishedClient.fetch(query, params)
  return { data }
}

/**
 * Sets {@link cacheHeaders} on a server function's response, tagged with the
 * document `types` it reads. While a page renders, its loaders' server
 * functions share the page's response, so their tags add up: the page is
 * purged whenever any of its data is.
 */
export function setCacheHeaders(types: readonly string[], extraTags?: readonly string[]) {
  const headers = cacheHeaders(isDraftModeEnabled(), cacheTags(types, extraTags))
  if (headers['Cache-Tag']) {
    headers['Cache-Tag'] = mergeCacheTags(getResponseHeader('Cache-Tag'), headers['Cache-Tag'])
  }
  setResponseHeaders(new Headers(headers))
}

/**
 * Drops the page and server-function responses Workers Cache holds that read
 * documents of `types`, everywhere, so the next request renders fresh; every
 * published response without `types`. Async so that a runtime without Workers
 * Cache rejects rather than throwing.
 */
export async function purgePublishedResponses(types?: readonly string[]) {
  return cache.purge({ tags: types ? types.map(sanityTypeTag) : [SANITY_CACHE_TAG] })
}
