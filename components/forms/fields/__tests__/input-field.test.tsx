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
    name: 'testInput',
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

import { InputField } from '../input-field'

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

describe('InputField', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders input with label', () => {
      const fieldApi = createMockFieldApi()

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <InputField label="Email" />
        </FieldContextWrapper>
      )

      expect(screen.getByRole('textbox')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
    })

    it('renders input without label', () => {
      const fieldApi = createMockFieldApi()

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <InputField />
        </FieldContextWrapper>
      )

      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('renders input with description', () => {
      const fieldApi = createMockFieldApi()

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <InputField label="Email" description="Enter your email address" />
        </FieldContextWrapper>
      )

      expect(screen.getByText('Enter your email address')).toBeInTheDocument()
    })

    it('associates label with input via htmlFor', () => {
      const fieldApi = createMockFieldApi()

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <InputField label="Email" />
        </FieldContextWrapper>
      )

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
      const fieldApi = createMockFieldApi({ value: 'test@example.com' })

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <InputField label="Email" />
        </FieldContextWrapper>
      )

      expect(screen.getByRole('textbox')).toHaveValue('test@example.com')
    })

    it('renders empty when value is empty string', () => {
      const fieldApi = createMockFieldApi({ value: '' })

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <InputField label="Email" />
        </FieldContextWrapper>
      )

      expect(screen.getByRole('textbox')).toHaveValue('')
    })
  })

  describe('onChange handler', () => {
    it('calls handleChange when input value changes', () => {
      const fieldApi = createMockFieldApi()

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <InputField label="Email" />
        </FieldContextWrapper>
      )

      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'test@example.com' } })

      expect(fieldApi.handleChange).toHaveBeenCalledWith('test@example.com')
    })

    it('calls handleBlur when input loses focus', () => {
      const fieldApi = createMockFieldApi()

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <InputField label="Email" />
        </FieldContextWrapper>
      )

      const input = screen.getByRole('textbox')
      fireEvent.blur(input)

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
          <InputField label="Email" />
        </FieldContextWrapper>
      )

      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('shows error when field is touched and invalid', () => {
      const fieldApi = createMockFieldApi({
        isTouched: true,
        isValid: false,
        errors: [{ message: 'This field is required' }]
      })

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <InputField label="Email" />
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
          <InputField label="Email" />
        </FieldContextWrapper>
      )

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })
  })

  describe('input types', () => {
    it('passes through type prop', () => {
      const fieldApi = createMockFieldApi()

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <InputField label="Password" type="password" />
        </FieldContextWrapper>
      )

      expect(screen.getByLabelText('Password')).toHaveAttribute(
        'type',
        'password'
      )
    })

    it('passes through placeholder prop', () => {
      const fieldApi = createMockFieldApi()

      render(
        <FieldContextWrapper fieldApi={fieldApi}>
          <InputField label="Email" placeholder="Enter email" />
        </FieldContextWrapper>
      )

      expect(screen.getByRole('textbox')).toHaveAttribute(
        'placeholder',
        'Enter email'
      )
    })
  })
})
