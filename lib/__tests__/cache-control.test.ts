// @vitest-environment node

import { cacheHeaders, secondsUntilTokyoMidnight } from '../cache-control'

/** An instant given as Osaka wall-clock time. */
const osaka = (dateTime: string) => Date.parse(`${dateTime}+09:00`)

describe('secondsUntilTokyoMidnight', () => {
  it.each([
    ['2026-11-27T00:00:00', 86_400],
    ['2026-11-27T08:30:00', 55_800],
    ['2026-11-27T23:00:00', 3_600],
    ['2026-11-27T23:59:59.500', 1]
  ])('counts down to the next Osaka midnight from %s', (dateTime, seconds) => {
    expect(secondsUntilTokyoMidnight(osaka(dateTime))).toBe(seconds)
  })

  // The Worker runs on UTC: 15:00 UTC is already the next day in Osaka.
  it('follows Osaka time, not UTC', () => {
    expect(secondsUntilTokyoMidnight(Date.parse('2026-11-27T15:00:00Z'))).toBe(86_400)
  })
})

describe('cacheHeaders', () => {
  // A room opening tomorrow must not keep showing as upcoming once tomorrow comes.
  it('keeps a published response at the edge only until the day it shows ends', () => {
    expect(cacheHeaders(false, osaka('2026-11-27T22:00:00'))).toEqual({
      'Cache-Control': 'public, max-age=0, s-maxage=7200',
      'Cache-Tag': 'sanity',
      Vary: 'Cookie'
    })
  })

  it('never shares a draft-mode response', () => {
    expect(cacheHeaders(true)).toEqual({ 'Cache-Control': 'private, no-store', Vary: 'Cookie' })
  })
})
