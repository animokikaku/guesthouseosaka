import '@testing-library/jest-dom/vitest'
import * as webStreams from 'node:stream/web'

// The vmThreads pool runs each file in a VM context whose globals come from jsdom,
// which has no web streams. The Sanity client (via undici) reads them at import time.
for (const [name, value] of Object.entries(webStreams)) {
  if (!(name in globalThis)) Object.assign(globalThis, { [name]: value })
}

// Tests that never touch the DOM opt out of jsdom with `// @vitest-environment
// node`, which makes creating the environment the suite's largest single cost only
// where it buys something. This file still runs for them, so DOM setup is guarded.
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  })
}

// Base UI ScrollArea measures overflow after render, which causes act() warnings in
// consumer tests. The wrapper itself is covered by browser behavior, so unit tests
// use a static DOM equivalent.
vi.mock('@/components/ui/scroll-area', async () => {
  const React = await vi.importActual<typeof import('react')>('react')

  return {
    ScrollArea: ({ children, ...props }: React.ComponentProps<'div'>) =>
      React.createElement('div', { 'data-slot': 'scroll-area', ...props }, children),
    ScrollBar: ({
      children,
      orientation = 'vertical',
      ...props
    }: React.ComponentProps<'div'> & {
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

// Translations resolve against the real English catalog, so assertions read
// as the copy users see and a broken key or ICU message fails the test. Bound
// here rather than through a provider so components render without one.
vi.mock('use-intl', async (importOriginal) => {
  const actual = await importOriginal<typeof import('use-intl')>()
  const { bindTestIntl } = await import('@/lib/__tests__/utils/intl')
  const { getTranslator, getFormatter } = bindTestIntl(actual)

  return {
    ...actual,
    useTranslations: getTranslator,
    useFormatter: getFormatter,
    useLocale: () => 'en'
  }
})

// Components render without a router; see the double for what it provides.
vi.mock('@tanstack/react-router', async () => {
  const { routerMock } = await import('@/lib/__tests__/utils/router')
  return routerMock
})

beforeEach(async () => {
  const { routerState } = await import('@/lib/__tests__/utils/router')
  Object.assign(routerState, { params: {}, pathname: '/en' })
  routerState.navigate.mockReset()
  routerState.invalidate.mockReset()
})
