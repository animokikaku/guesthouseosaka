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

  // A plain object literal inherits these, and each resolves to a truthy
  // function that React would try to render as a component.
  it.each(['toString', 'constructor', 'valueOf'])(
    'returns null for the inherited name %s',
    (name) => {
      const { container } = render(<Icon name={name} />)

      expect(container.firstChild).toBeNull()
    }
  )

  it('forwards props to icon component', () => {
    const { container } = render(<Icon name="wifi" className="size-6" />)

    expect(container.querySelector('svg')).toHaveClass('size-6')
  })

  // Brand marks come from simple-icons, so a version bump can change their path
  // data. An empty or renamed export would render an invisible icon that still
  // passes a "renders an svg" assertion.
  it.each(['facebook', 'instagram'])('renders the %s brand mark with path data', (name) => {
    const { container } = render(<Icon name={name} />)

    const path = container.querySelector('svg > path')
    expect(path?.getAttribute('d')).toMatch(/^M[\d.]/)
    expect(path?.getAttribute('d')?.length).toBeGreaterThan(100)
  })
})
