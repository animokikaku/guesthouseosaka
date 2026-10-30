import { env as serverEnv } from '@/env'
import { validateApiPerspective, type ClientPerspective } from '@sanity/client'
import { perspectiveCookieName } from '@sanity/preview-url-secret/constants'
import { deleteCookie, getCookie, setCookie } from '@tanstack/react-start/server'
import { createHash, timingSafeEqual } from 'node:crypto'

/**
 * Draft mode, as Next's `draftMode()` kept it: a cookie only the server can
 * mint, holding a value derived from the read token so it can't be forged.
 */
const DRAFT_MODE_COOKIE = '__sanity_draft_mode'

// Derived on use: `env` can only be read while handling a request.
const draftModeValue = () =>
  createHash('sha256').update(`draft-mode:${serverEnv.SANITY_API_READ_TOKEN}`).digest('hex')

export function isDraftModeEnabled() {
  const cookie = Buffer.from(getCookie(DRAFT_MODE_COOKIE) ?? '')
  const expected = Buffer.from(draftModeValue())
  // Constant-time, so response timing can't reveal how much of a guess matched.
  return cookie.length === expected.length && timingSafeEqual(cookie, expected)
}

/**
 * Cookie options for Presentation, which loads the site in a cross-site
 * iframe: `SameSite=None` lets the cookie through, and partitioning keeps it
 * when third-party cookies are blocked, as next-sanity's handler does.
 */
function cookieOptions(request: Request) {
  const secure = import.meta.env.PROD
  const partitioned =
    secure &&
    request.headers.get('sec-fetch-dest') === 'iframe' &&
    request.headers.get('sec-fetch-site') === 'cross-site'
  return {
    httpOnly: true,
    path: '/',
    secure,
    sameSite: secure ? 'none' : 'lax',
    partitioned
  } as const
}

export function enableDraftMode(request: Request, perspective: string | undefined) {
  const options = cookieOptions(request)
  setCookie(DRAFT_MODE_COOKIE, draftModeValue(), options)
  if (perspective) setCookie(perspectiveCookieName, perspective, options)
}

export function disableDraftMode(request: Request) {
  const options = cookieOptions(request)
  deleteCookie(DRAFT_MODE_COOKIE, options)
  deleteCookie(perspectiveCookieName, options)
}

/** The perspective Presentation selected: drafts, or a stack of releases. */
export function getDraftPerspective(): ClientPerspective {
  const value = getCookie(perspectiveCookieName)
  const perspective = value?.includes(',') ? value.split(',') : value
  try {
    validateApiPerspective(perspective)
    return perspective === 'raw' || perspective === undefined ? 'drafts' : perspective
  } catch {
    return 'drafts'
  }
}
