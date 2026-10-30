import { env as serverEnv } from '@/env'
import { validateApiPerspective, type ClientPerspective } from '@sanity/client'
import { perspectiveCookieName } from '@sanity/preview-url-secret/constants'
import { deleteCookie, getCookie, getRequest, setCookie } from '@tanstack/react-start/server'
import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Draft mode: a cookie only the server can mint, holding when it expires and a
 * signature keyed with the read token, so it can't be forged or extended.
 * Presentation sets a fresh one each time it opens the site (see
 * `/api/draft-mode/enable`), and a page loaded past half its lifetime renews it.
 */
const DRAFT_MODE_COOKIE = '__sanity_draft_mode'
const DRAFT_MODE_TTL_MS = 24 * 60 * 60 * 1000

// Keyed on use: `env` can only be read while handling a request.
function sign(expiresAt: number) {
  return createHmac('sha256', serverEnv.SANITY_API_READ_TOKEN)
    .update(`draft-mode:${expiresAt}`)
    .digest('base64url')
}

/** When the request's draft mode cookie expires, or null without a valid, unexpired one. */
function draftModeExpiry(): number | null {
  const [expiresAtText = '', signature = ''] = (getCookie(DRAFT_MODE_COOKIE) ?? '').split('.')
  const expiresAt = Number(expiresAtText)
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Date.now()) return null
  const given = Buffer.from(signature)
  const expected = Buffer.from(sign(expiresAt))
  // Constant-time, so response timing can't reveal how much of a guess matched.
  return given.length === expected.length && timingSafeEqual(given, expected) ? expiresAt : null
}

export function isDraftModeEnabled() {
  const expiresAt = draftModeExpiry()
  if (expiresAt === null) return false
  if (expiresAt - Date.now() < DRAFT_MODE_TTL_MS / 2) renewDraftMode(getRequest())
  return true
}

/**
 * Cookie options for Presentation, which loads the site in a cross-site
 * iframe: `SameSite=None` lets the cookie through, and partitioning keeps it
 * when third-party cookies are blocked.
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

function setDraftModeCookie(request: Request) {
  const expiresAt = Date.now() + DRAFT_MODE_TTL_MS
  setCookie(DRAFT_MODE_COOKIE, `${expiresAt}.${sign(expiresAt)}`, {
    ...cookieOptions(request),
    maxAge: DRAFT_MODE_TTL_MS / 1000
  })
}

/**
 * Renews the cookie on a page load only: `cookieOptions` can tell whether
 * Presentation's iframe needs it partitioned from a navigation's headers, not
 * from a server function's `fetch`.
 */
function renewDraftMode(request: Request) {
  const destination = request.headers.get('sec-fetch-dest')
  if (destination === 'document' || destination === 'iframe') setDraftModeCookie(request)
}

export function enableDraftMode(request: Request, perspective: string | undefined) {
  setDraftModeCookie(request)
  if (perspective) setCookie(perspectiveCookieName, perspective, cookieOptions(request))
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
