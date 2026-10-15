import { test as base } from '@playwright/test'
import { coverageFixtures } from '../coverage'

export { expect } from '@playwright/test'

/** Every component spec's `test`, recording browser coverage when enabled. */
export const test = base.extend(coverageFixtures)
