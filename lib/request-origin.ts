import { createIsomorphicFn } from '@tanstack/react-start'
import { getRequestUrl } from '@tanstack/react-start/server'

/**
 * The origin serving the page, for files deployed with it (like `public/`)
 * that must resolve on whichever host it runs, staging included. Canonical
 * links stay on `VITE_APP_URL`.
 */
export const getRequestOrigin = createIsomorphicFn()
  .server(() => getRequestUrl().origin)
  .client(() => window.location.origin)
