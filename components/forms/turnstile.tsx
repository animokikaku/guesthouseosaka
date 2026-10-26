import { env } from '@/lib/env'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { useState, type RefObject } from 'react'
import { useLocale } from 'use-intl'

export type TurnstileRef = RefObject<TurnstileInstance | null>

/**
 * How long a submission waits for a challenge still in progress, including one
 * that asks the visitor to tick a box.
 */
const TOKEN_WAIT_MS = 15_000

/**
 * The widget's token, once it has passed its challenge, or `undefined` if none
 * comes in time. Tokens are single-use, so this also starts a fresh challenge
 * for a retry.
 */
export async function takeTurnstileToken(ref: TurnstileRef): Promise<string | undefined> {
  const widget = ref.current
  if (!widget) return undefined
  const token = await widget.getResponsePromise(TOKEN_WAIT_MS).catch(() => undefined)
  widget.reset()
  return token
}

/**
 * Cloudflare Turnstile's bot check. It stays invisible unless Cloudflare wants
 * the visitor to tick a box, and then shows in the page's language.
 */
export function TurnstileWidget({ ref }: { ref: TurnstileRef }) {
  const locale = useLocale()
  // Takes space only once Cloudflare shows the checkbox; otherwise it's 0px tall.
  const [interactive, setInteractive] = useState(false)

  return (
    <Turnstile
      ref={ref}
      siteKey={env.VITE_TURNSTILE_SITE_KEY}
      options={{
        // Turnstile's codes are lowercase (`zh-cn`, `zh-tw`).
        language: locale.toLowerCase(),
        appearance: 'interaction-only',
        // The token goes through `takeTurnstileToken`, not a hidden form input.
        responseField: false
      }}
      onBeforeInteractive={() => setInteractive(true)}
      // The field group's gap. The widget sits outside the group so it adds none while hidden.
      className={interactive ? 'mt-7' : undefined}
    />
  )
}
