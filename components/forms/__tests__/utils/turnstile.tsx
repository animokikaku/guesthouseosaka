import { useEffect } from 'react'

export const TURNSTILE_TOKEN = 'turnstile-token'

let held: ((token: string) => void)[] | undefined

/** Keeps the next widgets from passing until the returned function is called. */
export function holdTurnstile() {
  held = []
  return () => {
    const waiting = held
    held = undefined
    waiting?.forEach((pass) => pass(TURNSTILE_TOKEN))
  }
}

/**
 * Stands in for `@marsidev/react-turnstile`, whose Cloudflare script jsdom
 * never loads: the challenge passes as soon as the widget mounts.
 */
export function Turnstile({ onSuccess }: { onSuccess?: (token: string) => void }) {
  useEffect(() => {
    if (!onSuccess) return
    if (held) held.push(onSuccess)
    else onSuccess(TURNSTILE_TOKEN)
    // Like the real widget, it answers once per mount.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}
