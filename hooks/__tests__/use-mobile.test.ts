import { act, renderHook } from '@testing-library/react'
import { getServerSnapshot, useIsMobile } from '../use-mobile'

const originalMatchMedia = window.matchMedia

/** A stand-in for the browser's media query, which tests can flip like a resize would. */
function viewport(initiallyMobile: boolean) {
  let matches = initiallyMobile
  const listeners = new Set<() => void>()
  const queries: string[] = []

  window.matchMedia = (query: string) => {
    queries.push(query)
    // Only the parts of MediaQueryList the hook uses.
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    return {
      get matches() {
        return matches
      },
      addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
      removeEventListener: (_type: string, listener: () => void) => listeners.delete(listener)
    } as unknown as MediaQueryList
  }

  return {
    queries,
    resize(mobile: boolean) {
      matches = mobile
      listeners.forEach((listener) => listener())
    }
  }
}

afterEach(() => {
  window.matchMedia = originalMatchMedia
})

describe('useIsMobile', () => {
  // The breakpoint is Tailwind's `md` (768px), so 767px is the widest mobile viewport.
  it('asks the same breakpoint the layout uses', () => {
    const { queries } = viewport(false)

    renderHook(() => useIsMobile())

    expect(queries).toContain('(max-width: 767px)')
  })

  it('follows the viewport across the breakpoint', () => {
    const screen = viewport(false)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)

    act(() => screen.resize(true))
    expect(result.current).toBe(true)

    act(() => screen.resize(false))
    expect(result.current).toBe(false)
  })

  // Reading layout on every render forces a synchronous reflow; the media query
  // already holds the answer.
  it('never reads layout', () => {
    viewport(true)
    const innerWidth = vi.spyOn(window, 'innerWidth', 'get')

    renderHook(() => useIsMobile())

    expect(innerWidth).not.toHaveBeenCalled()
    innerWidth.mockRestore()
  })

  it('renders the desktop layout on the server', () => {
    expect(getServerSnapshot()).toBe(false)
  })
})
