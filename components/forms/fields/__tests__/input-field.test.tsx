import { fireEvent, render, screen } from '@testing-library/react'
import { createMockFieldApi } from './test-utils'

import { InputField } from '../input-field'

describe('InputField', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders input with label', () => {
      const fieldApi = createMockFieldApi('testInput', '')

      render(<InputField field={fieldApi} label="Email" />)

      expect(screen.getByRole('textbox')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
    })

    it('renders input without label', () => {
      const fieldApi = createMockFieldApi('testInput', '')

      render(<InputField field={fieldApi} />)

      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('renders input with description', () => {
      const fieldApi = createMockFieldApi('testInput', '')

      render(<InputField field={fieldApi} label="Email" description="Enter your email address" />)

      expect(screen.getByText('Enter your email address')).toBeInTheDocument()
    })

    it('associates label with input via htmlFor', () => {
      const fieldApi = createMockFieldApi('testInput', '')

      render(<InputField field={fieldApi} label="Email" />)

      const input = screen.getByRole('textbox')
      expect(input.id).toMatch(/^form-tanstack-input-.+-testInput$/)

      const label = screen.getByText('Email')
      expect(label.closest('label')).toHaveAttribute('for', input.id)
    })
  })

  describe('value handling', () => {
    it('renders with initial value', () => {
      const fieldApi = createMockFieldApi('testInput', '', {
        value: 'test@example.com'
      })

      render(<InputField field={fieldApi} label="Email" />)

      expect(screen.getByRole('textbox')).toHaveValue('test@example.com')
    })

    it('renders empty when value is empty string', () => {
      const fieldApi = createMockFieldApi('testInput', '', { value: '' })

      render(<InputField field={fieldApi} label="Email" />)

      expect(screen.getByRole('textbox')).toHaveValue('')
    })
  })

  describe('onChange handler', () => {
    it('calls handleChange when input value changes', () => {
      const fieldApi = createMockFieldApi('testInput', '')

      render(<InputField field={fieldApi} label="Email" />)

      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'test@example.com' } })

      expect(fieldApi.handleChange).toHaveBeenCalledWith('test@example.com')
    })

    it('calls handleBlur when input loses focus', () => {
      const fieldApi = createMockFieldApi('testInput', '')

      render(<InputField field={fieldApi} label="Email" />)

      const input = screen.getByRole('textbox')
      fireEvent.blur(input)

      expect(fieldApi.handleBlur).toHaveBeenCalled()
    })
  })

  describe('error state display', () => {
    it('does not show error when field is not touched', () => {
      const fieldApi = createMockFieldApi('testInput', '', {
        isTouched: false,
        isValid: false,
        errors: [{ message: 'This field is required' }]
      })

      render(<InputField field={fieldApi} label="Email" />)

      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('shows error when field is touched and invalid', () => {
      const fieldApi = createMockFieldApi('testInput', '', {
        isTouched: true,
        isValid: false,
        errors: [{ message: 'This field is required' }]
      })

      render(<InputField field={fieldApi} label="Email" />)

      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('This field is required')).toBeInTheDocument()
    })

    it('sets aria-invalid when field is touched and invalid', () => {
      const fieldApi = createMockFieldApi('testInput', '', {
        isTouched: true,
        isValid: false,
        errors: [{ message: 'Required' }]
      })

      render(<InputField field={fieldApi} label="Email" />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })

    it('preserves generated ARIA relationships', () => {
      const fieldApi = createMockFieldApi('testInput', '', {
        isTouched: true,
        isValid: false,
        errors: [{ message: 'Required' }]
      })
      const conflictingAriaProps = {
        'aria-describedby': 'custom-description',
        'aria-errormessage': 'custom-error'
      }

      render(<InputField field={fieldApi} description="Description" {...conflictingAriaProps} />)

      const input = screen.getByRole('textbox')
      const description = screen.getByText('Description')
      const error = screen.getByRole('alert')
      expect(input).toHaveAttribute('aria-describedby', `${description.id} ${error.id}`)
      expect(input).toHaveAttribute('aria-errormessage', error.id)
    })
  })

  describe('input types', () => {
    it('passes through type prop', () => {
      const fieldApi = createMockFieldApi('testInput', '')

      render(<InputField field={fieldApi} label="Password" type="password" />)

      expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')
    })

    it('passes through placeholder prop', () => {
      const fieldApi = createMockFieldApi('testInput', '')

      render(<InputField field={fieldApi} label="Email" placeholder="Enter email" />)

      expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'Enter email')
    })
  })
})
