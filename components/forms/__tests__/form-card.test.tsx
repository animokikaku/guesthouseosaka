import { fireEvent, render, screen } from '@testing-library/react'
import { Store, type AnyReactFormApi } from '@tanstack/react-form'
import { FormCard } from '../form-card'

function createMockForm() {
  // FormCard forwards this to the real submit/reset buttons, which read
  // `atom` and `reset`.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return {
    handleSubmit: vi.fn(),
    reset: vi.fn(),
    atom: new Store({ isSubmitting: false })
  } as unknown as AnyReactFormApi & { handleSubmit: ReturnType<typeof vi.fn> }
}

function TestInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input aria-label="Test input" name="test" {...props} />
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
          <TestInput />
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
          <TestInput />
        </FormCard>
      )

      expect(screen.getByText('Contact Us')).toBeInTheDocument()
    })

    it('renders description when provided', () => {
      const form = createMockForm()

      render(
        <FormCard formId="test-form" form={form} description="Fill out this form to contact us">
          <TestInput />
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
          <TestInput />
        </FormCard>
      )

      expect(screen.getByText('Contact Us')).toBeInTheDocument()
      expect(screen.getByText('Fill out this form')).toBeInTheDocument()
    })

    it('does not render header when neither title nor description provided', () => {
      const form = createMockForm()

      const { container } = render(
        <FormCard formId="test-form" form={form}>
          <TestInput />
        </FormCard>
      )

      // CardHeader should not be present
      expect(container.querySelector('[data-slot="card-header"]')).toBeNull()
    })

    it('renders children inside the form', () => {
      const form = createMockForm()

      render(
        <FormCard formId="test-form" form={form}>
          <TestInput name="email" data-testid="email-input" />
        </FormCard>
      )

      expect(screen.getByTestId('email-input')).toBeInTheDocument()
    })

    it('renders reset and submit buttons', () => {
      const form = createMockForm()

      const { container } = render(
        <FormCard formId="test-form" form={form}>
          <TestInput />
        </FormCard>
      )

      expect(container.querySelector('button[type="reset"]')).toBeInTheDocument()
      expect(container.querySelector('button[type="submit"]')).toBeInTheDocument()
    })

    it('submit button has correct form attribute', () => {
      const form = createMockForm()

      const { container } = render(
        <FormCard formId="my-custom-form" form={form}>
          <TestInput />
        </FormCard>
      )

      const submitButton = container.querySelector('button[type="submit"]')
      expect(submitButton).toHaveAttribute('form', 'my-custom-form')
    })

    it('applies custom className', () => {
      const form = createMockForm()

      const { container } = render(
        <FormCard formId="test-form" form={form} className="custom-class">
          <TestInput />
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
          <TestInput />
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
          <TestInput />
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

      const { container } = render(
        <FormCard formId="test-form" form={form} title={null}>
          <TestInput />
        </FormCard>
      )

      expect(container.querySelector('button[type="submit"]')).toBeInTheDocument()
    })

    it('handles null description', () => {
      const form = createMockForm()

      render(
        <FormCard formId="test-form" form={form} title="Contact" description={null}>
          <TestInput />
        </FormCard>
      )

      expect(screen.getByText('Contact')).toBeInTheDocument()
    })
  })
})
