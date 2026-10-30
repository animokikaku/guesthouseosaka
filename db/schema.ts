// The rooms synced from shares.house (see docs/rooms.md), read and written
// through `db` from `void/db`.
// Must match db/migrations, which create every table `STRICT` (Drizzle can't
// express it).
import { sql } from 'void/db'
import { check, integer, primaryKey, real, sqliteTable, text } from 'void/schema-d1'

/**
 * The latest state of each room shares.house lists. `updatedAt` moves only when
 * a meaningful field changes; `listed` turns 0 when a complete scrape no longer
 * shows the room, which keeps its last known state.
 */
export const rooms = sqliteTable(
  'rooms',
  {
    propertyId: text('property_id').notNull(),
    roomNumber: text('room_number').notNull(),
    status: text('status', { enum: ['available', 'upcoming', 'occupied'] }).notNull(),
    availableFrom: text('available_from'),
    areaM2: real('area_m2'),
    areaTatami: real('area_tatami'),
    rent: integer('rent'),
    deposit: integer('deposit'),
    commonFee: integer('common_fee'),
    listed: integer('listed').notNull().default(1),
    updatedAt: text('updated_at').notNull()
  },
  (table) => [
    primaryKey({ columns: [table.propertyId, table.roomNumber] }),
    check('rooms_status_check', sql`${table.status} IN ('available', 'upcoming', 'occupied')`),
    check('rooms_listed_check', sql`${table.listed} IN (0, 1)`)
  ]
)

/** When each listing was last scraped successfully, so readers can tell how fresh its rooms are. */
export const properties = sqliteTable('properties', {
  propertyId: text('property_id').primaryKey(),
  url: text('url').notNull(),
  checkedAt: text('checked_at').notNull()
})

/**
 * The sync's own state, in its one row: when it last purged the cached pages
 * that show rooms (see `needsPurge`).
 */
export const syncState = sqliteTable(
  'sync_state',
  {
    id: integer('id').primaryKey(),
    purgedAt: text('purged_at').notNull()
  },
  (table) => [check('sync_state_single_row', sql`${table.id} = 1`)]
)
