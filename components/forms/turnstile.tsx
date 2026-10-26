import { env } from '@/lib/env'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { useState, type RefObject } from 'react'
import { useLocale } from 'use-intl'

export type TurnstileRef = RefObject<TurnstileInstance | null>

/**
 * The widget's token, if it has passed its challenge. Tokens are single-use,
 * so this also starts a fresh challenge for a retry.
 */
export function takeTurnstileToken(ref: TurnstileRef): string | undefined {
  const token = ref.current?.getResponse()
  ref.current?.reset()
  return token || undefined
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
