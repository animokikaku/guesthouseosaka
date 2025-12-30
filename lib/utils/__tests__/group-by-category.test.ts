import { describe, it, expect } from 'vitest'
import { groupByCategory } from '../group-by-category'
import { createCategorizedItem } from '@/lib/transforms/__tests__/mocks'

describe('groupByCategory', () => {
  it('returns empty array for null input', () => {
    expect(groupByCategory(null)).toEqual([])
  })

  it('returns empty array for empty array input', () => {
    expect(groupByCategory([])).toEqual([])
  })

  it('groups items by category.key correctly', () => {
    const items = [
      createCategorizedItem({ category: { key: 'a', orderRank: '0|a00000:' } }),
      createCategorizedItem({ category: { key: 'b', orderRank: '0|b00000:' } }),
      createCategorizedItem({ category: { key: 'a', orderRank: '0|a00000:' } })
    ]

    const result = groupByCategory(items)

    expect(result).toHaveLength(2)
    expect(result[0].key).toBe('a')
    expect(result[0].items).toHaveLength(2)
    expect(result[1].key).toBe('b')
    expect(result[1].items).toHaveLength(1)
  })

  it('skips items without category', () => {
    const items = [
      createCategorizedItem({ category: { key: 'a', orderRank: '0|a00000:' } }),
      createCategorizedItem({ category: null }),
      createCategorizedItem({ category: { key: 'a', orderRank: '0|a00000:' } })
    ]

    const result = groupByCategory(items)

    expect(result).toHaveLength(1)
    expect(result[0].items).toHaveLength(2)
  })

  it('sorts categories by orderRank ascending', () => {
    const items = [
      createCategorizedItem({ category: { key: 'c', orderRank: '0|c00000:' } }),
      createCategorizedItem({ category: { key: 'a', orderRank: '0|a00000:' } }),
      createCategorizedItem({ category: { key: 'b', orderRank: '0|b00000:' } })
    ]

    const result = groupByCategory(items)

    expect(result.map((c) => c.key)).toEqual(['a', 'b', 'c'])
  })

  it('handles null orderRank values by sorting to end', () => {
    const items = [
      createCategorizedItem({ category: { key: 'nullOrder', orderRank: null } }),
      createCategorizedItem({ category: { key: 'a', orderRank: '0|a00000:' } }),
      createCategorizedItem({ category: { key: 'b', orderRank: '0|b00000:' } })
    ]

    const result = groupByCategory(items)

    expect(result.map((c) => c.key)).toEqual(['a', 'b', 'nullOrder'])
  })

  it('preserves all category properties', () => {
    const items = [
      {
        _key: 'item1',
        category: {
          _id: 'cat-123',
          key: 'kitchen',
          label: 'Kitchen',
          orderRank: '0|a00000:',
          icon: 'utensils'
        }
      }
    ]

    const result = groupByCategory(items)

    expect(result[0]).toMatchObject({
      _id: 'cat-123',
      key: 'kitchen',
      label: 'Kitchen',
      orderRank: '0|a00000:',
      icon: 'utensils'
    })
    expect(result[0].items).toHaveLength(1)
  })

  it('handles duplicate category keys by merging items', () => {
    const items = [
      createCategorizedItem({ _key: 'item1', category: { key: 'same', orderRank: '0|a00000:' } }),
      createCategorizedItem({ _key: 'item2', category: { key: 'same', orderRank: '0|a00000:' } }),
      createCategorizedItem({ _key: 'item3', category: { key: 'same', orderRank: '0|a00000:' } })
    ]

    const result = groupByCategory(items)

    expect(result).toHaveLength(1)
    expect(result[0].items).toHaveLength(3)
    expect(result[0].items.map((i) => i._key)).toEqual(['item1', 'item2', 'item3'])
  })
})
