import type {
  Fixtures,
  FullConfig,
  PlaywrightTestArgs,
  PlaywrightTestOptions,
  PlaywrightWorkerArgs,
  PlaywrightWorkerOptions
} from '@playwright/test'
import MCR, { type CoverageReportOptions } from 'monocart-coverage-reports'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

/**
 * Browser coverage for the Playwright suites, so Codecov sees the code only they
 * exercise (dialogs, carousels, client navigation) next to the unit report.
 * Opt in with `COVERAGE=1`; CI does. Server components are prerendered by build
 * workers that exit without flushing V8 coverage, so this is client code only.
 */
const enabled = process.env.COVERAGE === '1'

/** `e2e` or `components`, from the suite's test directory. */
function suiteOf(testDir: string) {
  return path.basename(testDir)
}

/** Same scope as the unit coverage in vitest.config.mts. */
function inScope(file: string) {
  return (
    /^(app|components|hooks|i18n|lib)\/.+\.tsx?$/.test(file) &&
    !/(^components\/ui\/|__tests__|\.story\.tsx$|^i18n\/navigation\.ts$)/.test(file)
  )
}

/**
 * Next serves bundles whose source maps name each module
 * `[project]/<path>` (`turbopack:///` may lead); Vite serves one module per URL, with an
 * inline map naming only the file (reported as `<host>-<port>/<path>`).
 */
function repoPath(sourcePath: string) {
  return sourcePath.replace(/^(turbopack:\/\/\/)?\[project\]\//, '').replace(/^[\w.]+-\d+\//, '')
}

function report(testDir: string) {
  const suite = suiteOf(testDir)
  const options: CoverageReportOptions = {
    name: `Playwright ${suite} coverage`,
    outputDir: `coverage-playwright/${suite}`,
    reports: ['lcovonly', 'console-summary'],
    // Next bundles are scoped per source below (a bundle without a map can't be);
    // a Vite module by its own URL.
    entryFilter: ({ url, source }) => {
      const { pathname } = new URL(url)
      return pathname.startsWith('/_next/static/')
        ? Boolean(source?.includes('//# sourceMappingURL='))
        : inScope(pathname.slice(1))
    },
    // In the component suite a bare file name is a Vite module, already scoped by its URL.
    sourceFilter: (sourcePath) =>
      (suite === 'components' && !sourcePath.includes('/')) || inScope(repoPath(sourcePath)),
    // Next serves its maps next to each chunk; read them from the build output.
    sourceMapResolver: async (url, defaultResolver) => {
      const { pathname } = new URL(url)
      return pathname.startsWith('/_next/static/')
        ? JSON.parse(await readFile(`.next${pathname.slice('/_next'.length)}`, 'utf8'))
        : defaultResolver(url)
    },
    // A Vite map names only the file, so its folder comes from the module's URL.
    sourcePath: (sourcePath, { distFile }) =>
      repoPath(
        sourcePath.includes('/') || !distFile
          ? sourcePath
          : path.posix.join(path.posix.dirname(distFile), sourcePath)
      )
  }
  return MCR(options)
}

/** Records every page's JS coverage for the suite's report; add with `test.extend`. */
export const coverageFixtures: Fixtures<
  { browserCoverage: void },
  object,
  PlaywrightTestArgs & PlaywrightTestOptions,
  PlaywrightWorkerArgs & PlaywrightWorkerOptions
> = {
  browserCoverage: [
    async ({ page }, use, testInfo) => {
      if (!enabled) return use()

      await page.coverage.startJSCoverage({ resetOnNavigation: false })
      await use()
      const coverage = await page.coverage.stopJSCoverage()
      // Request-only tests never load a script.
      if (coverage.length > 0) await report(testInfo.project.testDir).add(coverage)
    },
    { auto: true }
  ]
}

/**
 * Drops records for bundles whose map lists no sources (Next's lazy-load
 * stubs): the report falls back to the bundle itself, past `sourceFilter`.
 */
async function keepInScope(lcovPath: string) {
  const records = (await readFile(lcovPath, 'utf8')).split('end_of_record\n')
  const kept = records.filter((record) => inScope(record.match(/^SF:(.+)$/m)?.[1] ?? ''))
  await writeFile(lcovPath, kept.map((record) => `${record}end_of_record\n`).join(''))
}

/** Global setup: starts each run from an empty cache and writes the report at the end. */
export default async function globalSetup(config: FullConfig) {
  if (!enabled) return
  const testDir = config.projects[0].testDir
  report(testDir).cleanCache()
  return async () => {
    await report(testDir).generate()
    await keepInScope(`coverage-playwright/${suiteOf(testDir)}/lcov.info`)
  }
}
