// @vitest-environment node

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { DatabaseSync, type SQLInputValue } from 'node:sqlite'
import type { Room } from '../room'
import {
  fetchListing,
  needsPurge,
  propertyIdOf,
  recordPurge,
  SyncError,
  syncListing,
  writeRooms
} from '../sync.server'

const URL_10333 = 'https://shares.house/a_detail/q_10333/'

/** A prepared statement of the fake below, with only what the sync uses. */
interface Statement {
  bind(...values: unknown[]): Statement
  first(): Promise<unknown>
  run(): { meta: { changes: number } }
}

/** The parts of D1's binding the sync uses, over an in-memory SQLite database with the real migrations. */
function createDatabase() {
  const sqlite = new DatabaseSync(':memory:')
  const migrations = join(__dirname, '../../../db/migrations')
  for (const file of readdirSync(migrations)
    .filter((name) => name.endsWith('.sql'))
    .toSorted()) {
    sqlite.exec(readFileSync(join(migrations, file), 'utf8'))
  }

  function statement(query: string, values: SQLInputValue[] = []): Statement {
    return {
      bind: (...next) =>
        statement(
          query,
          next.map((value) => (value === undefined ? null : (value as SQLInputValue)))
        ),
      first: async () => sqlite.prepare(query).get(...values) ?? null,
      run: () => ({
        meta: { changes: Number(sqlite.prepare(query).run(...values).changes) }
      })
    }
  }

  const db = {
    prepare: (query: string) => statement(query),
    async batch(statements: Statement[]) {
      sqlite.exec('BEGIN')
      try {
        const results = statements.map((s) => s.run())
        sqlite.exec('COMMIT')
        return results
      } catch (error) {
        sqlite.exec('ROLLBACK')
        throw error
      }
    }
  } as unknown as D1Database
  const rows = () => sqlite.prepare('SELECT * FROM rooms ORDER BY room_number').all()
  return { db, rows }
}

function room(roomNumber: string, overrides: Partial<Room> = {}): Room {
  return {
    propertyId: '1',
    roomNumber,
    status: 'occupied',
    availableFrom: null,
    areaM2: 19,
    areaTatami: null,
    rent: 50000,
    deposit: 30000,
    commonFee: 10000,
    ...overrides
  }
}

const URL_1 = 'https://shares.house/a_detail/q_1/'

describe('propertyIdOf', () => {
  it('reads the ID from Japanese and English URLs', () => {
    expect(propertyIdOf(URL_10333)).toBe('10333')
    expect(propertyIdOf('https://shares.house/a_detail/q_10333/L_en/')).toBe('10333')
  })

  it('returns null for another page', () => {
    expect(propertyIdOf('https://shares.house/')).toBeNull()
  })
})

describe('writeRooms', () => {
  it('inserts new rooms', async () => {
    const { db, rows } = createDatabase()

    await expect(
      writeRooms(db, URL_1, '1', [room('101'), room('102')], { now: 'T1' })
    ).resolves.toBe(2)
    expect(rows()).toHaveLength(2)
  })

  it('leaves unchanged rooms alone and updates changed ones', async () => {
    const { db, rows } = createDatabase()
    await writeRooms(db, URL_1, '1', [room('101'), room('102')], { now: 'T1' })

    const changed = await writeRooms(
      db,
      URL_1,
      '1',
      [room('101'), room('102', { status: 'upcoming', availableFrom: '2026-12-01' })],
      { now: 'T2' }
    )

    expect(changed).toBe(1)
    expect(rows()).toMatchObject([
      { room_number: '101', updated_at: 'T1' },
      { room_number: '102', status: 'upcoming', available_from: '2026-12-01', updated_at: 'T2' }
    ])
  })

  it('treats a value turning null as a change', async () => {
    const { db, rows } = createDatabase()
    await writeRooms(db, URL_1, '1', [room('101')], { now: 'T1' })

    await expect(
      writeRooms(db, URL_1, '1', [room('101', { deposit: null })], { now: 'T2' })
    ).resolves.toBe(1)
    expect(rows()).toMatchObject([{ deposit: null, updated_at: 'T2' }])
  })

  it('unlists rooms the listing no longer shows, and relists them when they return', async () => {
    const { db, rows } = createDatabase()
    await writeRooms(db, URL_1, '1', [room('101'), room('102'), room('103')], { now: 'T1' })

    await writeRooms(db, URL_1, '1', [room('101'), room('102')], { now: 'T2' })
    expect(rows()).toMatchObject([
      { listed: 1 },
      { listed: 1 },
      { room_number: '103', listed: 0, status: 'occupied' }
    ])

    await writeRooms(db, URL_1, '1', [room('101'), room('102'), room('103')], { now: 'T3' })
    expect(rows()).toMatchObject([{ listed: 1 }, { listed: 1 }, { listed: 1, updated_at: 'T3' }])
  })

  it('refuses a listing with fewer than half the listed rooms, and writes nothing', async () => {
    const { db, rows } = createDatabase()
    await writeRooms(db, URL_1, '1', [room('101'), room('102'), room('103')], { now: 'T1' })

    await expect(
      writeRooms(db, URL_1, '1', [room('101', { rent: 1 })], { now: 'T2' })
    ).rejects.toThrow(SyncError)
    expect(rows()).toMatchObject([{ listed: 1, rent: 50000 }, { listed: 1 }, { listed: 1 }])
  })

  it('writes a listing that shrank by half when forced', async () => {
    const { db, rows } = createDatabase()
    await writeRooms(db, URL_1, '1', [room('101'), room('102'), room('103')], { now: 'T1' })

    await writeRooms(db, URL_1, '1', [room('101')], { now: 'T2', force: true })
    expect(rows()).toMatchObject([{ listed: 1 }, { listed: 0 }, { listed: 0 }])
  })

  it('leaves other properties alone', async () => {
    const { db, rows } = createDatabase()
    await writeRooms(
      db,
      'https://shares.house/a_detail/q_2/',
      '2',
      [room('101', { propertyId: '2' })],
      { now: 'T1' }
    )

    await writeRooms(db, URL_1, '1', [room('201')], { now: 'T2' })
    expect(rows()).toMatchObject([{ property_id: '2', listed: 1 }, { property_id: '1' }])
  })

  it('rolls back every write when one fails', async () => {
    const { db, rows } = createDatabase()

    // The CHECK constraint rejects the second room.
    const bad = room('102', { status: 'gone' as never })
    await expect(writeRooms(db, URL_1, '1', [room('101'), bad], { now: 'T1' })).rejects.toThrow()
    expect(rows()).toEqual([])
  })
})

