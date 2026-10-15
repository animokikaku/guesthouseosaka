/**
 * Where a CMS page action points. Editors enter either an absolute URL or an
 * internal path, optionally with a hash (`/faq#phone`, or just `#phone` for
 * the page the action sits on).
 */
export type PageActionHref =
  | { external: true; href: string }
  | { external: false; pathname: string; hash?: string }

export function resolvePageActionHref(href: string, currentPathname: string): PageActionHref {
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return { external: true, href }
  }

  const [pathname, hash] = href.split('#')
  return hash === undefined
    ? { external: false, pathname }
    : { external: false, pathname: pathname || currentPathname, hash: `#${hash}` }
}
