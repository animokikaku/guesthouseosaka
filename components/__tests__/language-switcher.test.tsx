import { fireEvent, render, screen, waitFor } from '@testing-library/react'

const { replaceMock } = vi.hoisted(() => ({
  replaceMock: vi.fn()
}))

vi.mock('@/i18n/navigation', () => ({
  usePathname: () => '/faq',
  useRouter: () => ({ replace: replaceMock })
}))

vi.mock('next/navigation', () => ({
  useParams: () => ({})
}))

vi.mock('next-intl', () => ({
  hasLocale: (locales: string[], locale: string) => locales.includes(locale),
  useLocale: () => 'en',
  useTranslations: () => (key: string) => key
}))

import { LanguageSwitcher } from '../language-switcher'

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    replaceMock.mockClear()
  })

  async function openLanguageMenu() {
    fireEvent.click(screen.getByRole('button', { name: 'aria_label' }))
    return screen.findByRole('menuitemradio', { name: 'English' })
  }

  it('replaces the current route when a different language is selected', async () => {
    render(<LanguageSwitcher />)
    await openLanguageMenu()

    fireEvent.click(screen.getByRole('menuitemradio', { name: '日本語' }))

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith(
        { pathname: '/faq', params: {} },
        { locale: 'ja', scroll: false }
      )
    })
  })

  it('closes without navigating when the active language is selected', async () => {
    render(<LanguageSwitcher />)
    const englishOption = await openLanguageMenu()

    fireEvent.click(englishOption)

    await waitFor(() => {
      expect(screen.queryByRole('menuitemradio', { name: 'English' })).not.toBeInTheDocument()
    })
    expect(replaceMock).not.toHaveBeenCalled()
  })
})
