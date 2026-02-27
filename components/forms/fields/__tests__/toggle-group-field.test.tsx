import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createMockFieldApi, createFieldContext, FieldContextWrapper } from './test-utils'

// Mock matchMedia for Radix UI
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

// Create a test field context
const testFieldContext = createFieldContext<string[]>()

// Mock the form-context module
vi.mock('@/components/forms/form-context', async () => {
  const React = await import('react')
  return {
    useFieldContext: () => React.useContext(testFieldContext)
  }
})

// Import after mocking
import { ToggleGroupField } from '../toggle-group-field'

const defaultOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' }
]

describe('ToggleGroupField', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders toggle group with options', () => {
      const fieldApi = createMockFieldApi('toggleField', [] as string[])

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <ToggleGroupField options={defaultOptions} />
        </FieldContextWrapper>
      )

      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Option 2')).toBeInTheDocument()
      expect(screen.getByText('Option 3')).toBeInTheDocument()
    })

    it('renders with label', () => {
      const fieldApi = createMockFieldApi('toggleField', [] as string[])

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <ToggleGroupField label="Choose options" options={defaultOptions} />
        </FieldContextWrapper>
      )

      expect(screen.getByText('Choose options')).toBeInTheDocument()
    })

    it('renders with description', () => {
      const fieldApi = createMockFieldApi('toggleField', [] as string[])

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <ToggleGroupField options={defaultOptions} description="Select one or more options" />
        </FieldContextWrapper>
      )

      expect(screen.getByText('Select one or more options')).toBeInTheDocument()
    })

    it('renders without description when null', () => {
      const fieldApi = createMockFieldApi('toggleField', [] as string[])

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <ToggleGroupField options={defaultOptions} description={null} />
        </FieldContextWrapper>
      )

      // No description text should be present
      expect(screen.queryByText('Select one or more options')).not.toBeInTheDocument()
    })
  })

  describe('selection states', () => {
    it('renders with no options selected initially', () => {
      const fieldApi = createMockFieldApi('toggleField', [] as string[])

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <ToggleGroupField options={defaultOptions} />
        </FieldContextWrapper>
      )

      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('data-state', 'off')
      })
    })

    it('renders with selected options', () => {
      const fieldApi = createMockFieldApi('toggleField', ['option1', 'option3'], {
        value: ['option1', 'option3']
      })

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <ToggleGroupField options={defaultOptions} />
        </FieldContextWrapper>
      )

      const buttons = screen.getAllByRole('button')
      expect(buttons[0]).toHaveAttribute('data-state', 'on')
      expect(buttons[1]).toHaveAttribute('data-state', 'off')
      expect(buttons[2]).toHaveAttribute('data-state', 'on')
    })
  })

  describe('onChange handler', () => {
    it('calls handleChange when option is toggled on', () => {
      const fieldApi = createMockFieldApi('toggleField', [] as string[])

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <ToggleGroupField options={defaultOptions} />
        </FieldContextWrapper>
      )

      const firstOption = screen.getByText('Option 1').closest('button')!
      fireEvent.click(firstOption)

      expect(fieldApi.handleChange).toHaveBeenCalledWith(['option1'])
    })

    it('calls handleChange when option is toggled off', () => {
      const fieldApi = createMockFieldApi('toggleField', ['option1'], {
        value: ['option1']
      })

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <ToggleGroupField options={defaultOptions} />
        </FieldContextWrapper>
      )

      const firstOption = screen.getByText('Option 1').closest('button')!
      fireEvent.click(firstOption)

      expect(fieldApi.handleChange).toHaveBeenCalledWith([])
    })

    it('calls handleChange with multiple selections', () => {
      const fieldApi = createMockFieldApi('toggleField', ['option1'], {
        value: ['option1']
      })

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <ToggleGroupField options={defaultOptions} />
        </FieldContextWrapper>
      )

      const secondOption = screen.getByText('Option 2').closest('button')!
      fireEvent.click(secondOption)

      expect(fieldApi.handleChange).toHaveBeenCalledWith(['option1', 'option2'])
    })
  })

  describe('onBlur handler', () => {
    it('calls handleBlur when toggle group loses focus', () => {
      const fieldApi = createMockFieldApi('toggleField', [] as string[])

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <ToggleGroupField options={defaultOptions} />
        </FieldContextWrapper>
      )

      // Find the toggle group container by its data-slot attribute
      // There are multiple groups, so we need to be specific
      const toggleGroup = document.querySelector('[data-slot="checkbox-group"]')!
      fireEvent.blur(toggleGroup)

      expect(fieldApi.handleBlur).toHaveBeenCalled()
    })
  })

  describe('error state display', () => {
    it('does not show error when field is not touched', () => {
      const fieldApi = createMockFieldApi('toggleField', [] as string[], {
        isTouched: false,
        isValid: false,
        errors: [{ message: 'Please select at least one option' }]
      })

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <ToggleGroupField options={defaultOptions} />
        </FieldContextWrapper>
      )

      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('shows error when field is touched and invalid', () => {
      const fieldApi = createMockFieldApi('toggleField', [] as string[], {
        isTouched: true,
        isValid: false,
        errors: [{ message: 'Please select at least one option' }]
      })

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <ToggleGroupField options={defaultOptions} />
        </FieldContextWrapper>
      )

      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('Please select at least one option')).toBeInTheDocument()
    })

    it('sets aria-invalid on toggle items when field is invalid', () => {
      const fieldApi = createMockFieldApi('toggleField', [] as string[], {
        isTouched: true,
        isValid: false,
        errors: [{ message: 'Required' }]
      })

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <ToggleGroupField options={defaultOptions} />
        </FieldContextWrapper>
      )

      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('aria-invalid', 'true')
      })
    })
  })

  describe('custom option rendering', () => {
    it('renders options with custom className', () => {
      const fieldApi = createMockFieldApi('toggleField', [] as string[])

      const optionsWithClass = [
        { value: 'opt1', label: 'Option 1', className: 'custom-class-1' },
        { value: 'opt2', label: 'Option 2', className: 'custom-class-2' }
      ]

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <ToggleGroupField options={optionsWithClass} />
        </FieldContextWrapper>
      )

      const buttons = screen.getAllByRole('button')
      expect(buttons[0]).toHaveClass('custom-class-1')
      expect(buttons[1]).toHaveClass('custom-class-2')
    })

    it('renders options with React node labels', () => {
      const fieldApi = createMockFieldApi('toggleField', [] as string[])

      const optionsWithNodes = [
        {
          value: 'opt1',
          label: <span data-testid="custom-label">Custom Label</span>
        }
      ]

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <ToggleGroupField options={optionsWithNodes} />
        </FieldContextWrapper>
      )

      expect(screen.getByTestId('custom-label')).toBeInTheDocument()
    })
  })
})
