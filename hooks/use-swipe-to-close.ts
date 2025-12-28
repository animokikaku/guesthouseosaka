import * as React from 'react'

const DEFAULT_THRESHOLD = 50

type UseSwipeToCloseOptions = {
  onClose: () => void
  threshold?: number
}

export function useSwipeToClose({
  onClose,
  threshold = DEFAULT_THRESHOLD
}: UseSwipeToCloseOptions) {
  const [touchStart, setTouchStart] = React.useState<{
    x: number
    y: number
  } | null>(null)

  const onTouchStart = React.useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
  }, [])

  const onTouchEnd = React.useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart) return

      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchStart.x
      const deltaY = touch.clientY - touchStart.y
      const absDeltaX = Math.abs(deltaX)
      const absDeltaY = Math.abs(deltaY)

      // Close if:
      // 1. It's a downward swipe (deltaY > 0) or upward swipe (deltaY < 0)
      // 2. Vertical movement is greater than horizontal (to avoid interfering with carousel)
      // 3. The swipe is significant enough (at least threshold pixels)
      if (absDeltaY > absDeltaX && absDeltaY > threshold) {
        onClose()
      }

      setTouchStart(null)
    },
    [touchStart, threshold, onClose]
  )

  return { onTouchStart, onTouchEnd }
}
