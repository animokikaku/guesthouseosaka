/**
 * The Worker's secrets, declared in `wrangler.jsonc` and typed in
 * `types/cloudflare-workers.d.ts`. Locally they come from `.env`; deployed ones
 * are set with `wrangler secret put`.
 *
 * Browser code, the Studio and the component gallery read the public settings
 * through `lib/env.ts` instead, which needs no Worker.
 */
export { env } from 'cloudflare:workers'
