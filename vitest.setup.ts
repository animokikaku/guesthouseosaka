import '@testing-library/jest-dom/vitest'

// Base UI ScrollArea measures overflow after render, which causes act() warnings in
// consumer tests. The wrapper itself is covered by browser behavior, so unit tests
// use a static DOM equivalent.
vi.mock('@/components/ui/scroll-area', async () => {
  const React = await vi.importActual<typeof import('react')>('react')

  return {
    ScrollArea: ({ children, ...props }: React.ComponentProps<'div'>) =>
      React.createElement('div', { 'data-slot': 'scroll-area', ...props }, children),
    ScrollBar: ({ children, orientation = 'vertical', ...props }: React.ComponentProps<'div'> & {
      orientation?: 'horizontal' | 'vertical'
    }) =>
      React.createElement(
        'div',
        {
          'data-slot': 'scroll-area-scrollbar',
          'data-orientation': orientation,
          ...props
        },
        children
      )
  }
})

// Mock ResizeObserver for Radix UI components
class ResizeObserverMock {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}
vi.stubGlobal('ResizeObserver', ResizeObserverMock)

// Mock IntersectionObserver for lazy loading and scroll-spy components
class IntersectionObserverMock implements IntersectionObserver {
  readonly root: Element | Document | null = null
  readonly rootMargin = ''
  readonly scrollMargin = ''
  readonly thresholds: ReadonlyArray<number> = []
  private callback: IntersectionObserverCallback

  constructor(callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) {
    this.callback = callback
  }

  observe = vi.fn((target: Element) => {
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
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)

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
      number: (n: number) => String(n)
    })
  }
})

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/',
  useParams: () => ({})
}))
