import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FormCard } from '../form-card'

function createMockForm() {
  return {
    handleSubmit: vi.fn(),
    AppForm: ({ children }: { children?: React.ReactNode }) => (
      <div data-testid="app-form">{children}</div>
    ),
    ResetButton: () => <button type="button">Reset</button>,
    SubmitButton: ({ form }: { form: string }) => (
      <button type="submit" form={form}>
        Submit
      </button>
    )
  }
}

describe('FormCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders form with formId', () => {
      const form = createMockForm()

      render(
        <FormCard formId="test-form" form={form}>
          <input name="test" />
        </FormCard>
      )

      const formElement = document.getElementById('test-form')
      expect(formElement).toBeInTheDocument()
      expect(formElement?.tagName).toBe('FORM')
    })

    it('renders title when provided', () => {
      const form = createMockForm()

      render(
        <FormCard formId="test-form" form={form} title="Contact Us">
          <input name="test" />
        </FormCard>
      )

      expect(screen.getByText('Contact Us')).toBeInTheDocument()
    })

    it('renders description when provided', () => {
      const form = createMockForm()

      render(
        <FormCard formId="test-form" form={form} description="Fill out this form to contact us">
          <input name="test" />
        </FormCard>
      )

      expect(screen.getByText('Fill out this form to contact us')).toBeInTheDocument()
    })

    it('renders both title and description', () => {
      const form = createMockForm()

      render(
        <FormCard
          formId="test-form"
          form={form}
          title="Contact Us"
          description="Fill out this form"
        >
          <input name="test" />
        </FormCard>
      )

      expect(screen.getByText('Contact Us')).toBeInTheDocument()
      expect(screen.getByText('Fill out this form')).toBeInTheDocument()
    })

    it('does not render header when neither title nor description provided', () => {
      const form = createMockForm()

      const { container } = render(
        <FormCard formId="test-form" form={form}>
          <input name="test" />
        </FormCard>
      )

      // CardHeader should not be present
      expect(container.querySelector('[data-slot="card-header"]')).toBeNull()
    })

    it('renders children inside the form', () => {
      const form = createMockForm()

      render(
        <FormCard formId="test-form" form={form}>
          <input name="email" data-testid="email-input" />
        </FormCard>
      )

      expect(screen.getByTestId('email-input')).toBeInTheDocument()
    })

    it('renders reset and submit buttons', () => {
      const form = createMockForm()

      render(
        <FormCard formId="test-form" form={form}>
          <input name="test" />
        </FormCard>
      )

      expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
    })

    it('submit button has correct form attribute', () => {
      const form = createMockForm()

      render(
        <FormCard formId="my-custom-form" form={form}>
          <input name="test" />
        </FormCard>
      )

      const submitButton = screen.getByRole('button', { name: 'Submit' })
      expect(submitButton).toHaveAttribute('form', 'my-custom-form')
    })

    it('applies custom className', () => {
      const form = createMockForm()

      const { container } = render(
        <FormCard formId="test-form" form={form} className="custom-class">
          <input name="test" />
        </FormCard>
      )

      const card = container.firstChild
      expect(card).toHaveClass('custom-class')
    })
  })

  describe('form submission', () => {
    it('prevents default form submission', () => {
      const form = createMockForm()

      render(
        <FormCard formId="test-form" form={form}>
          <input name="test" />
        </FormCard>
      )

      const formElement = document.getElementById('test-form') as HTMLFormElement

      const submitEvent = new Event('submit', {
        bubbles: true,
        cancelable: true
      })
      const preventDefaultSpy = vi.spyOn(submitEvent, 'preventDefault')

      formElement.dispatchEvent(submitEvent)

      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('calls handleSubmit on form submission', () => {
      const form = createMockForm()

      render(
        <FormCard formId="test-form" form={form}>
          <input name="test" />
        </FormCard>
      )

      const formElement = document.getElementById('test-form') as HTMLFormElement
      fireEvent.submit(formElement)

      expect(form.handleSubmit).toHaveBeenCalledTimes(1)
    })
  })

  describe('null values', () => {
    it('handles null title', () => {
      const form = createMockForm()

      render(
        <FormCard formId="test-form" form={form} title={null}>
          <input name="test" />
        </FormCard>
      )

      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
    })

    it('handles null description', () => {
      const form = createMockForm()

      render(
        <FormCard formId="test-form" form={form} title="Contact" description={null}>
          <input name="test" />
        </FormCard>
      )

      expect(screen.getByText('Contact')).toBeInTheDocument()
    })
  })
})
