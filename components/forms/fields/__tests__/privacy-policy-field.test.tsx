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
const testFieldContext = createFieldContext<boolean>()

// Mock the form-context module
vi.mock('@/components/forms/form-context', async () => {
  const React = await import('react')
  return {
    useFieldContext: () => React.useContext(testFieldContext)
  }
})

// Capture onAgree callback from LegalNoticeDialog
let capturedOnAgree: (() => void) | undefined

vi.mock('@/components/legal-notice-dialog', () => ({
  LegalNoticeDialog: ({
    children,
    onAgree
  }: {
    children: React.ReactNode
    onAgree?: () => void
  }) => {
    capturedOnAgree = onAgree
    return <span>{children}</span>
  }
}))

// Override next-intl mock to exercise t.rich() callback
vi.mock('next-intl', () => {
  const t = (key: string) => key
  t.rich = (key: string, options?: Record<string, (chunks: string) => React.ReactNode>) => {
    if (options?.link) {
      return options.link('link text')
    }
    return key
  }
  t.raw = (key: string) => key
  t.markup = (key: string) => key
  return {
    useTranslations: () => t,
    useLocale: () => 'en'
  }
})

// Import after mocking
import { PrivacyPolicyField } from '../privacy-policy-field'

describe('PrivacyPolicyField', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    capturedOnAgree = undefined
  })

  describe('rendering', () => {
    it('renders checkbox with privacy policy label', () => {
      const fieldApi = createMockFieldApi('privacyPolicy', false)

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <PrivacyPolicyField />
        </FieldContextWrapper>
      )

      expect(screen.getByRole('checkbox')).toBeInTheDocument()
      // t.rich calls the link callback with 'link text'
      expect(screen.getByText('link text')).toBeInTheDocument()
    })
  })

  describe('checked/unchecked states', () => {
    it('renders unchecked when value is false', () => {
      const fieldApi = createMockFieldApi('privacyPolicy', false)

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <PrivacyPolicyField />
        </FieldContextWrapper>
      )

      expect(screen.getByRole('checkbox')).not.toBeChecked()
    })

    it('renders checked when value is true', () => {
      const fieldApi = createMockFieldApi('privacyPolicy', true, {
        value: true
      })

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <PrivacyPolicyField />
        </FieldContextWrapper>
      )

      expect(screen.getByRole('checkbox')).toBeChecked()
    })
  })

  describe('onChange handler', () => {
    it('calls handleChange with true when checkbox is clicked', () => {
      const fieldApi = createMockFieldApi('privacyPolicy', false)

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <PrivacyPolicyField />
        </FieldContextWrapper>
      )

      fireEvent.click(screen.getByRole('checkbox'))
      expect(fieldApi.handleChange).toHaveBeenCalledWith(true)
    })

    it('calls handleChange with false when checked checkbox is clicked', () => {
      const fieldApi = createMockFieldApi('privacyPolicy', true, {
        value: true
      })

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <PrivacyPolicyField />
        </FieldContextWrapper>
      )

      fireEvent.click(screen.getByRole('checkbox'))
      expect(fieldApi.handleChange).toHaveBeenCalledWith(false)
    })

    it('calls handleBlur when checkbox loses focus', () => {
      const fieldApi = createMockFieldApi('privacyPolicy', false)

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <PrivacyPolicyField />
        </FieldContextWrapper>
      )

      fireEvent.blur(screen.getByRole('checkbox'))
      expect(fieldApi.handleBlur).toHaveBeenCalled()
    })
  })

  describe('legal notice dialog', () => {
    it('calls handleChange(true) when onAgree is triggered', () => {
      const fieldApi = createMockFieldApi('privacyPolicy', false)

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <PrivacyPolicyField />
        </FieldContextWrapper>
      )

      // onAgree was captured by the LegalNoticeDialog mock
      expect(capturedOnAgree).toBeDefined()
      capturedOnAgree!()
      expect(fieldApi.handleChange).toHaveBeenCalledWith(true)
    })
  })

  describe('error state display', () => {
    it('does not show error when field is not touched', () => {
      const fieldApi = createMockFieldApi('privacyPolicy', false, {
        isTouched: false,
        isValid: false,
        errors: [{ message: 'You must accept the privacy policy' }]
      })

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <PrivacyPolicyField />
        </FieldContextWrapper>
      )

      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('shows error when field is touched and invalid', () => {
      const fieldApi = createMockFieldApi('privacyPolicy', false, {
        isTouched: true,
        isValid: false,
        errors: [{ message: 'You must accept the privacy policy' }]
      })

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <PrivacyPolicyField />
        </FieldContextWrapper>
      )

      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('You must accept the privacy policy')).toBeInTheDocument()
    })

    it('sets aria-invalid when field is touched and invalid', () => {
      const fieldApi = createMockFieldApi('privacyPolicy', false, {
        isTouched: true,
        isValid: false,
        errors: [{ message: 'Required' }]
      })

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <PrivacyPolicyField />
        </FieldContextWrapper>
      )

      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true')
    })

    it('does not set aria-invalid when field is valid', () => {
      const fieldApi = createMockFieldApi('privacyPolicy', true, {
        value: true,
        isTouched: true,
        isValid: true
      })

      render(
        <FieldContextWrapper fieldApi={fieldApi} context={testFieldContext}>
          <PrivacyPolicyField />
        </FieldContextWrapper>
      )

      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'false')
    })
  })
})
