import { ErrorPage } from '@/components/error-page'
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    // Hovering or focusing a link loads its route's code and data, as Next's
    // `prefetch` did; client navigations then reuse that data for a minute.
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 60_000,
    defaultStaleTime: 60_000,
    defaultStructuralSharing: true,
    // Pages crossfade (see `app/globals.css`); the gallery modal opts out.
    defaultViewTransition: true,
    // A reload or shared link of a masked gallery modal opens the full page.
    unmaskOnReload: true,
    // Rendered inside the locale layout, like Next's `[locale]/error.tsx`.
    defaultErrorComponent: ({ reset }) => <ErrorPage reset={reset} />
  })
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
