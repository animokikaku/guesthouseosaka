import { fireEvent, render, screen } from '@testing-library/react'
import { createMockFieldApi } from './test-utils'

// Import after mocking
import { InputGroupField } from '../input-group-field'

describe('InputGroupField', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders input with correct name and value', () => {
      const fieldApi = createMockFieldApi('amount', '100')

      render(<InputGroupField field={fieldApi} />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('name', 'amount')
      expect(input).toHaveValue('100')
    })

    it('renders with label', () => {
      const fieldApi = createMockFieldApi('price', '')

      render(<InputGroupField field={fieldApi} label="Price" />)

      expect(screen.getByText('Price')).toBeInTheDocument()
    })

    it('renders without label when not provided', () => {
      const fieldApi = createMockFieldApi('price', '')

      render(<InputGroupField field={fieldApi} />)

      // Input should exist but no label
      expect(screen.getByRole('textbox')).toBeInTheDocument()
      expect(screen.queryByRole('label')).not.toBeInTheDocument()
    })

    it('renders with description', () => {
      const fieldApi = createMockFieldApi('price', '')

      render(<InputGroupField field={fieldApi} description="Enter the price in USD" />)

      expect(screen.getByText('Enter the price in USD')).toBeInTheDocument()
    })

    it('renders without description when not provided', () => {
      const fieldApi = createMockFieldApi('price', '')

      render(<InputGroupField field={fieldApi} />)

      expect(screen.queryByText('Enter the price')).not.toBeInTheDocument()
    })

    it('renders with icon addon', () => {
      const fieldApi = createMockFieldApi('price', '')

      render(<InputGroupField field={fieldApi} icon={<span data-testid="currency-icon">$</span>} />)

      expect(screen.getByTestId('currency-icon')).toBeInTheDocument()
    })

    it('renders without icon addon when not provided', () => {
      const fieldApi = createMockFieldApi('price', '')

      render(<InputGroupField field={fieldApi} />)

      expect(screen.queryByTestId('currency-icon')).not.toBeInTheDocument()
    })
  })

  describe('onChange handler', () => {
    it('calls handleChange with input value on change', () => {
      const fieldApi = createMockFieldApi('amount', '')

      render(<InputGroupField field={fieldApi} />)

      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: '250' } })

      expect(fieldApi.handleChange).toHaveBeenCalledWith('250')
    })

    it('calls handleChange on each input change', () => {
      const fieldApi = createMockFieldApi('amount', '')

      render(<InputGroupField field={fieldApi} />)

      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: '1' } })
      fireEvent.change(input, { target: { value: '12' } })
      fireEvent.change(input, { target: { value: '123' } })

      expect(fieldApi.handleChange).toHaveBeenCalledTimes(3)
      expect(fieldApi.handleChange).toHaveBeenNthCalledWith(1, '1')
      expect(fieldApi.handleChange).toHaveBeenNthCalledWith(2, '12')
      expect(fieldApi.handleChange).toHaveBeenNthCalledWith(3, '123')
    })
  })

  describe('onBlur handler', () => {
    it('calls handleBlur when input loses focus', () => {
      const fieldApi = createMockFieldApi('amount', '')

      render(<InputGroupField field={fieldApi} />)

      const input = screen.getByRole('textbox')
      fireEvent.blur(input)

      expect(fieldApi.handleBlur).toHaveBeenCalled()
    })

    it('calls handleBlur only once per blur event', () => {
      const fieldApi = createMockFieldApi('amount', '')

      render(<InputGroupField field={fieldApi} />)

      const input = screen.getByRole('textbox')
      fireEvent.blur(input)
      fireEvent.blur(input)

      expect(fieldApi.handleBlur).toHaveBeenCalledTimes(2)
    })
  })

  describe('error state', () => {
    it('does not show error when field is not touched', () => {
      const fieldApi = createMockFieldApi('amount', '', {
        isTouched: false,
        isValid: false,
        errors: [{ message: 'Amount is required' }]
      })

      render(<InputGroupField field={fieldApi} />)

      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('shows error when field is touched and invalid', () => {
      const fieldApi = createMockFieldApi('amount', '', {
        isTouched: true,
        isValid: false,
        errors: [{ message: 'Amount is required' }]
      })

      render(<InputGroupField field={fieldApi} />)

      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('Amount is required')).toBeInTheDocument()
    })

    it('sets aria-invalid on input when field is invalid', () => {
      const fieldApi = createMockFieldApi('amount', '', {
        isTouched: true,
        isValid: false,
        errors: [{ message: 'Required' }]
      })

      render(<InputGroupField field={fieldApi} />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })

    it('does not set aria-invalid when field is valid', () => {
      const fieldApi = createMockFieldApi('amount', '100', {
        isTouched: true,
        isValid: true
      })

      render(<InputGroupField field={fieldApi} />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-invalid', 'false')
    })

    it('preserves generated ARIA relationships', () => {
      const fieldApi = createMockFieldApi('amount', '', {
        isTouched: true,
        isValid: false,
        errors: [{ message: 'Required' }]
      })
      const conflictingAriaProps = {
        'aria-describedby': 'custom-description',
        'aria-errormessage': 'custom-error'
      }

      render(
        <InputGroupField field={fieldApi} description="Description" {...conflictingAriaProps} />
      )

      const input = screen.getByRole('textbox')
      const description = screen.getByText('Description')
      const error = screen.getByRole('alert')
      expect(input).toHaveAttribute('aria-describedby', `${description.id} ${error.id}`)
      expect(input).toHaveAttribute('aria-errormessage', error.id)
    })
  })

  describe('input attributes', () => {
    it('generates correct id from field name', () => {
      const fieldApi = createMockFieldApi('monthlyBudget', '')

      render(<InputGroupField field={fieldApi} />)

      const input = screen.getByRole('textbox')
      expect(input.id).toMatch(/^form-tanstack-input-group-.+-monthlyBudget$/)
    })

    it('forwards additional props to input', () => {
      const fieldApi = createMockFieldApi('amount', '')

      render(<InputGroupField field={fieldApi} placeholder="Enter amount" type="number" />)

      const input = screen.getByPlaceholderText('Enter amount')
      expect(input).toHaveAttribute('type', 'number')
    })
  })
})
