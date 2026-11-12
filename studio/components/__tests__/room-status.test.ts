import type { HouseStatus, SyncResult } from '@/lib/rooms-sync/api'
import { describeHouse } from '../room-status'

const NOW = new Date('2026-11-02T03:00:00Z')
const AN_HOUR_AGO = '2026-11-02T02:00:00.000Z'
const THREE_DAYS_AGO = '2026-10-30T03:00:00.000Z'
const URL = 'https://shares.house/a_detail/q_10698/'

function status(syncedAt: string | null, rooms = 12): HouseStatus {
  return { house: 'orange', syncedAt, rooms }
}

function synced(changed: number): SyncResult {
  return { house: 'orange', url: URL, ok: true, propertyId: '10698', rooms: 12, changed }
}

function failed(error: string): SyncResult {
  return { house: 'orange', url: URL, ok: false, error }
}

describe('describeHouse', () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: NOW })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('gives the rooms and a green dot for a recent sync', () => {
    expect(describeHouse(status(AN_HOUR_AGO), undefined, undefined)).toEqual({
      subtitle: '12 rooms',
      dot: { ok: true, label: 'Synced', at: new Date(AN_HOUR_AGO) }
    })
  })

  it('turns the dot red once the site hides the rooms', () => {
    expect(describeHouse(status(THREE_DAYS_AGO), undefined, undefined)).toEqual({
      subtitle: '12 rooms',
      dot: { ok: false, label: 'Out of date, hidden on the site', at: new Date(THREE_DAYS_AGO) }
    })
  })

  it('says a house never synced', () => {
    expect(describeHouse(status(null, 0), undefined, undefined)).toEqual({
      subtitle: 'Not synced yet',
      dot: { ok: false, label: 'Never synced', at: null }
    })
  })

  it('adds what the sync this editor ran changed', () => {
    expect(describeHouse(status(AN_HOUR_AGO), synced(2), NOW).subtitle).toBe('12 rooms, 2 changed')
    expect(describeHouse(status(AN_HOUR_AGO), synced(0), NOW).subtitle).toBe('12 rooms, no changes')
  })

  it('gives why the sync this editor ran failed, and when', () => {
    expect(describeHouse(status(AN_HOUR_AGO), failed('Timed out'), NOW)).toEqual({
      subtitle: 'Timed out',
      dot: { ok: false, label: 'Failed', at: NOW }
    })
  })

  it('explains a refusal from outside Japan', () => {
    const { subtitle } = describeHouse(status(AN_HOUR_AGO), failed('HTTP 403'), NOW)

    expect(subtitle).toContain('It only answers from Japan')
  })

  it('drops a failure once a later sync succeeded', () => {
    const failedAt = new Date('2026-11-02T01:00:00Z')

    expect(describeHouse(status(AN_HOUR_AGO), failed('Timed out'), failedAt)).toEqual({
      subtitle: '12 rooms',
      dot: { ok: true, label: 'Synced', at: new Date(AN_HOUR_AGO) }
    })
  })
})
