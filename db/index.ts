import { env } from 'cloudflare:workers'
import { drizzle } from 'drizzle-orm/d1'

/**
 * A Drizzle client over the rooms database, in a D1 session: reads may use the
 * nearest replica, and each query sees the writes before it. Create one per
 * request, since a session can't be shared between requests.
 * @see https://developers.cloudflare.com/d1/best-practices/read-replication/
 */
export function createDb() {
  // Drizzle's type doesn't list sessions, but it only calls what they share with
  // `D1Database` (`prepare` and `batch`).
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return drizzle(env.ROOMS_DB.withSession('first-unconstrained') as unknown as D1Database)
}
