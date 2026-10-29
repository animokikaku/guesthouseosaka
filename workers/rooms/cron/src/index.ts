/**
 * Runs the rooms sync on the cron in wrangler.jsonc. shares.house refuses
 * requests from outside Japan, and a cron runs in any data center, so the sync
 * itself runs in the `guesthouseosaka-rooms` Worker, placed near Tokyo. See
 * docs/rooms.md.
 */

interface Env {
  /** The rooms Worker, through a service binding: its fetch handler runs where its `placement` says. */
  ROOMS?: { fetch(input: string, init?: RequestInit): Promise<Response> }
  /** Secret, the same as the rooms Worker's (`wrangler secret put SYNC_TOKEN`). */
  SYNC_TOKEN?: string
}

export default {
  async scheduled(_controller: unknown, env: Env) {
    const { ROOMS, SYNC_TOKEN } = env
    if (!ROOMS || !SYNC_TOKEN) throw new Error('ROOMS or SYNC_TOKEN is missing')
    // The service binding ignores the host.
    const response = await ROOMS.fetch('https://rooms/sync', {
      method: 'POST',
      headers: { Authorization: `Bearer ${SYNC_TOKEN}` }
    })
    // Marks the cron run as failed in the dashboard.
    if (!response.ok)
      throw new Error(
        `Room sync failed (HTTP ${response.status}); see the guesthouseosaka-rooms listing_sync_failed and site_purge_failed logs`
      )
  }
}
