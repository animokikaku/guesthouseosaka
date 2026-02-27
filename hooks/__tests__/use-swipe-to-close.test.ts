import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSwipeToClose } from '../use-swipe-to-close'

function createTouchEvent(x: number, y: number): React.TouchEvent {
  return {
    touches: [{ clientX: x, clientY: y }],
    changedTouches: [{ clientX: x, clientY: y }]
  } as unknown as React.TouchEvent
}

describe('useSwipeToClose', () => {
  it('calls onClose for vertical swipe down exceeding threshold', () => {
    const onClose = vi.fn()
    const { result } = renderHook(() =>
      useSwipeToClose({ onClose, threshold: 50 })
    )

    act(() => {
      result.current.onTouchStart(createTouchEvent(100, 100))
    })

    act(() => {
      result.current.onTouchEnd(createTouchEvent(100, 200)) // 100px down
    })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose for vertical swipe up exceeding threshold', () => {
    const onClose = vi.fn()
    const { result } = renderHook(() =>
      useSwipeToClose({ onClose, threshold: 50 })
    )

    act(() => {
      result.current.onTouchStart(createTouchEvent(100, 200))
    })

    act(() => {
      result.current.onTouchEnd(createTouchEvent(100, 100)) // 100px up
    })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose for horizontal swipes', () => {
    const onClose = vi.fn()
    const { result } = renderHook(() =>
      useSwipeToClose({ onClose, threshold: 50 })
    )

    act(() => {
      result.current.onTouchStart(createTouchEvent(100, 100))
    })

    act(() => {
      result.current.onTouchEnd(createTouchEvent(250, 100)) // 150px horizontal
    })

    expect(onClose).not.toHaveBeenCalled()
  })

  it('does not call onClose for swipes below threshold', () => {
    const onClose = vi.fn()
    const { result } = renderHook(() =>
      useSwipeToClose({ onClose, threshold: 50 })
    )

    act(() => {
      result.current.onTouchStart(createTouchEvent(100, 100))
    })

    act(() => {
      result.current.onTouchEnd(createTouchEvent(100, 130)) // 30px vertical
    })

    expect(onClose).not.toHaveBeenCalled()
  })

  it('uses default threshold of 50px', () => {
    const onClose = vi.fn()
    const { result } = renderHook(() => useSwipeToClose({ onClose }))

    // 51px should trigger (above default threshold)
    act(() => {
      result.current.onTouchStart(createTouchEvent(100, 100))
    })

    act(() => {
      result.current.onTouchEnd(createTouchEvent(100, 151))
    })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('respects custom threshold', () => {
    const onClose = vi.fn()
    const { result } = renderHook(() =>
      useSwipeToClose({ onClose, threshold: 100 })
    )

    // 80px should not trigger with 100px threshold
    act(() => {
      result.current.onTouchStart(createTouchEvent(100, 100))
    })

    act(() => {
      result.current.onTouchEnd(createTouchEvent(100, 180))
    })

    expect(onClose).not.toHaveBeenCalled()

    // 101px should trigger
    act(() => {
      result.current.onTouchStart(createTouchEvent(100, 100))
    })

    act(() => {
      result.current.onTouchEnd(createTouchEvent(100, 201))
    })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does nothing if onTouchEnd called without onTouchStart', () => {
    const onClose = vi.fn()
    const { result } = renderHook(() => useSwipeToClose({ onClose }))

    act(() => {
      result.current.onTouchEnd(createTouchEvent(100, 200))
    })

    expect(onClose).not.toHaveBeenCalled()
  })
})
