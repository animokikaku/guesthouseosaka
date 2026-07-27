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
})
