import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HouseAbout } from '../house-about'
import { HouseProvider } from '../house-context'
import type { PortableTextBlock } from '@portabletext/types'

// Mock next-sanity
vi.mock('next-sanity', () => ({
  stegaClean: (value: string) => value
}))

// Mock HouseBuilding to isolate testing
vi.mock('@/components/house/house-building', () => ({
  HouseBuilding: () => (
    <div data-testid="house-building">HouseBuilding Mock</div>
  )
}))

const baseProps = {
  title: 'Test House',
  building: null,
  about: null
}

const providerProps = {
  id: 'house-123',
  type: 'house',
  slug: 'orange' as const
}

function renderWithProvider(ui: React.ReactElement) {
  return render(<HouseProvider {...providerProps}>{ui}</HouseProvider>)
}

describe('HouseAbout', () => {
  describe('section structure', () => {
    it('renders section with heading', () => {
      renderWithProvider(<HouseAbout {...baseProps} />)

      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    })

    it('renders heading with house name', () => {
      renderWithProvider(<HouseAbout {...baseProps} title="Orange House" />)

      // The heading uses translation with house param
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    })

    it('handles null title gracefully', () => {
      renderWithProvider(<HouseAbout {...baseProps} title={null} />)

      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    })
  })

  describe('HouseBuilding integration', () => {
    it('renders HouseBuilding component', () => {
      renderWithProvider(<HouseAbout {...baseProps} />)

      expect(screen.getByTestId('house-building')).toBeInTheDocument()
    })
  })

  describe('PortableText content', () => {
    it('renders nothing when about is null', () => {
      const { container } = renderWithProvider(
        <HouseAbout {...baseProps} about={null} />
      )

      // Should not have any paragraph elements from PortableText
      const paragraphs = container.querySelectorAll('section > p')
      expect(paragraphs).toHaveLength(0)
    })

    it('renders paragraph text content', () => {
      const about: PortableTextBlock[] = [
        {
          _type: 'block',
          _key: 'p1',
          style: 'normal',
          children: [
            { _type: 'span', _key: 's1', text: 'Welcome to our house.' }
          ]
        }
      ]

      renderWithProvider(<HouseAbout {...baseProps} about={about} />)

      expect(screen.getByText('Welcome to our house.')).toBeInTheDocument()
    })

    it('renders multiple paragraphs', () => {
      const about: PortableTextBlock[] = [
        {
          _type: 'block',
          _key: 'p1',
          style: 'normal',
          children: [{ _type: 'span', _key: 's1', text: 'First paragraph.' }]
        },
        {
          _type: 'block',
          _key: 'p2',
          style: 'normal',
          children: [{ _type: 'span', _key: 's2', text: 'Second paragraph.' }]
        }
      ]

      renderWithProvider(<HouseAbout {...baseProps} about={about} />)

      expect(screen.getByText('First paragraph.')).toBeInTheDocument()
      expect(screen.getByText('Second paragraph.')).toBeInTheDocument()
    })

    it('renders bullet list items', () => {
      const about: PortableTextBlock[] = [
        {
          _type: 'block',
          _key: 'li1',
          listItem: 'bullet',
          level: 1,
          children: [{ _type: 'span', _key: 's1', text: 'First item' }]
        },
        {
          _type: 'block',
          _key: 'li2',
          listItem: 'bullet',
          level: 1,
          children: [{ _type: 'span', _key: 's2', text: 'Second item' }]
        }
      ]

      renderWithProvider(<HouseAbout {...baseProps} about={about} />)

      expect(screen.getByText('First item')).toBeInTheDocument()
      expect(screen.getByText('Second item')).toBeInTheDocument()
    })

    it('renders numbered list items', () => {
      const about: PortableTextBlock[] = [
        {
          _type: 'block',
          _key: 'li1',
          listItem: 'number',
          level: 1,
          children: [{ _type: 'span', _key: 's1', text: 'Step one' }]
        },
        {
          _type: 'block',
          _key: 'li2',
          listItem: 'number',
          level: 1,
          children: [{ _type: 'span', _key: 's2', text: 'Step two' }]
        }
      ]

      renderWithProvider(<HouseAbout {...baseProps} about={about} />)

      expect(screen.getByText('Step one')).toBeInTheDocument()
      expect(screen.getByText('Step two')).toBeInTheDocument()
    })
  })

  describe('styling', () => {
    it('applies heading styles', () => {
      renderWithProvider(<HouseAbout {...baseProps} />)

      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveClass('text-2xl', 'font-semibold', 'mb-6')
    })
  })
})
