// @vitest-environment node

import { reduceOptimisticArray } from '../sanity-optimistic'

type Link = { _key: string; label: string }
type Settings = { links?: Link[] }

const reduce = reduceOptimisticArray<Link, Link[] | null, Settings>('settings', (doc) => doc.links)

// What the query resolved: localized labels the raw document doesn't have.
const current: Link[] = [
  { _key: 'fb', label: 'Facebook (resolved)' },
  { _key: 'ig', label: 'Instagram (resolved)' }
]

describe('reduceOptimisticArray', () => {
  it('follows the Studio order while keeping already-resolved items', () => {
    const next = reduce(current, {
      id: 'settings',
      document: {
        links: [
          { _key: 'ig', label: 'raw' },
          { _key: 'fb', label: 'raw' }
        ]
      }
    })

    expect(next).toEqual([current[1], current[0]])
  })

  it('shows a newly added item as the Studio sent it', () => {
    const added = { _key: 'x', label: 'X' }

    expect(reduce(current, { id: 'settings', document: { links: [...current, added] } })).toEqual([
      ...current,
      added
    ])
  })

  it('drops an item removed in the Studio', () => {
    expect(reduce(current, { id: 'settings', document: { links: [current[0]] } })).toEqual([
      current[0]
    ])
  })

  it.each([
    ['another document', { id: 'house', document: { links: [] } }],
    ['an edit that leaves the field alone', { id: 'settings', document: {} }]
  ])('ignores %s', (_name, action) => {
    expect(reduce(current, action)).toBe(current)
  })
})
