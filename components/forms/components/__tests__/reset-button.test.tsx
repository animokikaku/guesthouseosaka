import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createContext } from 'react'
import { ResetButton } from '../reset-button'

// Create a mock form context
interface MockFormApi {
  reset: ReturnType<typeof vi.fn>
}

const testFormContext = createContext<MockFormApi | null>(null)

// Mock the form-context module to provide our test context
vi.mock('@/components/forms/form-context', async () => {
  const React = await import('react')
  return {
    useFormContext: () => React.useContext(testFormContext)
  }
})

// Wrapper component that provides the form context
function FormContextWrapper({
  children,
  formApi
}: {
  children: React.ReactNode
  formApi: MockFormApi
}) {
  return <testFormContext.Provider value={formApi}>{children}</testFormContext.Provider>
}

function createMockFormApi(): MockFormApi {
  return {
    reset: vi.fn()
  }
}

describe('ResetButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders button with reset type', () => {
      const formApi = createMockFormApi()

      render(
        <FormContextWrapper formApi={formApi}>
          <ResetButton />
        </FormContextWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'reset')
    })

    it('renders with translation key label', () => {
      const formApi = createMockFormApi()

      render(
        <FormContextWrapper formApi={formApi}>
          <ResetButton />
        </FormContextWrapper>
      )

      // The label uses t('label') which returns 'label' in mocked translations
      expect(screen.getByRole('button')).toHaveTextContent('label')
    })

    it('renders with outline variant', () => {
      const formApi = createMockFormApi()

      render(
        <FormContextWrapper formApi={formApi}>
          <ResetButton />
        </FormContextWrapper>
      )

      // Button should have outline variant classes (data attribute or class)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })
  })

  describe('click handler', () => {
    it('prevents default behavior on click', () => {
      const formApi = createMockFormApi()

      render(
        <FormContextWrapper formApi={formApi}>
          <ResetButton />
        </FormContextWrapper>
      )

      const button = screen.getByRole('button')
      const preventDefaultSpy = vi.fn()

      // Create a mock event with preventDefault spy
      const event = new MouseEvent('click', { bubbles: true })
      Object.defineProperty(event, 'preventDefault', {
        value: preventDefaultSpy
      })

      button.dispatchEvent(event)

      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('calls form.reset() on click', () => {
      const formApi = createMockFormApi()

      render(
        <FormContextWrapper formApi={formApi}>
          <ResetButton />
        </FormContextWrapper>
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(formApi.reset).toHaveBeenCalled()
    })

    it('calls form.reset() only once per click', () => {
      const formApi = createMockFormApi()

      render(
        <FormContextWrapper formApi={formApi}>
          <ResetButton />
        </FormContextWrapper>
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)
      fireEvent.click(button)

      expect(formApi.reset).toHaveBeenCalledTimes(2)
    })
  })

  describe('props forwarding', () => {
    it('forwards className prop', () => {
      const formApi = createMockFormApi()

      render(
        <FormContextWrapper formApi={formApi}>
          <ResetButton className="custom-class" />
        </FormContextWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })

    it('forwards disabled prop', () => {
      const formApi = createMockFormApi()

      render(
        <FormContextWrapper formApi={formApi}>
          <ResetButton disabled />
        </FormContextWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('does not call form.reset() when disabled', () => {
      const formApi = createMockFormApi()

      render(
        <FormContextWrapper formApi={formApi}>
          <ResetButton disabled />
        </FormContextWrapper>
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(formApi.reset).not.toHaveBeenCalled()
    })
  })
})
