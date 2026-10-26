import { createContext, use } from 'react'

/** Whether the page renders draft content, provided by the locale layout. */
export const DraftModeContext = createContext(false)

export function useIsDraftMode() {
  return use(DraftModeContext)
}
