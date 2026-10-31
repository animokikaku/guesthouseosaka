import { useEffect, useRef, useState } from 'react'

/**
 * Whether the ref'd element has come within `rootMargin` of the viewport. Turns
 * true once and stays true, for content worth loading only when it's nearly
 * on screen.
 */
export function useHasBeenNearViewport<T extends Element>(rootMargin: string) {
  const ref = useRef<T>(null)
  const [isNear, setIsNear] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNear(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold: 0 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [rootMargin])

  return [ref, isNear] as const
}
