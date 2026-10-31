import { ErrorPage } from '@/components/error-page'
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  return createRouter({
    routeTree,
    // Restores scroll on Back and Forward, except on the gallery pages. Their
    // grid follows the lightbox, which scrolls it to the photo it closes onto
    // (`scrollTriggerIntoView`), and history can't know where that is: Back off
    // a photo URL would return the grid to where it was when the photo opened,
    // or to a position saved on an earlier visit. The window has nothing to
    // restore there either, since both pages cover it.
    scrollRestoration: ({ location }) => !/\/(gallery|photos)$/.test(location.pathname),
    // Hovering or focusing a link loads its route's code and data; client
    // navigations then reuse that data for a minute.
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 60_000,
    defaultStaleTime: 60_000,
    defaultStructuralSharing: true,
    // Pages crossfade (see `app/globals.css`); the gallery modal opts out.
    // Search-only changes, like Back off a gallery photo URL, don't: the page
    // stays put and the lightbox animates itself. Browsers without view
    // transition types crossfade those too.
    defaultViewTransition: { types: ({ pathChanged }) => (pathChanged ? [] : false) },
    // A reload or shared link of a masked gallery modal opens the full page.
    unmaskOnReload: true,
    // Rendered inside the locale layout, which keeps the header and translations.
    defaultErrorComponent: ({ reset }) => <ErrorPage reset={reset} />
  })
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
