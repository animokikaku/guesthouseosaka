import { render, screen } from '@testing-library/react'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createFieldContext,
  createMockFieldApi,
  FieldContextWrapper,
  type MockFieldApi
} from './test-utils'

// Mock matchMedia for Radix UI Select
beforeAll(() => {
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
})

const testFieldContext = createFieldContext<string>()

vi.mock('@/components/forms/form-context', async () => {
  const React = await import('react')
  return {
    useFieldContext: () => React.useContext(testFieldContext)
  }
})

import { SelectField } from '../select-field'

const defaultOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' }
]

function renderWithContext(ui: React.ReactElement, fieldApi: MockFieldApi<string>) {
  return render(
    <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
      {ui}
    </FieldContextWrapper>
  )
}

describe('SelectField', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders select trigger', () => {
      const fieldApi = createMockFieldApi('testSelect', '')

      renderWithContext(<SelectField options={defaultOptions} />, fieldApi)

      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('renders with label', () => {
      const fieldApi = createMockFieldApi('testSelect', '')

      renderWithContext(<SelectField label="Country" options={defaultOptions} />, fieldApi)

      expect(screen.getByText('Country')).toBeInTheDocument()
    })

    it('renders without label', () => {
      const fieldApi = createMockFieldApi('testSelect', '')

      const { container } = renderWithContext(<SelectField options={defaultOptions} />, fieldApi)

      expect(container.querySelector('label')).not.toBeInTheDocument()
    })

    it('renders with description', () => {
      const fieldApi = createMockFieldApi('testSelect', '')

      renderWithContext(
        <SelectField label="Country" description="Select your country" options={defaultOptions} />,
        fieldApi
      )

      expect(screen.getByText('Select your country')).toBeInTheDocument()
    })

    it('renders with placeholder', () => {
      const fieldApi = createMockFieldApi('testSelect', '')

      renderWithContext(<SelectField options={defaultOptions} placeholder="Choose..." />, fieldApi)

      expect(screen.getByText('Choose...')).toBeInTheDocument()
    })

    it('associates label with select via htmlFor', () => {
      const fieldApi = createMockFieldApi('testSelect', '')

      renderWithContext(<SelectField label="Country" options={defaultOptions} />, fieldApi)

      const trigger = screen.getByRole('combobox')
      expect(trigger).toHaveAttribute('id', 'form-tanstack-select-testSelect')

      const label = screen.getByText('Country')
      expect(label.closest('label')).toHaveAttribute('for', 'form-tanstack-select-testSelect')
    })
  })

  describe('value handling', () => {
    it('displays selected value', () => {
      const fieldApi = createMockFieldApi('testSelect', '', {
        value: 'option2'
      })

      renderWithContext(<SelectField options={defaultOptions} />, fieldApi)

      expect(screen.getByText('Option 2')).toBeInTheDocument()
    })
  })

  describe('error state display', () => {
    it('does not show error when field is not touched', () => {
      const fieldApi = createMockFieldApi('testSelect', '', {
        isTouched: false,
        isValid: false,
        errors: [{ message: 'This field is required' }]
      })

      renderWithContext(<SelectField options={defaultOptions} />, fieldApi)

      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('shows error when field is touched and invalid', () => {
      const fieldApi = createMockFieldApi('testSelect', '', {
        isTouched: true,
        isValid: false,
        errors: [{ message: 'This field is required' }]
      })

      renderWithContext(<SelectField options={defaultOptions} />, fieldApi)

      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('This field is required')).toBeInTheDocument()
    })

    it('sets aria-invalid when field is touched and invalid', () => {
      const fieldApi = createMockFieldApi('testSelect', '', {
        isTouched: true,
        isValid: false,
        errors: [{ message: 'Required' }]
      })

      renderWithContext(<SelectField options={defaultOptions} />, fieldApi)

      const trigger = screen.getByRole('combobox')
      expect(trigger).toHaveAttribute('aria-invalid', 'true')
    })

    it('does not set aria-invalid when field is valid', () => {
      const fieldApi = createMockFieldApi('testSelect', '', {
        isTouched: true,
        isValid: true
      })

      renderWithContext(<SelectField options={defaultOptions} />, fieldApi)

      const trigger = screen.getByRole('combobox')
      expect(trigger).not.toHaveAttribute('aria-invalid', 'true')
    })
  })

  describe('props wiring', () => {
    it('passes field name to select', () => {
      const fieldApi = createMockFieldApi('countrySelect', '')

      renderWithContext(<SelectField options={defaultOptions} />, fieldApi)

      const trigger = screen.getByRole('combobox')
      expect(trigger).toHaveAttribute('id', 'form-tanstack-select-countrySelect')
    })
  })
})
