import { env as serverEnv } from '@/env'
import { createServerFn } from '@tanstack/react-start'
import { setResponseHeader } from '@tanstack/react-start/server'
import { isDraftModeEnabled } from './draft-mode.server'

/**
 * The read token, for the draft-mode browser to listen for draft changes with
 * the Live Content API. Fetched after hydration rather than embedded in the
 * page, and only in draft mode.
 */
export const getLiveToken = createServerFn({ method: 'GET' }).handler(() => {
  setResponseHeader('Cache-Control', 'private, no-store')
  return isDraftModeEnabled() ? serverEnv.SANITY_API_READ_TOKEN : null
})
