import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  createMockFieldApi,
  createFieldContext,
  FieldContextWrapper
} from './test-utils'

// Create a test field context
const testFieldContext = createFieldContext<string>()

// Mock the form-context module
vi.mock('@/components/forms/form-context', async () => {
  const React = await import('react')
  return {
    useFieldContext: () => React.useContext(testFieldContext)
  }
})

// Import after mocking
import { MessageField } from '../message-field'

describe('MessageField', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders textarea', () => {
      const fieldApi = createMockFieldApi('message', '')

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <MessageField />
        </FieldContextWrapper>
      )

      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('renders with label', () => {
      const fieldApi = createMockFieldApi('message', '')

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <MessageField label="Your message" />
        </FieldContextWrapper>
      )

      expect(screen.getByText('Your message')).toBeInTheDocument()
    })

    it('renders without label when not provided', () => {
      const fieldApi = createMockFieldApi('message', '')

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <MessageField />
        </FieldContextWrapper>
      )

      // No label element should be present
      expect(screen.queryByRole('label')).not.toBeInTheDocument()
    })

    it('renders with description', () => {
      const fieldApi = createMockFieldApi('message', '')

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <MessageField description="Enter your message here" />
        </FieldContextWrapper>
      )

      expect(screen.getByText('Enter your message here')).toBeInTheDocument()
    })

    it('does not render description when null', () => {
      const fieldApi = createMockFieldApi('message', '')

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <MessageField description={null} />
        </FieldContextWrapper>
      )

      expect(
        screen.queryByText('Enter your message here')
      ).not.toBeInTheDocument()
    })
  })

  describe('optional hint', () => {
    it('shows optional hint when required is false', () => {
      const fieldApi = createMockFieldApi('message', '')

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <MessageField label="Message" required={false} />
        </FieldContextWrapper>
      )

      // The optional hint uses t('optional_hint') which returns 'optional_hint'
      expect(screen.getByText('(optional_hint)')).toBeInTheDocument()
    })

    it('does not show optional hint when required is true', () => {
      const fieldApi = createMockFieldApi('message', '')

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <MessageField label="Message" required />
        </FieldContextWrapper>
      )

      expect(screen.queryByText('(optional_hint)')).not.toBeInTheDocument()
    })

    it('does not show optional hint when label is not provided', () => {
      const fieldApi = createMockFieldApi('message', '')

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <MessageField required={false} />
        </FieldContextWrapper>
      )

      // No label means no optional hint displayed
      expect(screen.queryByText('(optional_hint)')).not.toBeInTheDocument()
    })
  })

  describe('character counter', () => {
    it('displays character counter with current count', () => {
      const fieldApi = createMockFieldApi('message', 'Hello', {
        value: 'Hello'
      })

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <MessageField />
        </FieldContextWrapper>
      )

      // The character counter uses t('character_counter', { count, max })
      // which returns 'character_counter' in the mock
      expect(screen.getByText('character_counter')).toBeInTheDocument()
    })

    it('shows counter for empty message', () => {
      const fieldApi = createMockFieldApi('message', '')

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <MessageField />
        </FieldContextWrapper>
      )

      expect(screen.getByText('character_counter')).toBeInTheDocument()
    })
  })

  describe('onChange handler', () => {
    it('calls handleChange when text is entered', () => {
      const fieldApi = createMockFieldApi('message', '')

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <MessageField />
        </FieldContextWrapper>
      )

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'Hello world' } })

      expect(fieldApi.handleChange).toHaveBeenCalledWith('Hello world')
    })

    it('calls handleChange with empty string when cleared', () => {
      const fieldApi = createMockFieldApi('message', 'existing text', {
        value: 'existing text'
      })

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <MessageField />
        </FieldContextWrapper>
      )

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: '' } })

      expect(fieldApi.handleChange).toHaveBeenCalledWith('')
    })
  })

  describe('onBlur handler', () => {
    it('calls handleBlur when textarea loses focus', () => {
      const fieldApi = createMockFieldApi('message', '')

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <MessageField />
        </FieldContextWrapper>
      )

      const textarea = screen.getByRole('textbox')
      fireEvent.blur(textarea)

      expect(fieldApi.handleBlur).toHaveBeenCalled()
    })
  })

  describe('error state display', () => {
    it('does not show error when field is not touched', () => {
      const fieldApi = createMockFieldApi('message', '', {
        isTouched: false,
        isValid: false,
        errors: [{ message: 'Message is required' }]
      })

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <MessageField />
        </FieldContextWrapper>
      )

      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('shows error when field is touched and invalid', () => {
      const fieldApi = createMockFieldApi('message', '', {
        isTouched: true,
        isValid: false,
        errors: [{ message: 'Message is required' }]
      })

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <MessageField />
        </FieldContextWrapper>
      )

      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('Message is required')).toBeInTheDocument()
    })

    it('sets aria-invalid on textarea when field is invalid', () => {
      const fieldApi = createMockFieldApi('message', '', {
        isTouched: true,
        isValid: false,
        errors: [{ message: 'Required' }]
      })

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <MessageField />
        </FieldContextWrapper>
      )

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('aria-invalid', 'true')
    })

    it('does not set aria-invalid when field is valid', () => {
      const fieldApi = createMockFieldApi('message', 'Some text', {
        isTouched: true,
        isValid: true
      })

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <MessageField />
        </FieldContextWrapper>
      )

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('aria-invalid', 'false')
    })
  })

  describe('textarea value', () => {
    it('displays current field value', () => {
      const fieldApi = createMockFieldApi('message', 'Test message', {
        value: 'Test message'
      })

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <MessageField />
        </FieldContextWrapper>
      )

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      expect(textarea.value).toBe('Test message')
    })

    it('displays empty string when value is empty', () => {
      const fieldApi = createMockFieldApi('message', '')

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <MessageField />
        </FieldContextWrapper>
      )

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      expect(textarea.value).toBe('')
    })
  })

  describe('field naming', () => {
    it('sets correct id based on field name', () => {
      const fieldApi = createMockFieldApi('myMessage', '')

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <MessageField />
        </FieldContextWrapper>
      )

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('id', 'form-tanstack-message-myMessage')
    })

    it('sets name attribute based on field name', () => {
      const fieldApi = createMockFieldApi('contactMessage', '')

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <MessageField />
        </FieldContextWrapper>
      )

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('name', 'contactMessage')
    })
  })

  describe('props forwarding', () => {
    it('forwards placeholder prop', () => {
      const fieldApi = createMockFieldApi('message', '')

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <MessageField placeholder="Enter your message..." />
        </FieldContextWrapper>
      )

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('placeholder', 'Enter your message...')
    })

    it('forwards rows prop', () => {
      const fieldApi = createMockFieldApi('message', '')

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <MessageField rows={10} />
        </FieldContextWrapper>
      )

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('rows', '10')
    })
  })
})
