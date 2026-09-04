import { renderHook } from '@testing-library/react'
import { useIsMobile, getServerSnapshot, getSnapshot } from '../use-mobile'

const originalInnerWidth = window.innerWidth

function setViewportWidth(value: number) {
  Object.defineProperty(window, 'innerWidth', { writable: true, value })
}

afterEach(() => {
  setViewportWidth(originalInnerWidth)
})

describe('useIsMobile', () => {
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
  })

  it.each([
    [500, true],
    [1024, false]
  ])('reports %ipx as mobile=%s', (width, isMobile) => {
    setViewportWidth(width)

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(isMobile)
  })

  it('subscribes to the media query and cleans up on unmount', () => {
    const { unmount } = renderHook(() => useIsMobile())

    expect(addEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function))

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function))
  })
})

describe('getServerSnapshot', () => {
  it('returns false for SSR compatibility', () => {
    expect(getServerSnapshot()).toBe(false)
  })
})

describe('getSnapshot', () => {
  // The breakpoint is 768px, so 767 is the widest mobile viewport.
  it.each([
    [500, true],
    [767, true],
    [768, false],
    [1024, false]
  ])('reports %ipx as mobile=%s', (width, isMobile) => {
    setViewportWidth(width)

    expect(getSnapshot()).toBe(isMobile)
  })
})
