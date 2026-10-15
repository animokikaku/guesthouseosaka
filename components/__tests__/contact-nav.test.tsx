import { render, screen } from '@testing-library/react'
import type { ContactNavItem } from '@/lib/types/components'
import { ContactNav } from '../contact-nav'

const { selectedSegment } = vi.hoisted(() => ({
  selectedSegment: { current: null as string | null }
}))

vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/navigation')>()),
  usePathname: () => '/',
  useSelectedLayoutSegment: () => selectedSegment.current
}))

const items: ContactNavItem[] = [
  { id: 'tour-1', slug: 'tour', title: 'Book a Tour' },
  { id: 'move-in-1', slug: 'move-in', title: 'Move In' },
  { id: 'other-1', slug: 'other', title: 'Other Inquiries' }
]

describe('ContactNav', () => {
  beforeEach(() => {
    selectedSegment.current = null
  })

  it('renders one link per item, pointing at the contact tab', () => {
    render(<ContactNav items={items} />)

    expect(screen.getAllByRole('link')).toHaveLength(3)
    expect(screen.getByRole('link', { name: 'Book a Tour' })).toHaveAttribute(
      'href',
      '/en/contact/tour#tabs'
    )
    expect(screen.getByRole('link', { name: 'Move In' })).toHaveAttribute(
      'href',
      '/en/contact/move-in#tabs'
    )
    expect(screen.getByRole('link', { name: 'Other Inquiries' })).toHaveAttribute(
      'href',
      '/en/contact/other#tabs'
    )
  })

  it('returns null when items array is empty', () => {
    const { container } = render(<ContactNav items={[]} />)

    expect(container.firstChild).toBeNull()
  })

  it('marks only the link matching the current segment as active', () => {
    selectedSegment.current = 'tour'

    render(<ContactNav items={items} />)

    expect(screen.getByRole('link', { name: 'Book a Tour' })).toHaveAttribute('data-active', 'true')
    expect(screen.getByRole('link', { name: 'Move In' })).toHaveAttribute('data-active', 'false')
  })
})
