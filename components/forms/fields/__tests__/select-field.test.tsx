import { render, screen } from '@testing-library/react'
import { createMockFieldApi } from './test-utils'

import { SelectField } from '../select-field'

const defaultOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' }
]

describe('SelectField', () => {
  describe('rendering', () => {
    it('renders select trigger', () => {
      const fieldApi = createMockFieldApi('testSelect', '')

      render(<SelectField field={fieldApi} options={defaultOptions} />)

      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('renders with label', () => {
      const fieldApi = createMockFieldApi('testSelect', '')

      render(<SelectField field={fieldApi} label="Country" options={defaultOptions} />)

      expect(screen.getByText('Country')).toBeInTheDocument()
    })

    it('renders without label', () => {
      const fieldApi = createMockFieldApi('testSelect', '')

      const { container } = render(<SelectField field={fieldApi} options={defaultOptions} />)

      expect(container.querySelector('label')).not.toBeInTheDocument()
    })

    it('renders with description', () => {
      const fieldApi = createMockFieldApi('testSelect', '')

      render(
        <SelectField
          field={fieldApi}
          label="Country"
          description="Select your country"
          options={defaultOptions}
        />
      )

      expect(screen.getByText('Select your country')).toBeInTheDocument()
    })

    it('renders with placeholder', () => {
      const fieldApi = createMockFieldApi('testSelect', '')

      render(<SelectField field={fieldApi} options={defaultOptions} placeholder="Choose..." />)

      expect(screen.getByText('Choose...')).toBeInTheDocument()
    })

    it('associates label with select via htmlFor', () => {
      const fieldApi = createMockFieldApi('testSelect', '')

      render(<SelectField field={fieldApi} label="Country" options={defaultOptions} />)

      const trigger = screen.getByRole('combobox')
      expect(trigger.id).toMatch(/^form-tanstack-select-.+-testSelect$/)

      const label = screen.getByText('Country')
      expect(label.closest('label')).toHaveAttribute('for', trigger.id)
    })
  })

  describe('value handling', () => {
    it('displays selected value', () => {
      const fieldApi = createMockFieldApi('testSelect', '', {
        value: 'option2'
      })

      render(<SelectField field={fieldApi} options={defaultOptions} />)

      expect(screen.getByText('Option 2')).toBeInTheDocument()
    })
  })

  describe('error state display', () => {
    it('does not show an error when the visibility policy hides it', () => {
      const fieldApi = createMockFieldApi('testSelect', '', { errors: [] })

      render(<SelectField field={fieldApi} options={defaultOptions} />)

      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('shows the error when the field has visible errors', () => {
      const fieldApi = createMockFieldApi('testSelect', '', {
        errors: [{ message: 'This field is required' }]
      })

      render(<SelectField field={fieldApi} options={defaultOptions} />)

      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('This field is required')).toBeInTheDocument()
    })

    it('sets aria-invalid when the field has visible errors', () => {
      const fieldApi = createMockFieldApi('testSelect', '', { errors: [{ message: 'Required' }] })

      render(<SelectField field={fieldApi} options={defaultOptions} />)

      const trigger = screen.getByRole('combobox')
      expect(trigger).toHaveAttribute('aria-invalid', 'true')
    })

    it('does not set aria-invalid when field is valid', () => {
      const fieldApi = createMockFieldApi('testSelect', '', { errors: [] })

      render(<SelectField field={fieldApi} options={defaultOptions} />)

      const trigger = screen.getByRole('combobox')
      expect(trigger).not.toHaveAttribute('aria-invalid', 'true')
    })
  })

  describe('props wiring', () => {
    it('passes field name to select', () => {
      const fieldApi = createMockFieldApi('countrySelect', '')

      render(<SelectField field={fieldApi} options={defaultOptions} />)

      const trigger = screen.getByRole('combobox')
      expect(trigger.id).toMatch(/^form-tanstack-select-.+-countrySelect$/)
    })
  })
})
