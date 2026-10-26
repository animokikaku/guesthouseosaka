import type { ComponentProps, MouseEvent } from 'react'

// Stub for `@tanstack/react-router` in the story sandbox, which runs without a
// router: no route params, as on the site's root page.

type LinkTarget = { to?: string; params?: Record<string, string>; hash?: string }

/** The public path the real `Link` renders, e.g. `/$locale/$house` → `/en/orange`. */
function buildHref({ to = '', params = {}, hash }: LinkTarget) {
  const path = to.replace(/\$(\w+)/g, (_, name: string) =>
    // Locales are served under their lowercase code, as `localeToPrefix` does.
    name === 'locale' ? (params.locale ?? '').toLowerCase() : (params[name] ?? '')
  )
  return hash ? `${path}#${hash}` : path
}

type LinkProps = LinkTarget &
  Omit<ComponentProps<'a'>, 'href'> & {
    mask?: LinkTarget
    preload?: unknown
    resetScroll?: unknown
    hashScrollIntoView?: unknown
    viewTransition?: unknown
  }

/**
 * Renders the href like the real `Link` (masked links show their mask), but
 * stays on the page when followed: there is no router to hand the navigation
 * to, and leaving the gallery would end the test.
 */
export function Link({
  to,
  params,
  hash,
  mask,
  preload: _preload,
  resetScroll: _resetScroll,
  hashScrollIntoView: _hashScrollIntoView,
  viewTransition: _viewTransition,
  onClick,
  children,
  ...props
}: LinkProps) {
  return (
    <a
      {...props}
      href={buildHref(mask ?? { to, params, hash })}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event)
        event.preventDefault()
      }}
    >
      {children}
    </a>
  )
}

export const linkOptions = <T,>(options: T) => options

export function useParams() {
  return {}
}

export function useMatchRoute() {
  return () => false
}

export function useNavigate() {
  return () => Promise.resolve()
}
