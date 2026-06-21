import * as React from 'react'

type UseStickyNavOptions = {
  /** Array of section IDs to observe for active state */
  sectionIds: string[]
  /** Scroll container ref (required for IntersectionObserver root) */
  scrollContainerRef: React.RefObject<HTMLElement | null>
}

type UseStickyNavReturn = {
  /** Whether the sticky nav should be visible (sentinel scrolled out of view) */
  isVisible: boolean
  /** Ref to attach to the sentinel element */
  sentinelRef: React.RefObject<HTMLDivElement | null>
  /** Currently active section ID */
  activeId: string | null
}

/**
 * Hook for sticky category navigation with scroll-spy.
 *
 * Uses IntersectionObserver to:
 * 1. Detect when sentinel element leaves viewport (show/hide sticky nav)
 * 2. Track which section is currently in view (for highlighting)
 */
export function useStickyNav({
  sectionIds,
  scrollContainerRef
}: UseStickyNavOptions): UseStickyNavReturn {
  const [isVisible, setIsVisible] = React.useState(false)
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const sentinelRef = React.useRef<HTMLDivElement>(null)

  // Observer for sentinel (show/hide sticky nav)
  React.useEffect(() => {
    const sentinel = sentinelRef.current
    const scrollContainer = scrollContainerRef.current
    if (!sentinel || !scrollContainer) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting)
      },
      {
        root: scrollContainer,
        threshold: 0
      }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [scrollContainerRef])

  // Observer for sections (active state tracking)
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

  return { isVisible, sentinelRef, activeId }
}
