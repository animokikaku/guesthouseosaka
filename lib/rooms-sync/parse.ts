/**
 * Reads the room table of a shares.house listing's Japanese page. The English
 * page has the same table, but its dates are typed by hand in any format
 * (`Nov 11th 2026`, `2027may17`), where the Japanese ones are numeric.
 */
import { parse, type HTMLElement } from 'node-html-parser'
import type { Room, RoomStatus } from './room'

/** The page doesn't have the layout this parser expects; nothing in it can be trusted. */
export class ParseError extends Error {
  override name = 'ParseError'
}

/** A row as the page shows it, before `validateRooms` checks it. */
export interface ParsedRoom extends Omit<Room, 'status'> {
  status: RoomStatus | null
  /** The status as written, for logging the ones `normalizeStatus` doesn't know. */
  statusText: string
}

// Both languages, normalized by `normalizeText` and lowercased.
const STATUSES: Record<string, RoomStatus> = {
  空室: 'available',
  空室予定: 'upcoming',
  入居中: 'occupied',
  available: 'available',
  vacancy: 'available',
  'available soon': 'upcoming',
  'n/a': 'occupied'
}

// The columns read, and a word their headers contain once whitespace is removed
// (listings order `管理費` and `共益費` differently).
const COLUMNS = { status: 0, roomNumber: 1, area: 4, rent: 7, fees: 8 } as const
const HEADERS: [column: number, word: string][] = [
  [COLUMNS.status, '空室情報'],
  [COLUMNS.roomNumber, '部屋番号'],
  [COLUMNS.area, '広さ'],
  [COLUMNS.rent, '賃料'],
  [COLUMNS.fees, '共益費']
]

/** A cell as plain lines, split where the page breaks them and with full-width characters folded (`１９㎡` → `19m2`). */
function cellLines(cell: HTMLElement): string[] {
  return cell.structuredText
    .normalize('NFKC')
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
}

/** The element's children with the given tag; nested tables keep their own rows and cells. */
function childrenNamed(element: HTMLElement, tagName: string): HTMLElement[] {
  return element.children.filter((child) => child.tagName === tagName)
}

/** Maps a Japanese or English status label to the shared enum, or null for one it doesn't know. */
export function normalizeStatus(label: string): RoomStatus | null {
  return STATUSES[label.normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase()] ?? null
}

/** `2026/11/27`, `2026-11-27`, `2026年11月27日` or `20261127` as `2026-11-27`; null for anything else or an impossible date. */
export function parseDate(text: string): string | null {
  const match =
    /^(\d{4})[/.\-年](\d{1,2})[/.\-月](\d{1,2})日?$/.exec(text) ??
    /^(\d{4})(\d{2})(\d{2})$/.exec(text)
  if (!match) return null

  const [year, month, day] = match.slice(1).map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null
  }
  return date.toISOString().slice(0, 10)
}

/** `¥56,000`, `[30,000]` or `30,000円` in yen; null for text such as `[実費]` (at cost). */
function parseYen(text: string | undefined): number | null {
  const match = text?.replace(/^\[(.*)\]$/, '$1').match(/^¥?\s*(\d[\d,]*)\s*円?$/)
  return match ? Number(match[1].replaceAll(',', '')) : null
}

function parseArea(text: string, unit: RegExp): number | null {
  const match = new RegExp(String.raw`(\d+(?:\.\d+)?)\s*(?:${unit.source})`).exec(text)
  return match ? Number(match[1]) : null
}

/** Every room in the listing's "all rooms" (全て) table, in page order. */
export function parseListing(html: string, propertyId: string): ParsedRoom[] {
  // The page repeats the vacant rooms in a second panel; only the first has them all.
  // A page cut off mid-table finds none: the parser drops a table left unclosed.
  const table = parse(html).querySelector('#room_vacancy1 table')
  if (!table) throw new ParseError('Room table not found')
  // Parsing adds no <tbody>, but a page that writes one keeps its rows there.
  const rows = [table, ...childrenNamed(table, 'TBODY')].flatMap((parent) =>
    childrenNamed(parent, 'TR')
  )

  const headers = rows
    .flatMap((row) => childrenNamed(row, 'TH'))
    .map((cell) => cellLines(cell).join('').replace(/\s/g, ''))
  for (const [column, word] of HEADERS) {
    if (!headers[column]?.includes(word)) {
      throw new ParseError(`Column ${column} is "${headers[column]}", expected one with "${word}"`)
    }
  }

  const rooms: ParsedRoom[] = []
  for (const row of rows) {
    if (childrenNamed(row, 'TH').length > 0) continue

    const cells = childrenNamed(row, 'TD')
    if (cells.length <= COLUMNS.fees) {
      throw new ParseError(`Row has ${cells.length} cells, expected at least ${COLUMNS.fees + 1}`)
    }

    // The status cell holds the label and, for upcoming rooms, the date under it.
    const [statusText = '', dateText] = cellLines(cells[COLUMNS.status])
    const area = cellLines(cells[COLUMNS.area]).join(' ')
    const [rent, deposit] = cellLines(cells[COLUMNS.rent])
    const [commonFee] = cellLines(cells[COLUMNS.fees])

    rooms.push({
      propertyId,
      roomNumber: cellLines(cells[COLUMNS.roomNumber]).join(' '),
      status: normalizeStatus(statusText),
      statusText,
      availableFrom: dateText ? parseDate(dateText) : null,
      areaM2: parseArea(area, /m2|平米/),
      areaTatami: parseArea(area, /畳|帖/),
      rent: parseYen(rent),
      deposit: parseYen(deposit),
      commonFee: parseYen(commonFee)
    })
  }
  return rooms
}

const ROOM_NUMBER = /^[\dA-Za-z-]{1,10}$/
const MAX_YEN = 1_000_000

function inRange(value: number | null, min: number, max: number) {
  return value === null || (Number.isFinite(value) && value >= min && value <= max)
}

/**
 * Checks a listing's rooms before they reach the database. Any problem rejects
 * the whole listing, so a layout change can't write half-read rooms.
 */
export function validateRooms(parsed: ParsedRoom[]): { rooms: Room[]; problems: string[] } {
  const problems: string[] = []
  const rooms: Room[] = []
  const seen = new Set<string>()

  if (parsed.length === 0) problems.push('No rooms found')

  for (const { statusText, status, ...room } of parsed) {
    const label = `Room "${room.roomNumber}"`
    if (!ROOM_NUMBER.test(room.roomNumber)) problems.push(`${label}: invalid room number`)
    if (seen.has(room.roomNumber)) problems.push(`${label}: listed twice`)
    seen.add(room.roomNumber)
    if (!inRange(room.rent, 1000, MAX_YEN))
      problems.push(`${label}: rent ${room.rent} out of range`)
    if (!inRange(room.deposit, 0, MAX_YEN))
      problems.push(`${label}: deposit ${room.deposit} out of range`)
    if (!inRange(room.commonFee, 0, MAX_YEN))
      problems.push(`${label}: common fee ${room.commonFee} out of range`)
    if (!inRange(room.areaM2, 1, 200))
      problems.push(`${label}: area ${room.areaM2} m² out of range`)
    if (!inRange(room.areaTatami, 1, 100))
      problems.push(`${label}: area ${room.areaTatami} 畳 out of range`)

    if (status === null) problems.push(`${label}: unknown status "${statusText}"`)
    else rooms.push({ ...room, status })
  }
  return { rooms, problems }
}
