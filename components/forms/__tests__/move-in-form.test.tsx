import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MoveInForm } from '../move-in-form'

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
  title: 'Move-In Application',
  description: 'Apply to live with us',
  houseTitles: [
    { slug: 'orange' as const, title: 'Orange House' },
    { slug: 'apple' as const, title: 'Apple House' },
    { slug: 'lemon' as const, title: 'Lemon House' }
  ],
  fields: {
    places: { label: 'Preferred Houses', description: 'Choose up to 3' },
    date: { label: 'Move-In Date', description: 'Select a date' },
    hour: { label: 'Hour' },
    stayDuration: { label: 'Stay Duration', description: 'How long?' },
    name: { label: 'Your Name', placeholder: 'Enter name' },
    age: { label: 'Your Age', placeholder: 'Enter age' },
    gender: { label: 'Gender', placeholder: 'Select gender' },
    nationality: { label: 'Nationality', placeholder: 'Enter nationality' },
    email: { label: 'Your Email', placeholder: 'Enter email' },
    phone: { label: 'Phone', placeholder: 'Enter phone' },
    message: {
      label: 'Message',
      placeholder: 'Tell us about yourself',
      description: 'Optional'
    }
  }
}

describe('MoveInForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('card structure', () => {
    it('renders card with title', () => {
      render(<MoveInForm {...baseProps} />)

      expect(screen.getByText('Move-In Application')).toBeInTheDocument()
    })

    it('renders card with description', () => {
      render(<MoveInForm {...baseProps} />)

      expect(screen.getByText('Apply to live with us')).toBeInTheDocument()
    })
  })

  describe('form fields', () => {
    it('renders date field', () => {
      render(<MoveInForm {...baseProps} />)

      expect(screen.getByLabelText(/move-in date/i)).toBeInTheDocument()
    })

    it('renders stay duration field', () => {
      render(<MoveInForm {...baseProps} />)

      expect(screen.getByLabelText(/stay duration/i)).toBeInTheDocument()
    })

    it('renders name input field', () => {
      render(<MoveInForm {...baseProps} />)

      expect(screen.getByLabelText(/your name/i)).toBeInTheDocument()
    })

    it('renders email input field', () => {
      render(<MoveInForm {...baseProps} />)

      expect(screen.getByLabelText(/your email/i)).toBeInTheDocument()
    })

    it('renders privacy policy checkbox', () => {
      render(<MoveInForm {...baseProps} />)

      expect(screen.getByRole('checkbox')).toBeInTheDocument()
    })
  })

  describe('form attributes', () => {
    it('has correct form id', () => {
      const { container } = render(<MoveInForm {...baseProps} />)

      const form = container.querySelector('form#move-in-form')
      expect(form).toBeInTheDocument()
    })

    it('submit button references the form id', () => {
      const { container } = render(<MoveInForm {...baseProps} />)

      const submitButton = container.querySelector('button[form="move-in-form"]')
      expect(submitButton).toBeInTheDocument()
    })
  })
})
