import type { ServerFetch } from '../fixtures/server-fetch'

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

/**
 * Answers the server's Turnstile Siteverify call with `body`. Without it, the
 * check reaches Cloudflare, whose test secret (`.env`) passes the test
 * sitekey's token.
 *
 * @see https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */
export function mockSiteverify(serverFetch: ServerFetch, body: Record<string, unknown>) {
  serverFetch.onFetch((request) =>
    request.url === SITEVERIFY_URL ? Response.json(body) : undefined
  )
}
