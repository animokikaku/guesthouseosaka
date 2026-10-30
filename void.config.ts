import { defineConfig } from 'void/config'

// Rooms the `guesthouseosaka-rooms` Worker syncs from shares.house, read-only
// here (see docs/rooms.md and lib/rooms.server.ts).
const roomsDb = {
  binding: 'ROOMS_DB',
  database_name: 'guesthouseosaka-rooms',
  // Must match workers/rooms/wrangler.jsonc.
  database_id: '0924c651-cb96-42e8-9789-692c06b7baef'
}

export default defineConfig({
  inference: {
    // `void/db` and its migrations (db/) use the rooms database.
    bindings: { db: 'ROOMS_DB' }
  },
  worker: {
    compatibility_date: '2026-10-25',
    // `node:async_hooks` and `node:crypto`.
    compatibility_flags: ['nodejs_compat']
  },
  cloudflare: {
    name: 'guesthouseosaka',
    account_id: '5f8fd45c341a983aff5d6b8b01f88ee1',
    // Production answers only on guesthouseosaka.com; Worker Previews keep their
    // workers.dev URLs. Attaching the custom domain fails while another DNS
    // record uses the hostname. `www` redirects here through a Cloudflare
    // Redirect Rule.
    routes: [{ pattern: 'guesthouseosaka.com', custom_domain: true }],
    workers_dev: false,
    preview_urls: true,
    // Workers Cache: Cloudflare serves responses from its cache in front of the
    // Worker, following their Cache-Control (see lib/cache-control.ts), so a
    // cached page never starts the Worker. Each deployed version starts empty.
    cache: { enabled: true },
    observability: {
      enabled: true,
      traces: { enabled: true }
    },
    // Secrets and public settings are declared in env.ts; the deployment
    // (`DEPLOY_ENV`) is built in (see vite.config.ts).
    d1_databases: [roomsDb],
    // Worker Previews (`bun run deploy:preview`) don't inherit the Worker's
    // bindings or secrets: their secrets are set with
    // `wrangler preview base-config secret put`. Only the preview build carries
    // this, since `void deploy` can't convert `previews` and refuses to deploy.
    ...(process.env.DEPLOY_ENV === 'preview' && {
      previews: { d1_databases: [roomsDb] }
    })
  }
})
