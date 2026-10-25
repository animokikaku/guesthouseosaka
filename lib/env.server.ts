import { createEnv } from '@t3-oss/env-core'
import { nonEmptyString } from './env.schema'
import { z } from './zod'

/** The Worker's secrets and vars, which `nodejs_compat` exposes on `process.env`. */
export const serverEnv = createEnv({
  server: {
    SANITY_API_READ_TOKEN: nonEmptyString(),
    RESEND_API_KEY: nonEmptyString(),
    // Which Cloudflare environment this Worker is (see wrangler.jsonc).
    DEPLOY_ENV: z.optional(z.enum(['development', 'preview', 'production']))
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true
})
