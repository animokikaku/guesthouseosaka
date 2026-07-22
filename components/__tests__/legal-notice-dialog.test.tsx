import { fireEvent, render, screen, waitFor } from '@testing-library/react'

vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false
}))

vi.mock('@/hooks/use-legal-notice', () => ({
  useLegalNotice: () => ({
    title: 'Privacy Policy',
    lastUpdated: '2026-01-15T00:00:00.000Z',
    content: [
      {
        _key: 'content',
        _type: 'block',
        children: [{ _key: 'text', _type: 'span', marks: [], text: 'Policy content' }],
        markDefs: [],
        style: 'normal'
      }
    ]
  })
}))

vi.mock('next-intl', () => ({
  useFormatter: () => ({
    dateTime: () => 'January 15, 2026'
  }),
  useTranslations: () => (key: string) => key
}))

import { LegalNoticeDialog } from '../legal-notice-dialog'

describe('LegalNoticeDialog', () => {
  it('opens the policy content and closes from the footer action', async () => {
    render(<LegalNoticeDialog>Privacy Policy</LegalNoticeDialog>)

    fireEvent.click(screen.getByRole('button', { name: 'Privacy Policy' }))

    expect(await screen.findByRole('dialog')).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible()
    expect(screen.getByText('Policy content')).toBeVisible()

    fireEvent.click(screen.getByRole('button', { name: 'close_button' }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })
})
