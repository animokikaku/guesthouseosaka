// @vitest-environment node

import { isValidSanitySignature } from '../webhook-signature.server'

const SECRET = 'webhook-secret'
const BODY = JSON.stringify({ _id: 'faqPage', _type: 'faqPage' })

/** Signs the way `@sanity/webhook` does, with Web Crypto rather than node:crypto. */
async function sign(body: string, secret: string, timestamp = Date.now()) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const digest = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(`${timestamp}.${body}`)
  )
  return `t=${timestamp},v1=${Buffer.from(digest).toString('base64url')}`
}

describe('isValidSanitySignature', () => {
  it('accepts a request signed with the secret', async () => {
    expect(isValidSanitySignature(BODY, await sign(BODY, SECRET), SECRET)).toBe(true)
  })

  it('accepts the space-separated form of the header', async () => {
    const header = (await sign(BODY, SECRET)).replace(',', ' ')
    expect(isValidSanitySignature(BODY, header, SECRET)).toBe(true)
  })

  it('rejects a body changed after signing', async () => {
    const header = await sign(BODY, SECRET)
    expect(isValidSanitySignature(BODY.replace('faqPage', 'house'), header, SECRET)).toBe(false)
  })

  it('rejects a timestamp changed after signing', async () => {
    const header = (await sign(BODY, SECRET, 1_700_000_000_000)).replace('t=17', 't=18')
    expect(isValidSanitySignature(BODY, header, SECRET)).toBe(false)
  })

  it('rejects a signature made with another secret', async () => {
    expect(isValidSanitySignature(BODY, await sign(BODY, 'other-secret'), SECRET)).toBe(false)
  })

  it.each([null, '', 'v1=abc', 't=123', 't=abc,v1=def', 't=123,v1=a+b/c='])(
    'rejects a missing or malformed header: %s',
    (header) => {
      expect(isValidSanitySignature(BODY, header, SECRET)).toBe(false)
    }
  )

  it('rejects a truncated signature', async () => {
    expect(isValidSanitySignature(BODY, (await sign(BODY, SECRET)).slice(0, -4), SECRET)).toBe(
      false
    )
  })
})