describe('syncListing', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('stores a fetched listing', async () => {
    const { db, rows } = createDatabase()
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(readFileSync(join(__dirname, 'fixtures/q_10333.html'))))
    )

    await expect(syncListing(db, URL_10333, { now: 'T1' })).resolves.toEqual({
      propertyId: '10333',
      rooms: 12,
      changed: 12
    })
    expect(rows()).toHaveLength(12)
  })

  it('keeps stored rooms when the page has changed layout', async () => {
    const { db, rows } = createDatabase()
    await writeRooms(db, URL_10333, '10333', [room('201', { propertyId: '10333' })], { now: 'T1' })
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('<html>Under maintenance</html>'))
    )

    await expect(syncListing(db, URL_10333, { now: 'T2' })).rejects.toThrow(/Failed to parse/)
    expect(rows()).toMatchObject([{ listed: 1, updated_at: 'T1' }])
  })
})

describe('fetchListing', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('retries a server error, then succeeds', async () => {
    vi.useFakeTimers()
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response('', { status: 503 }))
      .mockResolvedValueOnce(new Response('ok'))
    vi.stubGlobal('fetch', fetch)

    const html = fetchListing(URL_1)
    await vi.runAllTimersAsync()
    await expect(html).resolves.toBe('ok')
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it('gives up after three attempts', async () => {
    vi.useFakeTimers()
    const fetch = vi.fn(async () => {
      throw new TypeError('Network connection lost')
    })
    vi.stubGlobal('fetch', fetch)

    const html = fetchListing(URL_1)
    const assertion = expect(html).rejects.toThrow(SyncError)
    await vi.runAllTimersAsync()
    await assertion
    expect(fetch).toHaveBeenCalledTimes(3)
  })

  it('does not retry a missing page', async () => {
    const fetch = vi.fn(async () => new Response('', { status: 404 }))
    vi.stubGlobal('fetch', fetch)

    await expect(fetchListing(URL_1)).rejects.toThrow(SyncError)
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('reports the ray ID of a refused request', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () => new Response('', { status: 403, headers: { 'cf-ray': 'a5222c983e3100a3-KIX' } })
      )
    )

    await expect(fetchListing(URL_1)).rejects.toMatchObject({
      cause: { message: 'HTTP 403 (cf-ray a5222c983e3100a3-KIX)' }
    })
  })

  it('reports a Cloudflare challenge', async () => {
    const headers = { 'cf-ray': 'a5241e5a9c47d4a2-NRT', 'cf-mitigated': 'challenge' }
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('', { status: 403, headers }))
    )

    await expect(fetchListing(URL_1)).rejects.toMatchObject({
      cause: { message: 'HTTP 403 (cf-ray a5241e5a9c47d4a2-NRT, cf-mitigated challenge)' }
    })
  })
})

describe('needsPurge', () => {
  const MORNING = '2026-10-30T01:00:00.000Z' // 10:00 in Japan

  it('purges before any purge was recorded', async () => {
    const { db } = createDatabase()
    expect(await needsPurge(db, MORNING)).toBe(true)
  })

  it('skips when nothing changed since the last purge, the same day in Japan', async () => {
    const { db } = createDatabase()
    await writeRooms(db, URL_1, '1', [room('101')], { now: '2026-10-30T00:00:00.000Z' })
    await recordPurge(db, MORNING)
    expect(await needsPurge(db, '2026-10-30T14:59:00.000Z')).toBe(false)
  })

  it('purges when a room changed after the last purge', async () => {
    const { db } = createDatabase()
    await writeRooms(db, URL_1, '1', [room('101')], { now: '2026-10-30T00:00:00.000Z' })
    await recordPurge(db, MORNING)
    await writeRooms(db, URL_1, '1', [room('101', { status: 'available' })], {
      now: '2026-10-30T02:00:00.000Z'
    })
    expect(await needsPurge(db, '2026-10-30T02:00:01.000Z')).toBe(true)
  })

  it('purges on the first run of a new day in Japan', async () => {
    const { db } = createDatabase()
    await recordPurge(db, MORNING)
    // 00:07 on the 31st in Japan.
    expect(await needsPurge(db, '2026-10-30T15:07:00.000Z')).toBe(true)
  })

  it('keeps one row, at the latest purge', async () => {
    const { db } = createDatabase()
    await recordPurge(db, MORNING)
    await recordPurge(db, '2026-10-30T15:07:00.000Z')
    expect(await needsPurge(db, '2026-10-30T16:00:00.000Z')).toBe(false)
  })
})
