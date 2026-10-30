// Relative imports and packages only: Void loads this file outside the bundler.
import { defineEnv, oneOf, string, url } from 'void/env'

/**
 * The Worker's secrets and the public settings Vite inlines, validated by Void:
 * builds check the public ones, `void deploy` checks the secrets exist on the
 * Worker, and the Worker checks each value when first read. An empty value
 * counts as unset. Locally they all come from `.env`; production secrets are
 * set with `void secret put`.
 *
 * Server code reads the secrets through `env`. Browser code, the Studio and the
 * component gallery read the public settings through `lib/env.ts`, which they
 * can build without Void.
 */
export const env = defineEnv({
  SANITY_API_READ_TOKEN: string(),
  RESEND_API_KEY: string(),
  TURNSTILE_SECRET_KEY: string(),
  // Signs Sanity's publish webhook (see `app/routes/api/revalidate.ts`).
  // Without it the webhook is refused, and published changes wait for the
  // cache to expire.
  SANITY_WEBHOOK_SECRET: string().optional(),
  // Shared with the rooms Worker (see `app/routes/api/revalidate-rooms.ts`).
  // Without it the purge is refused, and availability waits for the cache to
  // expire.
  ROOMS_REVALIDATE_SECRET: string().optional(),

  VITE_APP_URL: url().optional(),
  VITE_GOOGLE_MAPS_API_KEY: string(),
  VITE_TURNSTILE_SITE_KEY: string(),
  // Set by vite.config.ts from `DEPLOY_ENV`, never in `.env`.
  VITE_SANITY_DATASET: oneOf(['production', 'development'])
})
