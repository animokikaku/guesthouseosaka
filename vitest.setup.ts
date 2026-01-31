import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Mock ResizeObserver for Radix UI components
class ResizeObserverMock {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}
global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver

// Mock IntersectionObserver for lazy loading components
class IntersectionObserverMock implements IntersectionObserver {
  readonly root: Element | Document | null = null
  readonly rootMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []
  private callback: IntersectionObserverCallback

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
  }

  observe = vi.fn((target: Element) => {
    // Immediately trigger callback with isIntersecting: true to simulate element in view
    this.callback(
      [
        {
          target,
          isIntersecting: true,
          boundingClientRect: {} as DOMRectReadOnly,
          intersectionRatio: 1,
          intersectionRect: {} as DOMRectReadOnly,
          rootBounds: null,
          time: Date.now()
        }
      ],
      this
    )
  })
  unobserve = vi.fn()
  disconnect = vi.fn()
  takeRecords = vi.fn(() => [])
}
global.IntersectionObserver =
  IntersectionObserverMock as unknown as typeof IntersectionObserver

// Mock next-intl
vi.mock('next-intl', () => {
  const t = (key: string) => key
  // Add rich method for ICU message formatting
  t.rich = (key: string) => key
  t.raw = (key: string) => key
  t.markup = (key: string) => key

  return {
    useTranslations: () => t,
    useLocale: () => 'en',
    useFormatter: () => ({
      number: (n: number) => String(n),
    }),
  }
})

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/',
  useParams: () => ({}),
}))
