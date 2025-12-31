import * as React from 'react'

type UseStickyNavOptions = {
  /** Scroll container element (required for IntersectionObserver root) */
  scrollContainer: HTMLElement | null
}

type UseStickyNavReturn = {
  /** Whether the sticky nav should be visible (sentinel scrolled out of view) */
  isVisible: boolean
  /** Ref to attach to the sentinel element */
  sentinelRef: React.RefObject<HTMLDivElement | null>
}

/**
 * Hook for sticky category navigation visibility.
 *
 * Uses IntersectionObserver to detect when a sentinel element
 * leaves the viewport (to show/hide sticky nav).
 */
export function useStickyNav({
  scrollContainer
}: UseStickyNavOptions): UseStickyNavReturn {
  const [isVisible, setIsVisible] = React.useState(false)
  const sentinelRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !scrollContainer) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky nav when sentinel is NOT intersecting (scrolled out)
        setIsVisible(!entry.isIntersecting)
      },
      {
        root: scrollContainer,
        threshold: 0
      }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [scrollContainer])

  return { isVisible, sentinelRef }
}
