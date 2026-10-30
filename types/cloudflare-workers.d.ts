// The Workers runtime types, `cloudflare:workers` included, come in through
// `void/env` (see env.ts); this adds the Worker's own bindings to them.
declare namespace Cloudflare {
  interface Env {
    /** Rooms the rooms Worker syncs, read-only here (see void.config.ts). */
    ROOMS_DB: D1Database
  }
}
