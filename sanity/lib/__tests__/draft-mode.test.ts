// @vitest-environment node

const { cookies, setCookie, request } = vi.hoisted(() => ({
  cookies: new Map<string, string>(),
  setCookie: vi.fn<(name: string, value: string, options: object) => void>(),
  request: { current: new Request('https://guesthouseosaka.test/en') }
}))

vi.mock('@/env', () => ({ env: { SANITY_API_READ_TOKEN: 'read-token' } }))
vi.mock('@tanstack/react-start/server', () => ({
  getCookie: (name: string) => cookies.get(name),
  setCookie: (name: string, value: string, options: object) => {
    cookies.set(name, value)
    setCookie(name, value, options)
  },
  deleteCookie: (name: string) => cookies.delete(name),
  getRequest: () => request.current
}))

import { enableDraftMode, isDraftModeEnabled } from '../draft-mode.server'

const HOUR = 60 * 60 * 1000
const pageLoad = new Request('https://guesthouseosaka.test/en', {
  headers: { 'sec-fetch-dest': 'document' }
})
const serverFunctionCall = new Request('https://guesthouseosaka.test/_serverFn/x', {
  headers: { 'sec-fetch-dest': 'empty' }
})

beforeEach(() => {
  vi.useFakeTimers({ now: new Date('2026-11-01T00:00:00Z') })
  cookies.clear()
  setCookie.mockClear()
  request.current = pageLoad
  enableDraftMode(pageLoad, undefined)
  setCookie.mockClear()
})

afterEach(() => vi.useRealTimers())

describe('draft mode', () => {
  it('is on with the cookie the server minted', () => {
    expect(isDraftModeEnabled()).toBe(true)
  })

  it.each([
    ['no cookie', ''],
    ['a forged signature', `${Date.now() + HOUR}.forged`],
    [
      'an expiry pushed back',
      () => cookies.get('__sanity_draft_mode')!.replace(/^\d+/, '9'.repeat(15))
    ]
  ])('is off with %s', (_, value) => {
    cookies.set('__sanity_draft_mode', typeof value === 'function' ? value() : value)
    expect(isDraftModeEnabled()).toBe(false)
  })

  it('ends a day after Presentation opened the site', () => {
    vi.advanceTimersByTime(24 * HOUR)
    expect(isDraftModeEnabled()).toBe(false)
  })

  it('renews on a page load past half its lifetime', () => {
    vi.advanceTimersByTime(11 * HOUR)
    isDraftModeEnabled()
    expect(setCookie).not.toHaveBeenCalled()

    vi.advanceTimersByTime(2 * HOUR)
    isDraftModeEnabled()
    expect(setCookie).toHaveBeenCalledOnce()

    vi.advanceTimersByTime(23 * HOUR)
    expect(isDraftModeEnabled()).toBe(true)
  })

  it('leaves renewing to page loads, which tell whether the cookie needs partitioning', () => {
    request.current = serverFunctionCall
    vi.advanceTimersByTime(13 * HOUR)
    expect(isDraftModeEnabled()).toBe(true)
    expect(setCookie).not.toHaveBeenCalled()
  })
})
