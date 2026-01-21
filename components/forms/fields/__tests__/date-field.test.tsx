import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  createMockFieldApi,
  createFieldContext,
  FieldContextWrapper,
  type MockFieldApi
} from './test-utils'

const testFieldContext = createFieldContext<string>()

vi.mock('@/components/forms/form-context', async () => {
  const React = await import('react')
  return {
    useFieldContext: () => React.useContext(testFieldContext)
  }
})

import { DateField } from '../date-field'

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

describe('DateField', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders date input with label', () => {
      const fieldApi = createMockFieldApi('testDate', '')

      renderWithContext(<DateField label="Start Date" />, fieldApi)

      const input = screen.getByLabelText('Start Date')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('type', 'date')
    })

    it('renders date input without label', () => {
      const fieldApi = createMockFieldApi('testDate', '')

      renderWithContext(<DateField />, fieldApi)

      const input = document.querySelector('input[type="date"]')
      expect(input).toBeInTheDocument()
    })

    it('renders date input with description', () => {
      const fieldApi = createMockFieldApi('testDate', '')

      renderWithContext(
        <DateField label="Start Date" description="Select your move-in date" />,
        fieldApi
      )

      expect(screen.getByText('Select your move-in date')).toBeInTheDocument()
    })

    it('associates label with input via htmlFor', () => {
      const fieldApi = createMockFieldApi('testDate', '')

      renderWithContext(<DateField label="Start Date" />, fieldApi)

      const input = screen.getByLabelText('Start Date')
      expect(input).toHaveAttribute('id', 'form-tanstack-date-testDate')
    })
  })

  describe('value handling', () => {
    it('renders with initial value', () => {
      const fieldApi = createMockFieldApi('testDate', '', {
        value: '2025-01-15'
      })

      renderWithContext(<DateField label="Start Date" />, fieldApi)

      expect(screen.getByLabelText('Start Date')).toHaveValue('2025-01-15')
    })

    it('renders empty when value is empty string', () => {
      const fieldApi = createMockFieldApi('testDate', '', { value: '' })

      renderWithContext(<DateField label="Start Date" />, fieldApi)

      expect(screen.getByLabelText('Start Date')).toHaveValue('')
    })
  })

  describe('onChange handler', () => {
    it('calls handleChange when date value changes', () => {
      const fieldApi = createMockFieldApi('testDate', '')

      renderWithContext(<DateField label="Start Date" />, fieldApi)

      const input = screen.getByLabelText('Start Date')
      fireEvent.change(input, { target: { value: '2025-02-20' } })

      expect(fieldApi.handleChange).toHaveBeenCalledWith('2025-02-20')
    })

    it('calls handleBlur when input loses focus', () => {
      const fieldApi = createMockFieldApi('testDate', '')

      renderWithContext(<DateField label="Start Date" />, fieldApi)

      const input = screen.getByLabelText('Start Date')
      fireEvent.blur(input)

      expect(fieldApi.handleBlur).toHaveBeenCalled()
    })
  })

  describe('error state display', () => {
    it('does not show error when field is not touched', () => {
      const fieldApi = createMockFieldApi('testDate', '', {
        isTouched: false,
        isValid: false,
        errors: [{ message: 'Please select a date' }]
      })

      renderWithContext(<DateField label="Start Date" />, fieldApi)

      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('shows error when field is touched and invalid', () => {
      const fieldApi = createMockFieldApi('testDate', '', {
        isTouched: true,
        isValid: false,
        errors: [{ message: 'Please select a date' }]
      })

      renderWithContext(<DateField label="Start Date" />, fieldApi)

      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('Please select a date')).toBeInTheDocument()
    })

    it('sets aria-invalid when field is touched and invalid', () => {
      const fieldApi = createMockFieldApi('testDate', '', {
        isTouched: true,
        isValid: false,
        errors: [{ message: 'Required' }]
      })

      renderWithContext(<DateField label="Start Date" />, fieldApi)

      const input = screen.getByLabelText('Start Date')
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })
  })

  describe('date constraints', () => {
    it('passes through min prop', () => {
      const fieldApi = createMockFieldApi('testDate', '')

      renderWithContext(
        <DateField label="Start Date" min="2025-01-01" />,
        fieldApi
      )

      expect(screen.getByLabelText('Start Date')).toHaveAttribute(
        'min',
        '2025-01-01'
      )
    })

    it('passes through step prop', () => {
      const fieldApi = createMockFieldApi('testDate', '')

      renderWithContext(<DateField label="Start Date" step={7} />, fieldApi)

      expect(screen.getByLabelText('Start Date')).toHaveAttribute('step', '7')
    })
  })
})
