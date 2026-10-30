import { SITE_URL } from '@/lib/config'
import { env } from '@/lib/env'

/**
 * The site showing this Studio's dataset, for Presentation and the room sync:
 * production, or the dev server for the development Studio.
 * `SANITY_STUDIO_PREVIEW_URL` overrides it.
 */
export const siteUrl =
  process.env.SANITY_STUDIO_PREVIEW_URL ||
  (env.VITE_SANITY_DATASET === 'production' ? SITE_URL : 'http://localhost:3000')
