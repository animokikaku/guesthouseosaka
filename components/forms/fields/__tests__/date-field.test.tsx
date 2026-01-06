import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createContext } from 'react'

interface MockFieldState {
  value: string
  meta: {
    isTouched: boolean
    isValid: boolean
    errors: Array<{ message: string }>
  }
}

interface MockFieldApi {
  name: string
  state: MockFieldState
  handleChange: ReturnType<typeof vi.fn>
  handleBlur: ReturnType<typeof vi.fn>
}

function createMockFieldState(
  overrides: {
    value?: string
    isTouched?: boolean
    isValid?: boolean
    errors?: Array<{ message: string }>
  } = {}
): MockFieldState {
  return {
    value: overrides.value ?? '',
    meta: {
      isTouched: overrides.isTouched ?? false,
      isValid: overrides.isValid ?? true,
      errors: overrides.errors ?? []
    }
  }
}

function createMockFieldApi(
  overrides: Parameters<typeof createMockFieldState>[0] = {}
): MockFieldApi {
  return {
    name: 'testDate',
    state: createMockFieldState(overrides),
    handleChange: vi.fn(),
    handleBlur: vi.fn()
  }
}

const testFieldContext = createContext<MockFieldApi | null>(null)

vi.mock('@/components/forms', async () => {
  const React = await import('react')
  return {
    useFieldContext: () => React.useContext(testFieldContext)
  }
})

import { DateField } from '../date-field'

function FieldContextWrapper({
  children,
  fieldApi
}: {
  children: React.ReactNode
  fieldApi: MockFieldApi
}) {
  return (
    <testFieldContext.Provider value={fieldApi}>
      {children}
    </testFieldContext.Provider>
  )
}

describe('DateField', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders date input with label', () => {
      const fieldApi = createMockFieldApi()

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <DateField label="Start Date" />
        </FieldContextWrapper>
      )

      const input = screen.getByLabelText('Start Date')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('type', 'date')
    })

    it('renders date input without label', () => {
      const fieldApi = createMockFieldApi()

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <DateField />
        </FieldContextWrapper>
      )

      const input = document.querySelector('input[type="date"]')
      expect(input).toBeInTheDocument()
    })

    it('renders date input with description', () => {
      const fieldApi = createMockFieldApi()

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <DateField label="Start Date" description="Select your move-in date" />
        </FieldContextWrapper>
      )

      expect(screen.getByText('Select your move-in date')).toBeInTheDocument()
    })

    it('associates label with input via htmlFor', () => {
      const fieldApi = createMockFieldApi()

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <DateField label="Start Date" />
        </FieldContextWrapper>
      )

      const input = screen.getByLabelText('Start Date')
      expect(input).toHaveAttribute('id', 'form-tanstack-date-testDate')
    })
  })

  describe('value handling', () => {
    it('renders with initial value', () => {
      const fieldApi = createMockFieldApi({ value: '2025-01-15' })

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <DateField label="Start Date" />
        </FieldContextWrapper>
      )

      expect(screen.getByLabelText('Start Date')).toHaveValue('2025-01-15')
    })

    it('renders empty when value is empty string', () => {
      const fieldApi = createMockFieldApi({ value: '' })

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <DateField label="Start Date" />
        </FieldContextWrapper>
      )

      expect(screen.getByLabelText('Start Date')).toHaveValue('')
    })
  })

  describe('onChange handler', () => {
    it('calls handleChange when date value changes', () => {
      const fieldApi = createMockFieldApi()

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <DateField label="Start Date" />
        </FieldContextWrapper>
      )

      const input = screen.getByLabelText('Start Date')
      fireEvent.change(input, { target: { value: '2025-02-20' } })

      expect(fieldApi.handleChange).toHaveBeenCalledWith('2025-02-20')
    })

    it('calls handleBlur when input loses focus', () => {
      const fieldApi = createMockFieldApi()

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <DateField label="Start Date" />
        </FieldContextWrapper>
      )

      const input = screen.getByLabelText('Start Date')
      fireEvent.blur(input)

      expect(fieldApi.handleBlur).toHaveBeenCalled()
    })
  })

  describe('error state display', () => {
    it('does not show error when field is not touched', () => {
      const fieldApi = createMockFieldApi({
        isTouched: false,
        isValid: false,
        errors: [{ message: 'Please select a date' }]
      })

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <DateField label="Start Date" />
        </FieldContextWrapper>
      )

      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('shows error when field is touched and invalid', () => {
      const fieldApi = createMockFieldApi({
        isTouched: true,
        isValid: false,
        errors: [{ message: 'Please select a date' }]
      })

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <DateField label="Start Date" />
        </FieldContextWrapper>
      )

      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('Please select a date')).toBeInTheDocument()
    })

    it('sets aria-invalid when field is touched and invalid', () => {
      const fieldApi = createMockFieldApi({
        isTouched: true,
        isValid: false,
        errors: [{ message: 'Required' }]
      })

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <DateField label="Start Date" />
        </FieldContextWrapper>
      )

      const input = screen.getByLabelText('Start Date')
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })
  })

  describe('date constraints', () => {
    it('passes through min prop', () => {
      const fieldApi = createMockFieldApi()

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <DateField label="Start Date" min="2025-01-01" />
        </FieldContextWrapper>
      )

      expect(screen.getByLabelText('Start Date')).toHaveAttribute(
        'min',
        '2025-01-01'
      )
    })

    it('passes through step prop', () => {
      const fieldApi = createMockFieldApi()

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <DateField label="Start Date" step={7} />
        </FieldContextWrapper>
      )

      expect(screen.getByLabelText('Start Date')).toHaveAttribute('step', '7')
    })
  })
})
