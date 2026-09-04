import { render } from '@testing-library/react'

import { Icon } from '../icons'

describe('Icon', () => {
  it('renders known icon', () => {
    const { container } = render(<Icon name="wifi" />)

    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('returns null for unknown icon', () => {
    const { container } = render(<Icon name="nonexistent" />)

    expect(container.firstChild).toBeNull()
  })

  it('forwards props to icon component', () => {
    const { container } = render(<Icon name="wifi" className="size-6" />)

    expect(container.querySelector('svg')).toHaveClass('size-6')
  })

  // Brand marks carry inlined path data rather than coming from a package, so
  // an empty or truncated `d` would render an invisible icon that still passes
  // a "renders an svg" assertion.
  it.each(['facebook', 'instagram'])('renders the %s brand mark with path data', (name) => {
    const { container } = render(<Icon name={name} />)

    const path = container.querySelector('svg > path')
    expect(path?.getAttribute('d')).toMatch(/^M[\d.]/)
    expect(path?.getAttribute('d')?.length).toBeGreaterThan(100)
  })
})
