import { routerState } from '@/lib/__tests__/utils/router'
import { render, screen } from '@testing-library/react'
import type { ContactNavItem } from '@/lib/types/components'
import { ContactNav } from '../contact-nav'

const items: ContactNavItem[] = [
  { id: 'tour-1', slug: 'tour', title: 'Book a Tour' },
  { id: 'move-in-1', slug: 'move-in', title: 'Move In' },
  { id: 'other-1', slug: 'other', title: 'Other Inquiries' }
]

describe('ContactNav', () => {
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
    routerState.params = { slug: 'tour' }

    render(<ContactNav items={items} />)

    expect(screen.getByRole('link', { name: 'Book a Tour' })).toHaveAttribute('data-active', 'true')
    expect(screen.getByRole('link', { name: 'Move In' })).toHaveAttribute('data-active', 'false')
  })
})
