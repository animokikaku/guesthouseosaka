import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Button } from '@/components/ui/button'
import { ResponsiveModal } from '@/components/ui/responsive-modal'

vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: vi.fn(() => true)
}))

describe('Drawer', () => {
  it('opens drawer in a portal when trigger is clicked', async () => {
    render(
      <ResponsiveModal trigger={<Button variant="outline">Open</Button>} title="Test Drawer">
        <p>Drawer body content</p>
      </ResponsiveModal>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Open' }))

    await waitFor(() => {
      expect(document.querySelector('[data-slot="drawer-portal"]')).toBeTruthy()
      expect(document.querySelector('[data-slot="drawer-content"]')).toBeTruthy()
      expect(screen.getByText('Drawer body content')).toBeInTheDocument()
    })

    const popup = document.querySelector('[data-slot="drawer-content"]') as HTMLElement
    expect(popup.hasAttribute('hidden')).toBe(false)
  })
})
