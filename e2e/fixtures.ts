import { test as base } from '@playwright/test'
import { test as nextTest } from 'next/experimental/testmode/playwright'
import { coverageFixtures } from '../playwright/coverage'

export { devices, expect, type Page } from '@playwright/test'

/** Every E2E spec's `test`, recording browser coverage when enabled. */
export const test = base.extend(coverageFixtures)

/** `test` with Next's test proxy, for specs that mock the server's outgoing fetches. */
export const testWithNextProxy = nextTest.extend(coverageFixtures)
