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
