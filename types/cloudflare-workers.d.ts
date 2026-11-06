/// <reference types="@cloudflare/workers-types" />

// The Worker's own bindings and secrets (see wrangler.jsonc), on top of the
// Workers runtime types.
declare namespace Cloudflare {
  interface Env {
    /** Rooms synced from shares.house. */
    ROOMS_DB: D1Database

    SANITY_API_READ_TOKEN: string
    RESEND_API_KEY: string
    TURNSTILE_SECRET_KEY: string
    /**
     * Signs Sanity's publish webhook (see `app/routes/api/revalidate.ts`).
     * Unset locally, the webhook is refused.
     */
    SANITY_WEBHOOK_SECRET?: string
    /**
     * Authorizes the room sync (see `app/routes/api/sync-rooms.ts`), shared with
     * its EventBridge schedule. Worker Previews don't have it, so they refuse
     * the schedule's requests.
     */
    SYNC_TOKEN?: string
  }

  interface GlobalProps {
    /** The Worker's entry, which types `ctx.exports` (see app/worker.ts). */
    mainModule: typeof import('../app/worker')
  }
}
