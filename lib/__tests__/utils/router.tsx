import type { ComponentProps, ReactNode } from 'react'

/**
 * Stands in for `@tanstack/react-router` in unit tests, which render
 * components without a router. `Link` builds the real public href (masked
 * links show their mask, as the router does) so tests assert on the URLs
 * users see; the hooks return controllable state.
 */
export const routerState = {
  params: {} as Record<string, string>,
  pathname: '/en',
  navigate: vi.fn(),
  invalidate: vi.fn()
}

type LinkTarget = {
  to?: string
  params?: Record<string, string>
  hash?: string
}

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
    children?: ReactNode
    // Router-only props, dropped so they don't reach the DOM.
    preload?: unknown
    resetScroll?: unknown
    hashScrollIntoView?: unknown
    viewTransition?: unknown
    activeOptions?: unknown
    replace?: unknown
  }

function Link({
  to,
  params,
  hash,
  mask,
  preload: _preload,
  resetScroll: _resetScroll,
  hashScrollIntoView: _hashScrollIntoView,
  viewTransition: _viewTransition,
  activeOptions: _activeOptions,
  replace: _replace,
  children,
  ...props
}: LinkProps) {
  return (
    <a href={buildHref(mask ?? { to, params, hash })} {...props}>
      {children}
    </a>
  )
}

export const routerMock = {
  Link,
  linkOptions: <T,>(options: T) => options,
  useNavigate: () => routerState.navigate,
  useRouter: () => ({ invalidate: routerState.invalidate, navigate: routerState.navigate }),
  useParams: () => routerState.params,
  useLocation: <T,>(options?: { select?: (location: { pathname: string }) => T }) =>
    options?.select
      ? options.select({ pathname: routerState.pathname })
      : { pathname: routerState.pathname },
  useMatchRoute: () => () => false
}
