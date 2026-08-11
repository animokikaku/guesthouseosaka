import { fireEvent, render, screen } from '@testing-library/react'
import { createMockFieldApi } from './test-utils'

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

      render(<ToggleGroupField field={fieldApi} options={defaultOptions} />)

      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Option 2')).toBeInTheDocument()
      expect(screen.getByText('Option 3')).toBeInTheDocument()
    })

    it('renders with label', () => {
      const fieldApi = createMockFieldApi('toggleField', [] as string[])

      render(<ToggleGroupField field={fieldApi} label="Choose options" options={defaultOptions} />)

      expect(screen.getByText('Choose options')).toBeInTheDocument()
    })

    it('renders with description', () => {
      const fieldApi = createMockFieldApi('toggleField', [] as string[])

      render(
        <ToggleGroupField
          field={fieldApi}
          options={defaultOptions}
          description="Select one or more options"
        />
      )

      expect(screen.getByText('Select one or more options')).toBeInTheDocument()
    })

    it('renders without description when null', () => {
      const fieldApi = createMockFieldApi('toggleField', [] as string[])

      render(<ToggleGroupField field={fieldApi} options={defaultOptions} description={null} />)

      // No description text should be present
      expect(screen.queryByText('Select one or more options')).not.toBeInTheDocument()
    })
  })

  describe('selection states', () => {
    it('renders with no options selected initially', () => {
      const fieldApi = createMockFieldApi('toggleField', [] as string[])

      render(<ToggleGroupField field={fieldApi} options={defaultOptions} />)

      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).not.toHaveAttribute('data-pressed')
      })
    })

    it('renders with selected options', () => {
      const fieldApi = createMockFieldApi('toggleField', ['option1', 'option3'], {
        value: ['option1', 'option3']
      })

      render(<ToggleGroupField field={fieldApi} options={defaultOptions} />)

      const buttons = screen.getAllByRole('button')
      expect(buttons[0]).toHaveAttribute('data-pressed')
      expect(buttons[1]).not.toHaveAttribute('data-pressed')
      expect(buttons[2]).toHaveAttribute('data-pressed')
    })
  })

  describe('onChange handler', () => {
    it('calls handleChange when option is toggled on', () => {
      const fieldApi = createMockFieldApi('toggleField', [] as string[])

      render(<ToggleGroupField field={fieldApi} options={defaultOptions} />)

      const firstOption = screen.getByText('Option 1').closest('button')!
      fireEvent.click(firstOption)

      expect(fieldApi.handleChange).toHaveBeenCalledWith(['option1'])
    })

    it('calls handleChange when option is toggled off', () => {
      const fieldApi = createMockFieldApi('toggleField', ['option1'], {
        value: ['option1']
      })

      render(<ToggleGroupField field={fieldApi} options={defaultOptions} />)

      const firstOption = screen.getByText('Option 1').closest('button')!
      fireEvent.click(firstOption)

      expect(fieldApi.handleChange).toHaveBeenCalledWith([])
    })

    it('calls handleChange with multiple selections', () => {
      const fieldApi = createMockFieldApi('toggleField', ['option1'], {
        value: ['option1']
      })

      render(<ToggleGroupField field={fieldApi} options={defaultOptions} />)

      const secondOption = screen.getByText('Option 2').closest('button')!
      fireEvent.click(secondOption)

      expect(fieldApi.handleChange).toHaveBeenCalledWith(['option1', 'option2'])
    })
  })

  describe('onBlur handler', () => {
    it('calls handleBlur when toggle group loses focus', () => {
      const fieldApi = createMockFieldApi('toggleField', [] as string[])

      render(<ToggleGroupField field={fieldApi} options={defaultOptions} />)

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

      render(<ToggleGroupField field={fieldApi} options={defaultOptions} />)

      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('shows error when field is touched and invalid', () => {
      const fieldApi = createMockFieldApi('toggleField', [] as string[], {
        isTouched: true,
        isValid: false,
        errors: [{ message: 'Please select at least one option' }]
      })

      render(<ToggleGroupField field={fieldApi} options={defaultOptions} />)

      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('Please select at least one option')).toBeInTheDocument()
    })

    it('sets aria-invalid on toggle items when field is invalid', () => {
      const fieldApi = createMockFieldApi('toggleField', [] as string[], {
        isTouched: true,
        isValid: false,
        errors: [{ message: 'Required' }]
      })

      render(<ToggleGroupField field={fieldApi} options={defaultOptions} />)

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

      render(<ToggleGroupField field={fieldApi} options={optionsWithClass} />)

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

      render(<ToggleGroupField field={fieldApi} options={optionsWithNodes} />)

      expect(screen.getByTestId('custom-label')).toBeInTheDocument()
    })
  })
})
