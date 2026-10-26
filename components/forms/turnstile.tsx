import { env } from '@/lib/env'
import { useEffect, useRef, useState } from 'react'
import { useLocale } from 'use-intl'

// Loaded from Cloudflare on purpose: a proxied or cached copy breaks when they update it.
const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

interface TurnstileApi {
  render: (container: HTMLElement, options: Record<string, unknown>) => string | undefined
  getResponse: (widgetId: string) => string | undefined
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

let scriptPromise: Promise<TurnstileApi> | undefined

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  scriptPromise ??= new Promise<TurnstileApi>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_URL
    script.async = true
    script.addEventListener('load', () =>
      window.turnstile ? resolve(window.turnstile) : reject(new Error('Turnstile did not load'))
    )
    script.addEventListener('error', () => reject(new Error('Turnstile did not load')))
    document.head.append(script)
  })
  return scriptPromise
}

/** Shares the rendered widget between the widget and the submit handler. */
function createTurnstileController() {
  let widgetId: string | undefined

  return {
    setWidget: (id: string | undefined) => {
      widgetId = id
    },
    /**
     * The widget's token, if it has passed its challenge. Tokens are
     * single-use, so this also starts a fresh challenge for a retry.
     */
    takeToken: (): string | undefined => {
      if (!widgetId || !window.turnstile) return undefined
      const token = window.turnstile.getResponse(widgetId)
      window.turnstile.reset(widgetId)
      return token || undefined
    }
  }
}

export type TurnstileController = ReturnType<typeof createTurnstileController>

export function useTurnstile(): TurnstileController {
  const [controller] = useState(createTurnstileController)
  return controller
}

/**
 * Cloudflare Turnstile's bot check. It stays invisible unless Cloudflare wants
 * the visitor to tick a box, and then shows in the page's language.
 */
export function TurnstileWidget({ controller }: { controller: TurnstileController }) {
  const container = useRef<HTMLDivElement>(null)
  const locale = useLocale()
  // Takes space only once Cloudflare shows the checkbox; otherwise it's 0px tall.
  const [interactive, setInteractive] = useState(false)

  useEffect(() => {
    let widgetId: string | undefined
    let cancelled = false

    void loadTurnstile().then((turnstile) => {
      if (cancelled || !container.current) return
      widgetId = turnstile.render(container.current, {
        sitekey: env.VITE_TURNSTILE_SITE_KEY,
        // Turnstile's codes are lowercase (`zh-cn`, `zh-tw`).
        language: locale.toLowerCase(),
        appearance: 'interaction-only',
        // The token goes through `takeToken`, not a hidden form input.
        'response-field': false,
        'before-interactive-callback': () => setInteractive(true)
      })
      controller.setWidget(widgetId)
    })

    return () => {
      cancelled = true
      controller.setWidget(undefined)
      if (widgetId) window.turnstile?.remove(widgetId)
    }
  }, [controller, locale])

  // The form's field gap, which a widget inside the field group would add even while hidden.
  return <div ref={container} className={interactive ? 'mt-7' : undefined} />
}
