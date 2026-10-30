// @vitest-environment node

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { PROPERTY_IDS } from '../rooms.server'

vi.mock('void/db', () => ({}))

describe('PROPERTY_IDS', () => {
  it('names only listings the rooms Worker syncs', () => {
    const config = readFileSync(join(__dirname, '../../workers/rooms/wrangler.jsonc'), 'utf8')
    for (const id of Object.values(PROPERTY_IDS)) {
      expect(config).toContain(`"https://shares.house/a_detail/q_${id}/"`)
    }
  })
})
