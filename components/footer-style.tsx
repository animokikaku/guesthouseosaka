type FooterStyleProps = {
  /** Make the footer a scroll-snap target from the `md` breakpoint. */
  snap?: boolean
  /** Drop the soft tint that continues the `section-soft` background. */
  plain?: boolean
}

/**
 * Page-level overrides for the site footer, as a `<style>` the page renders.
 * Leaving the page unmounts it in the navigation's commit, so a snap target
 * never outlives its page: the site snaps mandatorily, and a leftover one
 * would open the next page scrolled to the bottom.
 */
export function FooterStyle({ snap = false, plain = false }: FooterStyleProps) {
  const rules = [
    snap && '@media (width >= 48rem) { [data-slot="site-footer"] { scroll-snap-align: end; } }',
    plain && '[data-slot="site-footer"] { background-color: transparent; }'
  ].filter(Boolean)

  if (rules.length === 0) return null

  return <style>{rules.join('\n')}</style>
}
