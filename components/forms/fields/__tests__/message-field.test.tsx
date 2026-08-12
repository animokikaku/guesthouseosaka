import { fireEvent, render, screen } from '@testing-library/react'
import { createMockFieldApi } from './test-utils'

// Import after mocking
import { MessageField } from '../message-field'

describe('MessageField', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders textarea', () => {
      const fieldApi = createMockFieldApi('message', '')

      render(<MessageField field={fieldApi} />)

      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('renders with label', () => {
      const fieldApi = createMockFieldApi('message', '')

      render(<MessageField field={fieldApi} label="Your message" />)

      expect(screen.getByText('Your message')).toBeInTheDocument()
    })

    it('renders without label when not provided', () => {
      const fieldApi = createMockFieldApi('message', '')

      render(<MessageField field={fieldApi} />)

      // No label element should be present
      expect(screen.queryByRole('label')).not.toBeInTheDocument()
    })

    it('renders with description', () => {
      const fieldApi = createMockFieldApi('message', '')

      render(<MessageField field={fieldApi} description="Enter your message here" />)

      expect(screen.getByText('Enter your message here')).toBeInTheDocument()
    })

    it('does not render description when null', () => {
      const fieldApi = createMockFieldApi('message', '')

      render(<MessageField field={fieldApi} description={null} />)

      expect(screen.queryByText('Enter your message here')).not.toBeInTheDocument()
    })
  })

  describe('optional hint', () => {
    it('shows optional hint when required is false', () => {
      const fieldApi = createMockFieldApi('message', '')

      render(<MessageField field={fieldApi} label="Message" required={false} />)

      // The optional hint uses t('optional_hint') which returns 'optional_hint'
      expect(screen.getByText('(optional_hint)')).toBeInTheDocument()
    })

    it('does not show optional hint when required is true', () => {
      const fieldApi = createMockFieldApi('message', '')

      render(<MessageField field={fieldApi} label="Message" required />)

      expect(screen.queryByText('(optional_hint)')).not.toBeInTheDocument()
    })

    it('does not show optional hint when label is not provided', () => {
      const fieldApi = createMockFieldApi('message', '')

      render(<MessageField field={fieldApi} required={false} />)

      // No label means no optional hint displayed
      expect(screen.queryByText('(optional_hint)')).not.toBeInTheDocument()
    })
  })

  describe('character counter', () => {
    it('displays character counter with current count', () => {
      const fieldApi = createMockFieldApi('message', 'Hello', {
        value: 'Hello'
      })

      render(<MessageField field={fieldApi} />)

      // The character counter uses t('character_counter', { count, max })
      // which returns 'character_counter' in the mock
      expect(screen.getByText('character_counter')).toBeInTheDocument()
    })

    it('shows counter for empty message', () => {
      const fieldApi = createMockFieldApi('message', '')

      render(<MessageField field={fieldApi} />)

      expect(screen.getByText('character_counter')).toBeInTheDocument()
    })
  })

  describe('onChange handler', () => {
    it('calls handleChange when text is entered', () => {
      const fieldApi = createMockFieldApi('message', '')

      render(<MessageField field={fieldApi} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'Hello world' } })

      expect(fieldApi.handleChange).toHaveBeenCalledWith('Hello world')
    })

    it('calls handleChange with empty string when cleared', () => {
      const fieldApi = createMockFieldApi('message', 'existing text', {
        value: 'existing text'
      })

      render(<MessageField field={fieldApi} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: '' } })

      expect(fieldApi.handleChange).toHaveBeenCalledWith('')
    })
  })

  describe('onBlur handler', () => {
    it('calls handleBlur when textarea loses focus', () => {
      const fieldApi = createMockFieldApi('message', '')

      render(<MessageField field={fieldApi} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.blur(textarea)

      expect(fieldApi.handleBlur).toHaveBeenCalled()
    })
  })

  describe('error state display', () => {
    it('does not show an error when the visibility policy hides it', () => {
      const fieldApi = createMockFieldApi('message', '', { errors: [] })

      render(<MessageField field={fieldApi} />)

      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('shows the error when the field has visible errors', () => {
      const fieldApi = createMockFieldApi('message', '', {
        errors: [{ message: 'Message is required' }]
      })

      render(<MessageField field={fieldApi} />)

      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('Message is required')).toBeInTheDocument()
    })

    it('sets aria-invalid on textarea when field is invalid', () => {
      const fieldApi = createMockFieldApi('message', '', { errors: [{ message: 'Required' }] })

      render(<MessageField field={fieldApi} />)

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('aria-invalid', 'true')
    })

    it('does not set aria-invalid when field is valid', () => {
      const fieldApi = createMockFieldApi('message', 'Some text', { errors: [] })

      render(<MessageField field={fieldApi} />)

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('aria-invalid', 'false')
    })
  })

  describe('textarea value', () => {
    it('displays current field value', () => {
      const fieldApi = createMockFieldApi('message', 'Test message', {
        value: 'Test message'
      })

      render(<MessageField field={fieldApi} />)

      const textarea = screen.getByRole<HTMLTextAreaElement>('textbox')
      expect(textarea.value).toBe('Test message')
    })

    it('displays empty string when value is empty', () => {
      const fieldApi = createMockFieldApi('message', '')

      render(<MessageField field={fieldApi} />)

      const textarea = screen.getByRole<HTMLTextAreaElement>('textbox')
      expect(textarea.value).toBe('')
    })
  })

  describe('field naming', () => {
    it('sets correct id based on field name', () => {
      const fieldApi = createMockFieldApi('myMessage', '')

      render(<MessageField field={fieldApi} />)

      const textarea = screen.getByRole('textbox')
      expect(textarea.id).toMatch(/^form-tanstack-message-.+-myMessage$/)
    })

    it('sets name attribute based on field name', () => {
      const fieldApi = createMockFieldApi('contactMessage', '')

      render(<MessageField field={fieldApi} />)

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('name', 'contactMessage')
    })
  })

  describe('props forwarding', () => {
    it('forwards placeholder prop', () => {
      const fieldApi = createMockFieldApi('message', '')

      render(<MessageField field={fieldApi} placeholder="Enter your message..." />)

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('placeholder', 'Enter your message...')
    })

    it('forwards rows prop', () => {
      const fieldApi = createMockFieldApi('message', '')

      render(<MessageField field={fieldApi} rows={10} />)

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('rows', '10')
    })
  })
})
