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
// here rather than through a provider so server and client components share it.
vi.mock('next-intl', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next-intl')>()
  const { bindTestIntl } = await import('@/lib/__tests__/utils/intl')
  const { getTranslator, getFormatter } = bindTestIntl(actual)

  return {
    ...actual,
    useTranslations: getTranslator,
    useFormatter: getFormatter,
    useLocale: () => 'en'
  }
})

// next-intl's navigation reads the locale from use-intl directly, so the real
// `Link` from `@/i18n/navigation` renders localized hrefs without a provider.
vi.mock('use-intl', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useLocale: () => 'en'
}))

vi.mock('next-intl/server', async () => {
  const actual = await vi.importActual<typeof import('next-intl')>('next-intl')
  const { bindTestIntl } = await import('@/lib/__tests__/utils/intl')
  const { getTranslator } = bindTestIntl(actual)

  return {
    getTranslations: async (options?: string | { namespace?: string }) =>
      getTranslator(typeof options === 'string' ? options : options?.namespace),
    getLocale: async () => 'en'
  }
})

// Client hooks need an app router that tests don't mount; the rest of the module is real.
vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/navigation')>()),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/',
  useParams: () => ({})
}))
