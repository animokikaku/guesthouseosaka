// @vitest-environment node
import { typesToPurge } from '../content-types'

describe('typesToPurge', () => {
  it.each([
    ['a type pages read', { _id: 'faq-1', _type: 'faqQuestion' }, ['faqQuestion']],
    ['an asset', { _id: 'image-abc-1x1-jpg', _type: 'sanity.imageAsset' }, null],
    ['a type no loader lists', { _id: 'x', _type: 'newType' }, undefined],
    ['a body without a type', { _id: 'x' }, undefined]
  ])('purges for %s', (_, body, expected) => {
    expect(typesToPurge(JSON.stringify(body))).toEqual(expected)
  })

  it('purges everything for a body it cannot read', () => {
    expect(typesToPurge('not json')).toBeUndefined()
  })
})
