import * as React from 'react'

type UseStickyNavOptions = {
  /** Array of section IDs to observe for active state */
  sectionIds: string[]
  /** Scroll container ref (required for IntersectionObserver root) */
  scrollContainerRef: React.RefObject<HTMLElement | null>
}

type UseStickyNavReturn = {
  /** Currently active section ID */
  activeId: string | null
}

/**
 * Scroll-spy for the gallery category nav: tracks which category section is in
 * view within the gallery's scroll container so the nav can highlight it.
 */
export function useStickyNav({
  sectionIds,
  scrollContainerRef
}: UseStickyNavOptions): UseStickyNavReturn {
  const [activeId, setActiveId] = React.useState<string | null>(null)

  React.useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer || sectionIds.length === 0) return

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    // A callback only carries the sections whose state just changed, so the full
    // picture has to be kept here — otherwise a section going out of view leaves
    // the highlight on whichever one happened to be in that batch.
    const isIntersecting = new Map<string, boolean>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isIntersecting.set(entry.target.id, entry.isIntersecting)
        }

        const active = sectionIds.find((id) => isIntersecting.get(id))
        if (active) {
          setActiveId(active)
        }
      },
      {
        root: scrollContainer,
        // Thin band across the middle of the viewport: a category takes over only
        // once it actually occupies the centre, not the moment it peeks in.
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
      }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [scrollContainerRef, sectionIds])

  return { activeId }
}
