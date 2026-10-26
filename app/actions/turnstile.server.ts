import { serverEnv } from '@/lib/env.server'
import { z } from '@/lib/zod'

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

/** The longest token Turnstile issues; anything longer is forged. */
const MAX_TOKEN_LENGTH = 2048

const siteverifyResponseSchema = z.object({
  success: z.boolean(),
  'error-codes': z.optional(z.array(z.string()))
})

/**
 * Whether Cloudflare's Siteverify API vouches for a widget token. Anything
 * else, including a malformed token, fails; an unreachable API throws.
 * @see https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */
export async function verifyTurnstileToken(token: unknown, remoteIp?: string): Promise<boolean> {
  if (typeof token !== 'string' || token.length === 0 || token.length > MAX_TOKEN_LENGTH) {
    return false
  }

  const response = await fetch(SITEVERIFY_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      secret: serverEnv.TURNSTILE_SECRET_KEY,
      response: token,
      remoteip: remoteIp
    })
  })
  const result = siteverifyResponseSchema.parse(await response.json())
  if (!result.success) {
    console.warn('Turnstile rejected a contact form submission', result['error-codes'])
  }
  return result.success
}
