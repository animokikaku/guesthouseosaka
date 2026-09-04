import * as React from 'react'

const MOBILE_BREAKPOINT = 768
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

// `useSyncExternalStore` calls getSnapshot on every render, so this must not
// read layout: `window.innerWidth` forces a synchronous reflow, while the media
// query list reports a value the browser already holds. It also keeps the
// snapshot and the subscription on one source of truth — they previously
// disagreed, so a resize could notify without the reported value matching the
// CSS breakpoint the layout actually uses.
function mediaQuery() {
  return window.matchMedia(MOBILE_QUERY)
}

function subscribe(callback: () => void) {
  const mql = mediaQuery()
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

export function getSnapshot() {
  return mediaQuery().matches
}

export function getServerSnapshot() {
  return false
}

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
