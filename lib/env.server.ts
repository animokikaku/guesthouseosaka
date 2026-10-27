import { createEnv } from '@t3-oss/env-core'
import { nonEmptyString } from './env.schema'
import { z } from './zod'

/** The Worker's secrets and vars, which `nodejs_compat` exposes on `process.env`. */
export const serverEnv = createEnv({
  server: {
    SANITY_API_READ_TOKEN: nonEmptyString(),
    RESEND_API_KEY: nonEmptyString(),
    // Which Cloudflare environment this Worker is (see wrangler.jsonc).
    DEPLOY_ENV: z.optional(z.enum(['development', 'preview', 'production'])),
    TURNSTILE_SECRET_KEY: nonEmptyString(),
    // Signs Sanity's publish webhook (see `app/routes/api/revalidate.ts`).
    // Without it the webhook is refused, and published changes wait for the
    // cache to expire.
    SANITY_WEBHOOK_SECRET: z.optional(nonEmptyString())
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true
})
