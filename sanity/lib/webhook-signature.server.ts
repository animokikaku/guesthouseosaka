import { createHmac, timingSafeEqual } from 'node:crypto'

/** Where Sanity signs a webhook request: `t=<timestamp in ms>,v1=<signature>`. */
export const SANITY_SIGNATURE_HEADER = 'sanity-webhook-signature'

const SIGNATURE_PATTERN = /^t=(\d+)[, ]+v1=([\w-]+)$/

/**
 * Whether `body` was signed with the webhook's secret: the signature is the
 * base64url HMAC-SHA256 of `<timestamp>.<body>`, as `@sanity/webhook` checks it.
 * Like that library it allows any timestamp; a replayed request can only purge
 * the cache again.
 * @see https://github.com/sanity-io/webhook-toolkit
 */
export function isValidSanitySignature(body: string, header: string | null, secret: string) {
  const match = SIGNATURE_PATTERN.exec(header?.trim() ?? '')
  if (!match) return false

  const [, timestamp, signature] = match
  const expected = createHmac('sha256', secret).update(`${timestamp}.${body}`).digest()
  const received = Buffer.from(signature, 'base64url')
  // Constant-time, so response timing can't reveal how much of a guess matched.
  return received.length === expected.length && timingSafeEqual(received, expected)
}
