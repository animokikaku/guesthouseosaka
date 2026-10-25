// The one Workers runtime API the server code uses. The full runtime types
// (`wrangler types`) redeclare `Request`, `caches` and other globals the
// browser code shares, so they can't sit in this single tsconfig.
declare module 'cloudflare:workers' {
  /** Keeps the Worker alive until `promise` settles, after the response is sent. */
  export function waitUntil(promise: Promise<unknown>): void
}
