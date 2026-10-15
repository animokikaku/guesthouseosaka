import type {
  Fixtures,
  PlaywrightTestArgs,
  PlaywrightTestOptions,
  PlaywrightWorkerArgs,
  PlaywrightWorkerOptions
} from '@playwright/test'
import MCR, { type CoverageReportOptions } from 'monocart-coverage-reports'
import path from 'node:path'

/**
 * Browser coverage from the component suite, merged by Codecov with the unit
 * report into one codebase figure: client widgets (dialogs, carousels,
 * drawers) are tested here rather than in jsdom. Opt in with `COVERAGE=1`; CI
 * does. The E2E suite stays uninstrumented: mapping production bundles back to
 * source doubled its run for little the component stories don't already cover.
 */
const enabled = process.env.COVERAGE === '1'

/** Same scope as the unit coverage in vitest.config.mts. */
function inScope(file: string) {
  return (
    /^(app|components|hooks|i18n|lib)\/.+\.tsx?$/.test(file) &&
    !/(^components\/ui\/|__tests__|\.story\.tsx$|^i18n\/navigation\.ts$)/.test(file)
  )
}

const options: CoverageReportOptions = {
  name: 'Component coverage',
  outputDir: 'coverage-playwright',
  reports: ['lcovonly', 'console-summary'],
  // Vite serves one module per URL, so the URL path is the source file.
  entryFilter: ({ url }) => inScope(new URL(url).pathname.slice(1)),
  // Each module's inline map names only the file; the URL already scoped it.
  sourceFilter: () => true,
  // Reported as `<host>-<port>/<folder>/<file>`, with the folder taken from the module URL.
  sourcePath: (sourcePath, { distFile }) =>
    (sourcePath.includes('/') || !distFile
      ? sourcePath
      : path.posix.join(path.posix.dirname(distFile), sourcePath)
    ).replace(/^[\w.]+-\d+\//, '')
}

/** Records every page's JS coverage for the report; add with `test.extend`. */
export const coverageFixtures: Fixtures<
  { browserCoverage: void },
  object,
  PlaywrightTestArgs & PlaywrightTestOptions,
  PlaywrightWorkerArgs & PlaywrightWorkerOptions
> = {
  browserCoverage: [
    async ({ page }, use) => {
      if (!enabled) return use()

      await page.coverage.startJSCoverage({ resetOnNavigation: false })
      await use()
      await MCR(options).add(await page.coverage.stopJSCoverage())
    },
    { auto: true }
  ]
}

/** Global setup: starts each run from an empty cache and writes the report at the end. */
export default async function globalSetup() {
  if (!enabled) return
  MCR(options).cleanCache()
  return async () => {
    await MCR(options).generate()
  }
}
