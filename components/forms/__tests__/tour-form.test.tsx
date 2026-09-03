import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { TourForm } from '../tour-form'

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
  title: 'Book a Tour',
  description: 'Schedule your visit',
  houseTitles: [
    { slug: 'orange' as const, title: 'Orange House' },
    { slug: 'apple' as const, title: 'Apple House' },
    { slug: 'lemon' as const, title: 'Lemon House' }
  ],
  fields: {
    places: { label: 'Select Houses', description: 'Choose up to 3' },
    date: { label: 'Visit Date', description: 'Select a date' },
    hour: { label: 'Preferred Time', description: 'Select time' },
    stayDuration: { label: 'Stay Duration' },
    name: { label: 'Your Name', placeholder: 'Enter name' },
    age: { label: 'Your Age', placeholder: 'Enter age' },
    gender: { label: 'Gender', placeholder: 'Select gender' },
    nationality: { label: 'Nationality', placeholder: 'Enter nationality' },
    email: { label: 'Your Email', placeholder: 'Enter email' },
    phone: { label: 'Phone', placeholder: 'Enter phone' },
    message: {
      label: 'Message',
      placeholder: 'Additional notes',
      description: 'Optional'
    }
  }
}

describe('TourForm', () => {
  describe('card structure', () => {
    it('renders card with title', () => {
      render(<TourForm {...baseProps} />)

      expect(screen.getByText('Book a Tour')).toBeInTheDocument()
    })

    it('renders card with description', () => {
      render(<TourForm {...baseProps} />)

      expect(screen.getByText('Schedule your visit')).toBeInTheDocument()
    })
  })

  describe('form fields', () => {
    it('renders the date field as a native date input', () => {
      render(<TourForm {...baseProps} />)

      expect(screen.getByLabelText(/visit date/i)).toHaveAttribute('type', 'date')
    })

    it('renders time field', () => {
      render(<TourForm {...baseProps} />)

      expect(screen.getByLabelText(/preferred time/i)).toBeInTheDocument()
    })

    it('renders name input field', () => {
      render(<TourForm {...baseProps} />)

      expect(screen.getByLabelText(/your name/i)).toBeInTheDocument()
    })

    it('renders email input field', () => {
      render(<TourForm {...baseProps} />)

      expect(screen.getByLabelText(/your email/i)).toBeInTheDocument()
    })

    it('renders privacy policy checkbox', () => {
      render(<TourForm {...baseProps} />)

      expect(screen.getByRole('checkbox')).toBeInTheDocument()
    })
  })

  describe('form attributes', () => {
    it('has correct form id', () => {
      const { container } = render(<TourForm {...baseProps} />)

      expect(container.querySelector('form')).toHaveAttribute('id', 'tour-form')
    })

    it('submit button references the form id', () => {
      render(<TourForm {...baseProps} />)

      expect(screen.getByRole('button', { name: 'label' })).toHaveAttribute('form', 'tour-form')
    })
  })
  describe('validation', () => {
    it('surfaces schema errors on the matching fields after an invalid submit', async () => {
      const { container } = render(<TourForm {...baseProps} />)

      fireEvent.submit(container.querySelector('form')!)

      // Form-level schema errors are routed to their fields, including the
      // nested `account.*` paths owned by the user account field group and
      // this form's own date field.
      const nameInput = screen.getByLabelText(/your name/i)
      await waitFor(() => expect(nameInput).toHaveAttribute('aria-invalid', 'true'))
      expect(screen.getByLabelText('Visit Date')).toHaveAttribute('aria-invalid', 'true')
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0)
    })
  })
})
