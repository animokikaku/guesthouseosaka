import { siFacebook, siInstagram } from 'simple-icons'
import { createElement } from 'react'

export type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>

/**
 * Simple Icons (CC0-1.0) is the source for brand marks so a restyle arrives
 * with a version bump rather than a hand-copied path.
 *
 * Note the package ships one 5.2 MB barrel — v16 dropped per-icon subpaths, and
 * `simple-icons/icons` re-exports the same file. Tree-shaking does drop the
 * other ~3,400 icons, and a measured build showed no wall-time cost, but keep
 * this import to the named glyphs the footer renders.
 */
function createBrandIcon({ title, path }: { title: string; path: string }): IconComponent {
  return function BrandMark(props) {
    return createElement(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'currentColor',
        role: 'img',
        'aria-label': title,
        ...props
      },
      createElement('path', { d: path })
    )
  }
}

const FacebookIcon = createBrandIcon(siFacebook)
const InstagramIcon = createBrandIcon(siInstagram)

/**
 * Brand marks, kept out of the main registry: SiteFooter renders in the root
 * layout and `socialLink` pins it to these two via `allowedIcons`, so importing
 * the full map there would put every amenity glyph in the shared client chunk.
 */
export const brandIconMap: Record<string, IconComponent> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon
}

/** Renders a brand mark by its persisted Sanity name; null for unknown names. */
export function BrandIcon({ name, ...props }: React.SVGProps<SVGSVGElement> & { name: string }) {
  const Component = brandIconMap[name]
  if (!Component) return null
  return <Component {...props} />
}
