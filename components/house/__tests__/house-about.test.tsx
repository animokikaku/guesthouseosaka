import { render, screen } from '@testing-library/react'
import { HouseAbout } from '../house-about'
import { HouseProvider } from '../house-context'
import type { HousePortableTextContent } from '@/lib/types/components'

// Routing is the edge here: the building summary links to the pricing section.
vi.mock('@/i18n/navigation', () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a href="#pricing">{children}</a>
}))

function renderAbout(props: Partial<React.ComponentProps<typeof HouseAbout>> = {}) {
  return render(
    <HouseProvider id="house-123" type="house" slug="orange">
      <HouseAbout title="Test House" building={null} about={null} {...props} />
    </HouseProvider>
  )
}

/** One PortableText block holding a single span of text. */
function block(key: string, text: string, listItem?: 'bullet' | 'number') {
  return {
    _type: 'block' as const,
    _key: key,
    ...(listItem ? { listItem, level: 1 } : { style: 'normal' as const }),
    children: [{ _type: 'span' as const, _key: `${key}-span`, text }]
  }
}

describe('HouseAbout', () => {
  it('introduces the house by name above its building summary', () => {
    renderAbout()

    expect(screen.getByRole('heading', { level: 2, name: /\bTest House\b/ })).toBeInTheDocument()
    // The building summary sits under the heading.
    expect(screen.getByText(/\brooms\b/i)).toBeInTheDocument()
  })

  it('keeps the heading when the title is missing', () => {
    renderAbout({ title: null })

    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  it('renders no body copy when about is null', () => {
    const { container } = renderAbout({ about: null })

    expect(container.querySelectorAll('section > p')).toHaveLength(0)
  })

  it.each([
    ['paragraphs', undefined],
    ['bullet list items', 'bullet' as const],
    ['numbered list items', 'number' as const]
  ])('renders %s from PortableText', (_name, listItem) => {
    const about: NonNullable<HousePortableTextContent> = [
      block('first', 'First entry.', listItem),
      block('second', 'Second entry.', listItem)
    ]

    renderAbout({ about })

    expect(screen.getByText('First entry.')).toBeInTheDocument()
    expect(screen.getByText('Second entry.')).toBeInTheDocument()
  })
})
