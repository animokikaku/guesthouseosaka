import { env } from 'cloudflare:workers'
import { drizzle } from 'drizzle-orm/d1'

/**
 * The rooms database. Without a D1 session every query goes to the primary, so
 * a page rendered right after the sync's purge can't cache rooms from a replica
 * that hasn't caught up.
 * @see https://developers.cloudflare.com/d1/best-practices/read-replication/
 */
export const db = drizzle(env.ROOMS_DB)
