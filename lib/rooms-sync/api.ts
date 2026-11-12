/**
 * What `/api/sync-rooms` answers, shared by the route, which builds it, and
 * the Studio's Site Settings, which parse it (see docs/rooms.md).
 */
import { HouseIdentifierValues } from '@/lib/types'
import { z } from '@/lib/zod'

const house = z.enum(HouseIdentifierValues)

/** What `POST /api/sync-rooms` answers, with 200 or 502. */
export const syncResponseSchema = z.object({
  results: z.array(
    z.union([
      z.object({
        house,
        url: z.string(),
        ok: z.literal(true),
        propertyId: z.string(),
        rooms: z.number(),
        changed: z.number()
      }),
      z.object({ house, url: z.string(), ok: z.literal(false), error: z.string() })
    ])
  ),
  purge: z.enum(['purged', 'skipped', 'failed'])
})

export type SyncResponse = z.infer<typeof syncResponseSchema>

/** How a house's sync went. */
export type SyncResult = SyncResponse['results'][number]

/**
 * What `GET /api/sync-rooms` answers: each house's last sync and its room
 * count. The Studio derives freshness from `syncedAt`, with `isFresh`.
 */
export const statusesSchema = z.object({
  houses: z.array(
    z.object({
      house,
      syncedAt: z.nullable(z.string()),
      rooms: z.number()
    })
  )
})

export type HouseStatus = z.infer<typeof statusesSchema>['houses'][number]
