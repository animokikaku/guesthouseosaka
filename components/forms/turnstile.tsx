import { env } from '@/lib/env'
import { Turnstile } from '@marsidev/react-turnstile'
import { useRef, useState } from 'react'
import { useLocale } from 'use-intl'

/** The widget's current token, which the submit button waits for and a submission spends. */
export function useTurnstileToken() {
  const [token, setTokenState] = useState<string>()
  const [widgetKey, setWidgetKey] = useState(0)
  // The submit handler may come from an earlier render, so it reads the token from here.
  const latestToken = useRef<string>(undefined)

  const setToken = (value: string | undefined) => {
    latestToken.current = value
    setTokenState(value)
  }

  return {
    token,
    widgetKey,
    setToken,
    /** Spends the token. Tokens are single-use, so this remounts the widget for a fresh challenge. */
    take: () => {
      const value = latestToken.current
      setToken(undefined)
      setWidgetKey((key) => key + 1)
      return value
    }
  }
}

export type TurnstileToken = ReturnType<typeof useTurnstileToken>

/**
 * Cloudflare Turnstile's bot check. It stays invisible unless Cloudflare wants
 * the visitor to tick a box, and then shows in the page's language.
 */
export function TurnstileWidget({ onToken }: { onToken: (token: string | undefined) => void }) {
  const locale = useLocale()
  // Takes space only once Cloudflare shows the checkbox; otherwise it's 0px tall.
  const [interactive, setInteractive] = useState(false)

  return (
    <Turnstile
      siteKey={env.VITE_TURNSTILE_SITE_KEY}
      options={{
        // Turnstile's codes are lowercase (`zh-cn`, `zh-tw`).
        language: locale.toLowerCase(),
        appearance: 'interaction-only',
        // The token goes through `onToken`, not a hidden form input.
        responseField: false
      }}
      onSuccess={onToken}
      onExpire={() => onToken(undefined)}
      onError={() => onToken(undefined)}
      onBeforeInteractive={() => setInteractive(true)}
      // The field group's gap. The widget sits outside the group so it adds none while hidden.
      className={interactive ? 'mt-7' : undefined}
    />
  )
}
