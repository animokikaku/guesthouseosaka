/**
 * Adds the `previews` block `wrangler preview` requires to the built Worker
 * config. Void can't carry it (its Cloudflare config migration refuses
 * `previews`), and Worker Previews don't inherit the Worker's bindings.
 *
 * Usage: bun scripts/add-preview-config.mts, after a `DEPLOY_ENV=preview` build.
 */
const configPath = 'dist/server/wrangler.json'

const config = await Bun.file(configPath).json()
config.previews = { d1_databases: config.d1_databases }
await Bun.write(configPath, JSON.stringify(config))
