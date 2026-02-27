import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { render, screen } from '@testing-library/react'
import { HouseProvider, useHouseDocument } from '../house-context'

describe('HouseProvider', () => {
  it('provides context values to children', () => {
    function Consumer() {
      const { id, type, slug } = useHouseDocument()
      return <div data-testid="context">{`${id}-${type}-${slug}`}</div>
    }

    render(
      <HouseProvider id="house-1" type="house" slug="apple">
        <Consumer />
      </HouseProvider>
    )

    expect(screen.getByTestId('context')).toHaveTextContent('house-1-house-apple')
  })
})

describe('useHouseDocument', () => {
  it('throws when used outside HouseProvider', () => {
    expect(() => {
      renderHook(() => useHouseDocument())
    }).toThrow('useHouseDocument must be used within a HouseProvider')
  })
})
