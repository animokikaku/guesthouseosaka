import { vi } from 'vitest'

export type MockCarouselApi = {
  selectedScrollSnap: () => number
  scrollTo: ReturnType<typeof vi.fn>
  scrollPrev: ReturnType<typeof vi.fn>
  scrollNext: ReturnType<typeof vi.fn>
  on: (event: string, callback: () => void) => void
  off: (event: string, callback: () => void) => void
}

export type CarouselMockState = {
  mockApi: MockCarouselApi | null
  apiCallbacks: Map<string, (() => void)[]>
  setApiCallback: ((api: MockCarouselApi) => void) | null
  currentSelectedIndex: number
}

export function createCarouselMockState(): CarouselMockState {
  return {
    mockApi: null,
    apiCallbacks: new Map(),
    setApiCallback: null,
    currentSelectedIndex: 0
  }
}

export function createMockCarouselApi(state: CarouselMockState): MockCarouselApi {
  return {
    selectedScrollSnap: () => state.currentSelectedIndex,
    scrollTo: vi.fn((index: number) => {
      state.currentSelectedIndex = index
      state.apiCallbacks.get('select')?.forEach((cb) => cb())
    }),
    scrollPrev: vi.fn(),
    scrollNext: vi.fn(),
    on: vi.fn((event: string, callback: () => void) => {
      const callbacks = state.apiCallbacks.get(event) || []
      callbacks.push(callback)
      state.apiCallbacks.set(event, callbacks)
    }),
    off: vi.fn((event: string, callback: () => void) => {
      const callbacks = state.apiCallbacks.get(event) || []
      const index = callbacks.indexOf(callback)
      if (index > -1) callbacks.splice(index, 1)
      state.apiCallbacks.set(event, callbacks)
    })
  }
}

export function resetCarouselMockState(state: CarouselMockState): void {
  state.mockApi = null
  state.apiCallbacks = new Map()
  state.setApiCallback = null
  state.currentSelectedIndex = 0
}

export function createCarouselMock(state: CarouselMockState) {
  return {
    Carousel: ({
      children,
      setApi
    }: {
      children: React.ReactNode
      setApi?: (api: MockCarouselApi) => void
    }) => {
      if (setApi) {
        state.setApiCallback = setApi
      }
      return <div data-testid="carousel">{children}</div>
    },
    CarouselContent: ({
      children,
      onTouchStart,
      onTouchEnd
    }: {
      children: React.ReactNode
      onTouchStart?: React.TouchEventHandler
      onTouchEnd?: React.TouchEventHandler
    }) => (
      <div
        data-testid="carousel-content"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {children}
      </div>
    ),
    CarouselItem: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="carousel-item">{children}</div>
    ),
    CarouselNext: () => <button data-testid="carousel-next">Next</button>,
    CarouselPrevious: () => <button data-testid="carousel-prev">Previous</button>
  }
}
