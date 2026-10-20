// @vitest-environment node

import { createHmac } from 'node:crypto'
import { isValidLineSignature, textMessageEvents } from '../line'

const secret = 'channel-secret'
const sign = (body: string, key = secret) => createHmac('sha256', key).update(body).digest('base64')

describe('isValidLineSignature', () => {
  const body = JSON.stringify({ destination: 'U0', events: [] })

  it('accepts a body signed with the channel secret', () => {
    expect(isValidLineSignature(body, sign(body), secret)).toBe(true)
  })

  it.each([
    ['a missing signature', null],
    ['another secret', sign(body, 'other-secret')],
    ['a changed body', sign(`${body} `)],
    ['a malformed signature', 'not-base64!']
  ])('rejects %s', (_, signature) => {
    expect(isValidLineSignature(body, signature, secret)).toBe(false)
  })
})

describe('textMessageEvents', () => {
  const text = {
    type: 'message',
    replyToken: 'reply-1',
    source: { type: 'user', userId: 'U1' },
    message: { type: 'text', id: '1', text: 'Orange 106 free from Nov 27' }
  }

  it('keeps text messages with the fields the bot reads', () => {
    expect(textMessageEvents({ events: [text] })).toEqual([
      {
        type: 'message',
        replyToken: 'reply-1',
        source: { userId: 'U1' },
        message: { type: 'text', text: 'Orange 106 free from Nov 27' }
      }
    ])
  })

  it('skips stickers, follows and other events', () => {
    const sticker = { ...text, message: { type: 'sticker', id: '2' } }
    const follow = { type: 'follow', replyToken: 'reply-2', source: { userId: 'U1' } }
    expect(textMessageEvents({ events: [sticker, follow, text] })).toHaveLength(1)
  })

  it('returns nothing for a body without events', () => {
    expect(textMessageEvents({})).toEqual([])
    expect(textMessageEvents(null)).toEqual([])
  })
})
