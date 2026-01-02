import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Mock ResizeObserver for Radix UI components
class ResizeObserverMock {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}
global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver

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
