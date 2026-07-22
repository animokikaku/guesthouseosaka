import { fireEvent, render, screen, waitFor } from '@testing-library/react'

const { isMobileMock } = vi.hoisted(() => ({
  isMobileMock: vi.fn()
}))

vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => isMobileMock()
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
  beforeEach(() => {
    isMobileMock.mockReturnValue(false)
  })

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

  it('agrees to the policy and closes the mobile drawer', async () => {
    const onAgree = vi.fn()
    isMobileMock.mockReturnValue(true)
    render(<LegalNoticeDialog onAgree={onAgree}>Privacy Policy</LegalNoticeDialog>)

    fireEvent.click(screen.getByRole('button', { name: 'Privacy Policy' }))
    expect(await screen.findByRole('dialog')).toBeVisible()

    fireEvent.click(screen.getByRole('button', { name: 'agree_button' }))

    expect(onAgree).toHaveBeenCalledOnce()
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })
})
