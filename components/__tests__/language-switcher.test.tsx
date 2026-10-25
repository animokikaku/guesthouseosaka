import { routerState } from '@/lib/__tests__/utils/router'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { LanguageSwitcher } from '../language-switcher'

describe('LanguageSwitcher', () => {
  async function openLanguageMenu() {
    fireEvent.click(screen.getByRole('button', { name: /\blanguage\b/i }))
    return screen.findByRole('menuitemradio', { name: 'English' })
  }

  it('replaces the current route when a different language is selected', async () => {
    render(<LanguageSwitcher />)
    await openLanguageMenu()

    fireEvent.click(screen.getByRole('menuitemradio', { name: '日本語' }))

    await waitFor(() => {
      expect(routerState.navigate).toHaveBeenCalledWith(
        expect.objectContaining({ to: '.', replace: true, resetScroll: false })
      )
    })
    // The current page's params, with the locale swapped.
    const [{ params }] = routerState.navigate.mock.calls[0]
    expect(params({ locale: 'en', house: 'orange' })).toEqual({ locale: 'ja', house: 'orange' })
  })

  it('closes without navigating when the active language is selected', async () => {
    render(<LanguageSwitcher />)
    const englishOption = await openLanguageMenu()

    fireEvent.click(englishOption)

    await waitFor(() => {
      expect(screen.queryByRole('menuitemradio', { name: 'English' })).not.toBeInTheDocument()
    })
    expect(routerState.navigate).not.toHaveBeenCalled()
  })
})
