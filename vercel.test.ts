// @vitest-environment node

import { execFile } from 'node:child_process'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { promisify } from 'node:util'

const run = promisify(execFile)

const [{ ignoreCommand }, ignoreScript] = await Promise.all([
  readFile('vercel.json', 'utf8').then((json) => JSON.parse(json) as { ignoreCommand: string }),
  readFile('scripts/vercel-ignore-build.sh', 'utf8')
])

// Ignore the developer's global and system git config so the fixture repositories
// behave the same everywhere. It also keeps commit signing out of the way, which
// otherwise fails without a key and costs more than the rest of this file combined.
const GIT_ENVIRONMENT = {
  ...process.env,
  GIT_CONFIG_GLOBAL: '/dev/null',
  GIT_CONFIG_SYSTEM: '/dev/null',
  GIT_AUTHOR_NAME: 'Tests',
  GIT_AUTHOR_EMAIL: 'tests@example.com',
  GIT_COMMITTER_NAME: 'Tests',
  GIT_COMMITTER_EMAIL: 'tests@example.com',
  VERCEL_GIT_COMMIT_SHA: undefined,
  VERCEL_GIT_PREVIOUS_SHA: undefined
}

type VercelGitEnvironment = {
  VERCEL_GIT_COMMIT_SHA?: string
  VERCEL_GIT_PREVIOUS_SHA?: string
}

let repositoryRoot: string

beforeAll(async () => {
  repositoryRoot = await mkdtemp(join(tmpdir(), 'guesthouseosaka-vercel-'))
})

afterAll(() => rm(repositoryRoot, { recursive: true, force: true }))

async function git(cwd: string, ...args: string[]) {
  await run('git', args, { cwd, env: GIT_ENVIRONMENT })
}

async function commitFiles(cwd: string, files: Record<string, string>) {
  await Promise.all(
    Object.entries(files).map(async ([path, content]) => {
      const absolutePath = join(cwd, path)
      await mkdir(dirname(absolutePath), { recursive: true })
      await writeFile(absolutePath, content)
    })
  )

  await git(cwd, 'add', '--all')
  await git(cwd, 'commit', '--quiet', '-m', `test: update ${Object.keys(files).join(', ')}`)
}

/**
 * A throwaway repository holding the ignore script and one unrelated commit.
 *
 * Every case builds its own so the cases can run concurrently. Sharing one
 * repository would make each commit visible to the cases after it, forcing them
 * into a fixed order and requiring every commit to touch a path no earlier one
 * had already left with identical content.
 */
async function createRepository() {
  const cwd = await mkdtemp(join(repositoryRoot, 'case-'))

  await git(cwd, 'init', '--quiet')
  await commitFiles(cwd, { 'scripts/vercel-ignore-build.sh': ignoreScript })
  await commitFiles(cwd, { 'README.md': 'initial' })

  return cwd
}

async function headCommit(cwd: string) {
  const { stdout } = await run('git', ['rev-parse', 'HEAD'], { cwd, env: GIT_ENVIRONMENT })
  return stdout.trim()
}

async function isBuildIgnored(cwd: string, vercelEnvironment: VercelGitEnvironment = {}) {
  try {
    await run('sh', ['-c', ignoreCommand], {
      cwd,
      env: { ...GIT_ENVIRONMENT, ...vercelEnvironment }
    })
    return true
  } catch {
    return false
  }
}

describe.concurrent('Vercel ignored build command', () => {
  it("fits within Vercel's ignore command length limit", () => {
    expect(ignoreCommand.length).toBeLessThanOrEqual(256)
  })

  // No explicit SHAs, so these also cover the script's HEAD^..HEAD default.
  it.each(['hooks/use-example.ts', 'i18n/routing.ts', 'proxy.ts', 'vercel.json'])(
    'builds when %s changes',
    async (path) => {
      const repository = await createRepository()
      await commitFiles(repository, { [path]: 'runtime change' })

      expect(await isBuildIgnored(repository)).toBe(false)
    }
  )

  it.each(['docs/diagram.svg', 'e2e/example.spec.ts', '.github/workflows/ci.yml'])(
    'stays ignored when only %s changes',
    async (path) => {
      const repository = await createRepository()
      await commitFiles(repository, { [path]: 'non-runtime change' })

      expect(await isBuildIgnored(repository)).toBe(true)
    }
  )

  // One commit and one assertion covering every remaining exclusion: dropping any
  // single pathspec from the script leaves its file in the diff and fails this
  // test. Each path must stay matched by exactly one exclusion, otherwise a second
  // one masks its deletion. Root-level entries are here because git's wildmatch
  // makes a leading **/ require a directory, so patterns written that way skip the
  // repository root while still looking correct nested.
  it('stays ignored when only tooling and configuration files change', async () => {
    const repository = await createRepository()
    const paths = [
      '.claude/settings.json',
      '.coderabbit.yaml',
      '.codex/config.toml',
      '.cursor/rules.json',
      '.vscode/settings.json',
      '__tests__/root-helpers.ts',
      'components/example.spec.ts',
      'crowdin.yml',
      'e2e/fixtures/rooms.json',
      'knip.json',
      'lib/__tests__/helpers.ts',
      'lib/example.test.ts',
      'root-level.spec.ts',
      'root-level.test.ts',
      'playwright/gallery/harness.mts',
      'playwright.components.config.ts',
      'playwright.config.ts',
      'renovate.json',
      'vitest.config.mts',
      'vitest.setup.ts'
    ]

    await commitFiles(repository, Object.fromEntries(paths.map((path) => [path, 'non-runtime'])))

    expect(await isBuildIgnored(repository)).toBe(true)
  })

  it('builds when an earlier commit since the last deployment changes runtime code', async () => {
    const repository = await createRepository()
    const previousSha = await headCommit(repository)
    await commitFiles(repository, { 'app/page.tsx': 'runtime change' })
    await commitFiles(repository, { 'README.md': 'later documentation change' })

    expect(
      await isBuildIgnored(repository, {
        VERCEL_GIT_COMMIT_SHA: await headCommit(repository),
        VERCEL_GIT_PREVIOUS_SHA: previousSha
      })
    ).toBe(false)
  })

  it('ignores multiple non-runtime commits since the last deployment', async () => {
    const repository = await createRepository()
    const previousSha = await headCommit(repository)
    await commitFiles(repository, { 'CHANGELOG.md': 'documentation change' })
    await commitFiles(repository, { 'e2e/second.spec.ts': 'test change' })

    expect(
      await isBuildIgnored(repository, {
        VERCEL_GIT_COMMIT_SHA: await headCommit(repository),
        VERCEL_GIT_PREVIOUS_SHA: previousSha
      })
    ).toBe(true)
  })

  it('builds an initial Vercel deployment without a previous SHA', async () => {
    const repository = await createRepository()

    expect(
      await isBuildIgnored(repository, { VERCEL_GIT_COMMIT_SHA: await headCommit(repository) })
    ).toBe(false)
  })

  it('builds when the previous deployment commit is unavailable', async () => {
    const repository = await createRepository()

    expect(
      await isBuildIgnored(repository, {
        VERCEL_GIT_COMMIT_SHA: await headCommit(repository),
        VERCEL_GIT_PREVIOUS_SHA: '5e3b51f6f25193fc0fd395486b477168874dd20d'
      })
    ).toBe(false)
  })
})
