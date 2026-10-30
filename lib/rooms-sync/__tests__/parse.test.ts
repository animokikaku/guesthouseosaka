// @vitest-environment node

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  normalizeStatus,
  ParseError,
  parseDate,
  parseListing,
  type ParsedRoom,
  validateRooms
} from '../parse'

// The Japanese listing pages as fetched on 2026-10-28.
function fixture(propertyId: string) {
  return readFileSync(join(__dirname, 'fixtures', `q_${propertyId}.html`), 'utf8')
}

function room(overrides: Partial<ParsedRoom> = {}): ParsedRoom {
  return {
    propertyId: '1',
    roomNumber: '101',
    status: 'occupied',
    statusText: '入居中',
    availableFrom: null,
    areaM2: null,
    areaTatami: null,
    rent: 50000,
    deposit: 30000,
    commonFee: 10000,
    ...overrides
  }
}

describe('normalizeStatus', () => {
  it.each([
    ['空室', 'available'],
    ['空室予定', 'upcoming'],
    ['入居中', 'occupied'],
    ['Available', 'available'],
    ['Available  Soon', 'upcoming'],
    ['N/A', 'occupied']
  ])('maps "%s" to %s', (label, status) => {
    expect(normalizeStatus(label)).toBe(status)
  })

  it('returns null for a label it does not know', () => {
    expect(normalizeStatus('募集停止')).toBeNull()
  })
})

describe('parseDate', () => {
  it.each([
    ['2026/11/27', '2026-11-27'],
    ['2026-1-5', '2026-01-05'],
    ['2026年11月27日', '2026-11-27'],
    ['20270517', '2027-05-17']
  ])('reads %s as %s', (text, date) => {
    expect(parseDate(text)).toBe(date)
  })

  it.each(['2026/02/30', 'Nov 11th 2026', '11月上旬', '2027517'])('returns null for %s', (text) => {
    expect(parseDate(text)).toBeNull()
  })
})

describe('parseListing', () => {
  it('reads rooms sized in m²', () => {
    const rooms = parseListing(fixture('10333'), '10333')

    expect(rooms).toHaveLength(12)
    expect(rooms[0]).toEqual({
      propertyId: '10333',
      roomNumber: '201',
      status: 'occupied',
      statusText: '入居中',
      availableFrom: null,
      areaM2: 19,
      areaTatami: null,
      rent: 56000,
      deposit: 30000,
      commonFee: 10000
    })
    expect(rooms.at(-1)).toMatchObject({ roomNumber: '702', deposit: 10000 })
  })

  it('reads upcoming rooms with their date, and sizes in tatami', () => {
    const rooms = parseListing(fixture('10336'), '10336')

    expect(rooms).toHaveLength(30)
    expect(rooms.find((r) => r.roomNumber === '106')).toMatchObject({
      status: 'upcoming',
      availableFrom: '2026-11-27',
      areaM2: null,
      areaTatami: 7.5
    })
    expect(rooms.find((r) => r.roomNumber === '205')).toMatchObject({ areaTatami: 6, rent: 36000 })
    expect(rooms.filter((r) => r.status === 'upcoming').map((r) => r.roomNumber)).toEqual([
      '106',
      '201',
      '204',
      '208',
      '309'
    ])
  })

  it('reads a date written without separators', () => {
    const rooms = parseListing(fixture('10698'), '10698')

    expect(rooms).toHaveLength(23)
    expect(rooms.find((r) => r.roomNumber === '403')).toMatchObject({
      status: 'upcoming',
      availableFrom: '2027-05-17'
    })
  })

  it('passes validation for every fixture', () => {
    for (const id of ['10333', '10336', '10698']) {
      expect(validateRooms(parseListing(fixture(id), id)).problems).toEqual([])
    }
  })

  it('reads cells the browser would: unclosed, with entities and a `>` in an attribute', () => {
    const html = `<div id="room_vacancy1"><table>
      <tr><th>空室<br>情報<th>部屋番号<th><th><th>広さ<th><th><th>賃料<th>共益費</tr>
      <tr><td><p data-note="a > b">空室予定</p>2026/12/01<td>101<td><td><td>12&#13217;
          <td><td><td>&yen;48,000<br>[30,000]<td>&#xFFE5;10,000</tr>
    </table></div>`

    expect(parseListing(html, '1')).toEqual([
      expect.objectContaining({
        roomNumber: '101',
        status: 'upcoming',
        availableFrom: '2026-12-01',
        areaM2: 12,
        rent: 48_000,
        deposit: 30_000,
        commonFee: 10_000
      })
    ])
  })

  // A short table would unlist the rooms past the cut, so a page cut off
  // mid-table must fail rather than parse.
  it('throws when the page is cut off mid-table', () => {
    const html = fixture('10336')
    const tableEnd = html.indexOf('</table>', html.indexOf('id="room_vacancy1"'))

    expect(() => parseListing(html.slice(0, tableEnd), '10336')).toThrow(ParseError)
  })

  it('throws when the room table is missing', () => {
    expect(() => parseListing('<html><body>メンテナンス中</body></html>', '1')).toThrow(ParseError)
  })

  it('throws when the columns move', () => {
    const html = fixture('10333').replaceAll(
      '<th class="em4">広さ</th>',
      '<th class="em4">写真2</th>'
    )
    expect(() => parseListing(html, '10333')).toThrow(/expected one with "広さ"/)
  })
})

describe('validateRooms', () => {
  it('returns the rooms when every row is valid', () => {
    expect(validateRooms([room()])).toEqual({
      rooms: [expect.objectContaining({ status: 'occupied' })],
      problems: []
    })
  })

  it('rejects an empty listing', () => {
    expect(validateRooms([]).problems).toEqual(['No rooms found'])
  })

  it.each([
    [
      'an unknown status',
      room({ status: null, statusText: '募集停止' }),
      /unknown status "募集停止"/
    ],
    ['a blank room number', room({ roomNumber: '' }), /invalid room number/],
    ['an implausible rent', room({ rent: 5 }), /rent 5 out of range/]
  ])('reports %s', (_, row, problem) => {
    expect(validateRooms([row]).problems).toEqual([expect.stringMatching(problem)])
  })

  it('reports a room listed twice', () => {
    expect(validateRooms([room(), room()]).problems).toEqual(['Room "101": listed twice'])
  })
})
