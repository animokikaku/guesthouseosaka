/**
 * The Worker's entry (`main` in wrangler.jsonc): a gateway that
 * picks how each request uses Workers Cache, then hands it to `Site`, the
 * entrypoint that renders the app and whose responses are cached.
 *
 * Workers Cache keys a response by its path and query string and ignores zone
 * Cache Rules, so the only place to shape the key is a gateway calling another
 * entrypoint through `ctx.exports`.
 * @see https://developers.cloudflare.com/workers/cache/cache-keys/#custom-cache-keys
 */
import { hasCookie, withoutTrackingParams, withTrackingParams } from '@/lib/cache-key'
import { DRAFT_MODE_COOKIE } from '@/sanity/lib/draft-mode.server'
import handler from '@tanstack/react-start/server-entry'
import { WorkerEntrypoint } from 'cloudflare:workers'

/**
 * Renders the app. Purges (`/api/revalidate`, the room sync) run here too,
 * which matters: a purge only reaches the cache of the entrypoint it runs in.
 */
export class Site extends WorkerEntrypoint {
  override fetch(request: Request) {
    return handler.fetch(request)
  }
}

export default {
  async fetch(request, _env, ctx) {
    // Tracking parameters are dropped before rendering, not only from the key,
    // so a cached page never carries one visitor's campaign to the next.
    const { url, tracking } = withoutTrackingParams(new URL(request.url))
    const forSite = tracking.length > 0 ? new Request(url, request) : request

    // Draft responses are never stored, but a draft-mode visitor must not be
    // served a cached published page either. Cookies aren't in the cache key,
    // so skip the cache for them instead of varying it on every cookie.
    const response = hasCookie(request.headers.get('cookie'), DRAFT_MODE_COOKIE)
      ? await ctx.exports.Site.fetch(forSite, { cache: 'no-store' })
      : await ctx.exports.Site.fetch(forSite)

    const location = response.headers.get('location')
    if (!location || tracking.length === 0) return response
    const redirect = new Response(response.body, response)
    redirect.headers.set('location', withTrackingParams(location, tracking))
    return redirect
  }
} satisfies ExportedHandler
