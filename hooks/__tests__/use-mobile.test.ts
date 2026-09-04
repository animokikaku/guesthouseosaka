import { renderHook } from '@testing-library/react'
import { getServerSnapshot, getSnapshot, useIsMobile } from '../use-mobile'

const originalMatchMedia = window.matchMedia

let addEventListenerSpy: ReturnType<typeof vi.fn>
let removeEventListenerSpy: ReturnType<typeof vi.fn>
let matchMediaSpy: ReturnType<typeof vi.fn<typeof window.matchMedia>>

/** Stands in for the browser reporting whether the mobile media query matches. */
function setMatches(matches: boolean) {
  matchMediaSpy.mockImplementation(
    () =>
      ({
        matches,
        addEventListener: addEventListenerSpy,
        removeEventListener: removeEventListenerSpy
      }) as unknown as MediaQueryList
  )
}

beforeEach(() => {
  addEventListenerSpy = vi.fn()
  removeEventListenerSpy = vi.fn()
  matchMediaSpy = vi.fn<typeof window.matchMedia>()
  window.matchMedia = matchMediaSpy
  setMatches(false)
})

afterEach(() => {
  window.matchMedia = originalMatchMedia
})

describe('useIsMobile', () => {
  it.each([
    [true, true],
    [false, false]
  ])('reports matches=%s as mobile=%s', (matches, isMobile) => {
    setMatches(matches)

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
  it('asks for the breakpoint the layout uses', () => {
    getSnapshot()

    expect(matchMediaSpy).toHaveBeenCalledWith('(max-width: 767px)')
  })

  it('never reads layout, which would force a reflow on every render', () => {
    const innerWidth = vi.spyOn(window, 'innerWidth', 'get')

    getSnapshot()

    expect(innerWidth).not.toHaveBeenCalled()
    innerWidth.mockRestore()
  })

  it.each([
    [true, true],
    [false, false]
  ])('reports matches=%s as mobile=%s', (matches, isMobile) => {
    setMatches(matches)

    expect(getSnapshot()).toBe(isMobile)
  })
})
