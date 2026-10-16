import type { ComponentProps, MouseEvent } from 'react'

// Stub for the story sandbox, which runs outside Next.js's app router.
export function useRouter() {
  return { push: () => {} }
}

type Href = string | { pathname: string; params?: Record<string, string> }

type LinkProps = Omit<ComponentProps<'a'>, 'href'> & {
  href: Href
  prefetch?: boolean
  scroll?: boolean
}

/** The English path the real `Link` renders, e.g. `{ pathname: '/[house]', params: { house: 'orange' } }` → `/en/orange`. */
function localize(href: Href) {
  const pathname =
    typeof href === 'string'
      ? href
      : href.pathname.replace(/\[(\w+)\]/g, (_, name: string) => href.params?.[name] ?? '')
  return pathname === '/' ? '/en' : `/en${pathname}`
}

/**
 * Renders the localized href like the real `Link`, but stays on the page when
 * followed: there is no router to hand the navigation to, and leaving the gallery
 * would end the test.
 */
export function Link({
  href,
  prefetch: _prefetch,
  scroll: _scroll,
  onClick,
  children,
  ...props
}: LinkProps) {
  return (
    <a
      {...props}
      href={localize(href)}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event)
        event.preventDefault()
      }}
    >
      {children}
    </a>
  )
}
