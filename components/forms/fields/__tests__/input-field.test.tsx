import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  createMockFieldApi,
  createFieldContext,
  FieldContextWrapper,
  type MockFieldApi
} from './test-utils'

const testFieldContext = createFieldContext<string>()

vi.mock('@/components/forms', async () => {
  const React = await import('react')
  return {
    useFieldContext: () => React.useContext(testFieldContext)
  }
})

import { InputField } from '../input-field'

function renderWithContext(
  ui: React.ReactElement,
  fieldApi: MockFieldApi<string>
) {
  return render(
    <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
      {ui}
    </FieldContextWrapper>
  )
}

describe('InputField', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders input with label', () => {
      const fieldApi = createMockFieldApi('testInput', '')

      renderWithContext(<InputField label="Email" />, fieldApi)

      expect(screen.getByRole('textbox')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
    })

    it('renders input without label', () => {
      const fieldApi = createMockFieldApi('testInput', '')

      renderWithContext(<InputField />, fieldApi)

      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('renders input with description', () => {
      const fieldApi = createMockFieldApi('testInput', '')

      renderWithContext(
        <InputField label="Email" description="Enter your email address" />,
        fieldApi
      )

      expect(screen.getByText('Enter your email address')).toBeInTheDocument()
    })

    it('associates label with input via htmlFor', () => {
      const fieldApi = createMockFieldApi('testInput', '')

      renderWithContext(<InputField label="Email" />, fieldApi)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('id', 'form-tanstack-input-testInput')

      const label = screen.getByText('Email')
      expect(label.closest('label')).toHaveAttribute(
        'for',
        'form-tanstack-input-testInput'
      )
    })
  })

  describe('value handling', () => {
    it('renders with initial value', () => {
      const fieldApi = createMockFieldApi('testInput', '', {
        value: 'test@example.com'
      })

      renderWithContext(<InputField label="Email" />, fieldApi)

      expect(screen.getByRole('textbox')).toHaveValue('test@example.com')
    })

    it('renders empty when value is empty string', () => {
      const fieldApi = createMockFieldApi('testInput', '', { value: '' })

      renderWithContext(<InputField label="Email" />, fieldApi)

      expect(screen.getByRole('textbox')).toHaveValue('')
    })
  })

  describe('onChange handler', () => {
    it('calls handleChange when input value changes', () => {
      const fieldApi = createMockFieldApi('testInput', '')

      renderWithContext(<InputField label="Email" />, fieldApi)

      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'test@example.com' } })

      expect(fieldApi.handleChange).toHaveBeenCalledWith('test@example.com')
    })

    it('calls handleBlur when input loses focus', () => {
      const fieldApi = createMockFieldApi('testInput', '')

      renderWithContext(<InputField label="Email" />, fieldApi)

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

      renderWithContext(<InputField label="Email" />, fieldApi)

      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('shows error when field is touched and invalid', () => {
      const fieldApi = createMockFieldApi('testInput', '', {
        isTouched: true,
        isValid: false,
        errors: [{ message: 'This field is required' }]
      })

      renderWithContext(<InputField label="Email" />, fieldApi)

      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('This field is required')).toBeInTheDocument()
    })

    it('sets aria-invalid when field is touched and invalid', () => {
      const fieldApi = createMockFieldApi('testInput', '', {
        isTouched: true,
        isValid: false,
        errors: [{ message: 'Required' }]
      })

      renderWithContext(<InputField label="Email" />, fieldApi)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })
  })

  describe('input types', () => {
    it('passes through type prop', () => {
      const fieldApi = createMockFieldApi('testInput', '')

      renderWithContext(<InputField label="Password" type="password" />, fieldApi)

      expect(screen.getByLabelText('Password')).toHaveAttribute(
        'type',
        'password'
      )
    })

    it('passes through placeholder prop', () => {
      const fieldApi = createMockFieldApi('testInput', '')

      renderWithContext(
        <InputField label="Email" placeholder="Enter email" />,
        fieldApi
      )

      expect(screen.getByRole('textbox')).toHaveAttribute(
        'placeholder',
        'Enter email'
      )
    })
  })
})
