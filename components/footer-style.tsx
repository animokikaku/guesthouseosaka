'use client'

type FooterStyleProps = {
  /** Make the footer a scroll-snap target from the `md` breakpoint. */
  snap?: boolean
  /** Drop the soft tint that continues the `section-soft` background. */
  plain?: boolean
}

/**
 * Page-level overrides for the site footer.
 *
 * Cache Components keeps visited pages in the DOM inside a hidden <Activity>,
 * where a stylesheet (or a `body:has(...)` match) would keep applying. The
 * stylesheet starts disabled, because React can also render a page straight
 * into a hidden <Activity> without attaching refs, and the ref enables it only
 * while its page is visible. The cleanup runs in the same commit as the
 * navigation, before the browser re-snaps to a footer that is still a snap
 * target and leaves the next page scrolled to the bottom.
 */
export function FooterStyle({ snap = false, plain = false }: FooterStyleProps) {
  const rules = [
    snap && '@media (width >= 48rem) { [data-slot="site-footer"] { scroll-snap-align: end; } }',
    plain && '[data-slot="site-footer"] { background-color: transparent; }'
  ].filter(Boolean)

  if (rules.length === 0) return null

  return (
    <style
      media="not all"
      ref={(style) => {
        if (!style) return
        style.media = 'all'
        return () => {
          style.media = 'not all'
        }
      }}
    >
      {rules.join('\n')}
    </style>
  )
}
