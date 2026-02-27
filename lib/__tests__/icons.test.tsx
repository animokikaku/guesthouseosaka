import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@/sanity/lib/icon-map', () => ({
  iconMap: {
    wifi: (props: Record<string, unknown>) => <svg data-testid="wifi-icon" {...props} />
  }
}))

vi.mock('@/sanity/lib/allowed-icons', () => ({
  allowedIcons: ['wifi']
}))

import { Icon } from '../icons'

describe('Icon', () => {
  it('renders known icon', () => {
    render(<Icon name={'wifi' as const} />)

    expect(screen.getByTestId('wifi-icon')).toBeInTheDocument()
  })

  it('returns null for unknown icon', () => {
    const { container } = render(<Icon name={'nonexistent' as 'wifi'} />)

    expect(container.firstChild).toBeNull()
  })

  it('forwards props to icon component', () => {
    render(<Icon name={'wifi' as const} className="size-6" />)

    expect(screen.getByTestId('wifi-icon')).toHaveClass('size-6')
  })
})
