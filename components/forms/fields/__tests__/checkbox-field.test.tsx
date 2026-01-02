import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createContext } from 'react'

// Mock matchMedia for Radix UI - must be in beforeAll to ensure jsdom is available
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

// Create a mock field state factory
interface MockFieldState {
  value: boolean
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
    value?: boolean
    isTouched?: boolean
    isValid?: boolean
    errors?: Array<{ message: string }>
  } = {}
): MockFieldState {
  return {
    value: overrides.value ?? false,
    meta: {
      isTouched: overrides.isTouched ?? false,
      isValid: overrides.isValid ?? true,
      errors: overrides.errors ?? []
    }
  }
}

// Create a mock field API
function createMockFieldApi(
  overrides: Parameters<typeof createMockFieldState>[0] = {}
): MockFieldApi {
  return {
    name: 'testCheckbox',
    state: createMockFieldState(overrides),
    handleChange: vi.fn(),
    handleBlur: vi.fn()
  }
}

// Create a test field context - this needs to be accessible in the mock
const testFieldContext = createContext<MockFieldApi | null>(null)

// Mock the forms module to provide our test context
vi.mock('@/components/forms', async () => {
  const React = await import('react')
  return {
    useFieldContext: () => React.useContext(testFieldContext)
  }
})

// Import after mocking
import { CheckboxField } from '../checkbox-field'

// Wrapper component that provides the field context
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

describe('CheckboxField', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders checkbox with label', () => {
      const fieldApi = createMockFieldApi()

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <CheckboxField label="Accept terms" />
        </FieldContextWrapper>
      )

      expect(screen.getByRole('checkbox')).toBeInTheDocument()
      expect(screen.getByText('Accept terms')).toBeInTheDocument()
    })

    it('renders checkbox with legend', () => {
      const fieldApi = createMockFieldApi()

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <CheckboxField label="I agree" legend="Terms and Conditions" />
        </FieldContextWrapper>
      )

      expect(screen.getByText('Terms and Conditions')).toBeInTheDocument()
      expect(screen.getByText('I agree')).toBeInTheDocument()
    })

    it('renders checkbox with description', () => {
      const fieldApi = createMockFieldApi()

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <CheckboxField
            label="Subscribe"
            description="Receive weekly newsletter"
          />
        </FieldContextWrapper>
      )

      expect(screen.getByText('Receive weekly newsletter')).toBeInTheDocument()
    })

    it('associates label with checkbox via htmlFor', () => {
      const fieldApi = createMockFieldApi()

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <CheckboxField label="Accept terms" />
        </FieldContextWrapper>
      )

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute(
        'id',
        'form-tanstack-checkbox-testCheckbox'
      )

      // Verify the label is associated with the checkbox
      const label = screen.getByText('Accept terms')
      expect(label.closest('label')).toHaveAttribute(
        'for',
        'form-tanstack-checkbox-testCheckbox'
      )
    })
  })

  describe('checked/unchecked states', () => {
    it('renders unchecked when value is false', () => {
      const fieldApi = createMockFieldApi({ value: false })

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <CheckboxField label="Accept terms" />
        </FieldContextWrapper>
      )

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).not.toBeChecked()
      expect(checkbox).toHaveAttribute('data-state', 'unchecked')
    })

    it('renders checked when value is true', () => {
      const fieldApi = createMockFieldApi({ value: true })

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <CheckboxField label="Accept terms" />
        </FieldContextWrapper>
      )

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeChecked()
      expect(checkbox).toHaveAttribute('data-state', 'checked')
    })
  })

  describe('onChange handler', () => {
    it('calls handleChange with true when checkbox is clicked (checked)', () => {
      const fieldApi = createMockFieldApi({ value: false })

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <CheckboxField label="Accept terms" />
        </FieldContextWrapper>
      )

      const checkbox = screen.getByRole('checkbox')
      fireEvent.click(checkbox)

      expect(fieldApi.handleChange).toHaveBeenCalledWith(true)
    })

    it('calls handleChange with false when checked checkbox is clicked', () => {
      const fieldApi = createMockFieldApi({ value: true })

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <CheckboxField label="Accept terms" />
        </FieldContextWrapper>
      )

      const checkbox = screen.getByRole('checkbox')
      fireEvent.click(checkbox)

      expect(fieldApi.handleChange).toHaveBeenCalledWith(false)
    })

    it('calls handleBlur when checkbox loses focus', () => {
      const fieldApi = createMockFieldApi()

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <CheckboxField label="Accept terms" />
        </FieldContextWrapper>
      )

      const checkbox = screen.getByRole('checkbox')
      fireEvent.blur(checkbox)

      expect(fieldApi.handleBlur).toHaveBeenCalled()
    })
  })

  describe('error state display', () => {
    it('does not show error when field is not touched', () => {
      const fieldApi = createMockFieldApi({
        isTouched: false,
        isValid: false,
        errors: [{ message: 'This field is required' }]
      })

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <CheckboxField label="Accept terms" />
        </FieldContextWrapper>
      )

      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(
        screen.queryByText('This field is required')
      ).not.toBeInTheDocument()
    })

    it('shows error when field is touched and invalid', () => {
      const fieldApi = createMockFieldApi({
        isTouched: true,
        isValid: false,
        errors: [{ message: 'This field is required' }]
      })

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <CheckboxField label="Accept terms" />
        </FieldContextWrapper>
      )

      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('This field is required')).toBeInTheDocument()
    })

    it('sets aria-invalid when field is touched and invalid', () => {
      const fieldApi = createMockFieldApi({
        isTouched: true,
        isValid: false,
        errors: [{ message: 'Required' }]
      })

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <CheckboxField label="Accept terms" />
        </FieldContextWrapper>
      )

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('aria-invalid', 'true')
    })

    it('does not set aria-invalid when field is valid', () => {
      const fieldApi = createMockFieldApi({
        isTouched: true,
        isValid: true
      })

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <CheckboxField label="Accept terms" />
        </FieldContextWrapper>
      )

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('aria-invalid', 'false')
    })
  })

  describe('disabled state', () => {
    it('renders as disabled when disabled prop is true', () => {
      const fieldApi = createMockFieldApi()

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <CheckboxField label="Accept terms" disabled />
        </FieldContextWrapper>
      )

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeDisabled()
    })

    it('renders as enabled when disabled prop is false', () => {
      const fieldApi = createMockFieldApi()

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <CheckboxField label="Accept terms" disabled={false} />
        </FieldContextWrapper>
      )

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).not.toBeDisabled()
    })

    it('does not call handleChange when disabled checkbox is clicked', () => {
      const fieldApi = createMockFieldApi()

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <CheckboxField label="Accept terms" disabled />
        </FieldContextWrapper>
      )

      const checkbox = screen.getByRole('checkbox')
      fireEvent.click(checkbox)

      expect(fieldApi.handleChange).not.toHaveBeenCalled()
    })
  })
})
