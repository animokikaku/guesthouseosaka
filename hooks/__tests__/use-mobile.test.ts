import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useIsMobile } from '../use-mobile'

describe('useIsMobile', () => {
  const originalInnerWidth = window.innerWidth
  const originalMatchMedia = window.matchMedia
  let addEventListenerSpy: ReturnType<typeof vi.fn>
  let removeEventListenerSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    addEventListenerSpy = vi.fn()
    removeEventListenerSpy = vi.fn()

    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: addEventListenerSpy,
      removeEventListener: removeEventListenerSpy
    }))
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: originalInnerWidth
    })
  })

  it('returns false initially (SSR-safe default)', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 1024 })

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(false)
  })

  it('returns true when window width < 768', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 500 })

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(true)
  })

  it('returns false when window width >= 768', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 1024 })

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(false)
  })

  it('registers change event listener on mount', () => {
    renderHook(() => useIsMobile())

    expect(addEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('removes event listener on unmount', () => {
    const { unmount } = renderHook(() => useIsMobile())

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function))
  })
})
