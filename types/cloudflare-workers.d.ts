// The Workers runtime APIs the server code uses. The full runtime types
// (`wrangler types`) redeclare `Request`, `caches` and other globals the
// browser code shares, so they can't sit in this single tsconfig.
declare module 'cloudflare:workers' {
  /** The Worker's bindings (see wrangler.jsonc). */
  export const env: { ROOMS_DB: import('../workers/rooms/src/d1').D1Database }

  /** Keeps the Worker alive until `promise` settles, after the response is sent. */
  export function waitUntil(promise: Promise<unknown>): void

  /**
   * The Worker's own Workers Cache, which zone-level purges don't reach.
   * @see https://developers.cloudflare.com/workers/cache/purge/
   */
  export const cache: {
    purge(
      selector: { tags?: string[]; pathPrefixes?: string[] } | { purgeEverything: true }
    ): Promise<{ success: boolean; errors: unknown[] }>
  }
}
