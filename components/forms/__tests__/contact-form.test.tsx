import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ContactForm } from '../contact-form'

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
})

// Mock form submission hook
vi.mock('../use-form-submit', () => ({
  useFormSubmit: () => ({
    onSubmitInvalid: vi.fn(),
    createOnSubmit: () => vi.fn()
  })
}))

// Mock LegalNoticeDialog for privacy policy field
vi.mock('@/components/legal-notice-dialog', () => ({
  LegalNoticeDialog: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="legal-notice-dialog">{children}</div>
  )
}))

const baseProps = {
  title: 'Contact Us',
  description: 'Send us a message',
  fields: {
    places: { label: 'Places' },
    date: { label: 'Date' },
    hour: { label: 'Hour' },
    stayDuration: { label: 'Stay Duration' },
    name: { label: 'Your Name', placeholder: 'Enter name' },
    age: { label: 'Age' },
    gender: { label: 'Gender' },
    nationality: { label: 'Nationality', placeholder: 'Enter nationality' },
    email: { label: 'Your Email', placeholder: 'Enter email' },
    phone: { label: 'Phone' },
    message: {
      label: 'Your Message',
      placeholder: 'Enter message',
      description: 'Min 5 characters'
    }
  },
  houseTitles: [
    { slug: 'orange' as const, title: 'Orange House' },
    { slug: 'apple' as const, title: 'Apple House' },
    { slug: 'lemon' as const, title: 'Lemon House' }
  ]
}

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('card structure', () => {
    it('renders card with title', () => {
      render(<ContactForm {...baseProps} />)

      expect(screen.getByText('Contact Us')).toBeInTheDocument()
    })

    it('renders card with description', () => {
      render(<ContactForm {...baseProps} />)

      expect(screen.getByText('Send us a message')).toBeInTheDocument()
    })

    it('renders without header when title and description are empty', () => {
      render(<ContactForm {...baseProps} title="" description={null} />)

      expect(screen.queryByText('Contact Us')).not.toBeInTheDocument()
    })
  })

  describe('form fields', () => {
    it('renders name input field', () => {
      render(<ContactForm {...baseProps} />)

      expect(screen.getByLabelText(/your name/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument()
    })

    it('renders email input field', () => {
      render(<ContactForm {...baseProps} />)

      expect(screen.getByLabelText(/your email/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument()
    })

    it('renders message textarea', () => {
      render(<ContactForm {...baseProps} />)

      expect(screen.getByLabelText(/your message/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter message')).toBeInTheDocument()
    })

    it('renders privacy policy checkbox', () => {
      render(<ContactForm {...baseProps} />)

      // The privacy policy field should render a checkbox
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeInTheDocument()
    })
  })

  describe('form actions', () => {
    it('renders action buttons', () => {
      render(<ContactForm {...baseProps} />)

      // Both submit and reset buttons should be present
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('form attributes', () => {
    it('has correct form id', () => {
      const { container } = render(<ContactForm {...baseProps} />)

      const form = container.querySelector('form#other-form')
      expect(form).toBeInTheDocument()
    })

    it('submit button references the form id', () => {
      const { container } = render(<ContactForm {...baseProps} />)

      // Find submit button by form attribute
      const submitButton = container.querySelector('button[form="other-form"]')
      expect(submitButton).toBeInTheDocument()
    })
  })
})
