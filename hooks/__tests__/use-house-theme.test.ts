import { renderHook } from '@testing-library/react'
import { useHouseTheme } from '../use-house-theme'

const useParamsMock = vi.fn()

vi.mock('next/navigation', () => ({
  useParams: () => useParamsMock()
}))

describe('useHouseTheme', () => {
  beforeEach(() => {
    document.body.className = 'theme-default'
  })

  it('tracks the active house and resets the theme on cleanup', () => {
    useParamsMock.mockReturnValue({ house: 'orange' })
    const { rerender, unmount } = renderHook(() => useHouseTheme())

    expect(document.body).toHaveClass('theme-orange')

    useParamsMock.mockReturnValue({ house: 'apple' })
    rerender()
    expect(document.body).toHaveClass('theme-red')

    unmount()
    expect(document.body).toHaveClass('theme-default')
  })

  it('keeps the default theme outside valid house routes', () => {
    useParamsMock.mockReturnValue({ house: 'unknown' })

    renderHook(() => useHouseTheme())

    expect(document.body).toHaveClass('theme-default')
  })
})
