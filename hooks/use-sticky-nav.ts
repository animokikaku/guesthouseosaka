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

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => ({
            id: entry.target.id,
            top: entry.boundingClientRect.top
          }))
          .toSorted((a, b) => a.top - b.top)

        if (intersecting.length > 0) {
          setActiveId(intersecting[0].id)
        }
      },
      {
        root: scrollContainer,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
      }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [scrollContainerRef, sectionIds])

  return { activeId }
}
