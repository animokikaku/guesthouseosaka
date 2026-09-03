// @vitest-environment node

import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

const { ignoreCommand } = JSON.parse(readFileSync('vercel.json', 'utf8')) as {
  ignoreCommand: string
}
const ignoreScript = readFileSync('scripts/vercel-ignore-build.sh', 'utf8')

type VercelGitEnvironment = {
  VERCEL_GIT_COMMIT_SHA?: string
  VERCEL_GIT_PREVIOUS_SHA?: string
}

function git(cwd: string, ...args: string[]) {
  execFileSync('git', args, { cwd, stdio: 'ignore' })
}

function currentCommit(cwd: string) {
  return execFileSync('git', ['rev-parse', 'HEAD'], { cwd, encoding: 'utf8' }).trim()
}

function commitFiles(cwd: string, paths: string[], content: string) {
  for (const path of paths) {
    const absolutePath = join(cwd, path)
    mkdirSync(dirname(absolutePath), { recursive: true })
    writeFileSync(absolutePath, content)
    git(cwd, 'add', path)
  }
  git(cwd, 'commit', '-m', `test: update ${paths.join(', ')}`)
}

function commitFile(cwd: string, path: string, content: string) {
  commitFiles(cwd, [path], content)
}

function isBuildIgnored(cwd: string, env: VercelGitEnvironment = {}) {
  const environment = { ...process.env }
  delete environment.VERCEL_GIT_COMMIT_SHA
  delete environment.VERCEL_GIT_PREVIOUS_SHA
  Object.assign(environment, env)

  try {
    execFileSync('sh', ['-c', ignoreCommand], {
      cwd,
      env: environment,
      stdio: 'ignore'
    })
    return true
  } catch {
    return false
  }
}

// The repository is built once and shared: git subprocesses dominate this file's
// runtime, and every case stays isolated anyway. Cases without an explicit SHA
// rely on the script's HEAD^..HEAD default, so each one only sees its own commit;
// cases with an explicit SHA capture HEAD before committing. Each commit must
// therefore touch a path no earlier commit left with identical content.
describe('Vercel ignored build command', () => {
  let repository: string

  beforeAll(() => {
    repository = mkdtempSync(join(tmpdir(), 'guesthouseosaka-vercel-'))
    git(repository, 'init')
    git(repository, 'config', 'user.email', 'tests@example.com')
    git(repository, 'config', 'user.name', 'Tests')
    commitFile(repository, 'scripts/vercel-ignore-build.sh', ignoreScript)
    commitFile(repository, 'README.md', 'initial')
  })

  afterAll(() => {
    rmSync(repository, { recursive: true, force: true })
  })

  it("fits within Vercel's ignore command length limit", () => {
    expect(ignoreCommand.length).toBeLessThanOrEqual(256)
  })

  it.each(['hooks/use-example.ts', 'i18n/routing.ts', 'proxy.ts', 'vercel.json'])(
    'builds when %s changes',
    (path) => {
      commitFile(repository, path, 'runtime change')
      expect(isBuildIgnored(repository)).toBe(false)
    }
  )

  it.each(['docs/diagram.svg', 'e2e/example.spec.ts', '.github/workflows/ci.yml'])(
    'stays ignored when only %s changes',
    (path) => {
      commitFile(repository, path, 'non-runtime change')
      expect(isBuildIgnored(repository)).toBe(true)
    }
  )

  // One commit and one assertion covering every remaining exclusion: dropping any
  // single pathspec from the script leaves its file in the diff and fails this
  // test. Committing each path separately would cost a git subprocess per case to
  // prove the same thing. Each path must stay matched by exactly one exclusion,
  // otherwise a second one masks its deletion. Root-level entries are here because
  // git's wildmatch makes a leading **/ require a directory, so patterns written
  // that way skip the repository root while still looking correct nested.
  it('stays ignored when only tooling and configuration files change', () => {
    commitFiles(
      repository,
      [
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
        'playwright.config.ts',
        'renovate.json',
        'vitest.config.mts',
        'vitest.setup.ts'
      ],
      'non-runtime change'
    )

    expect(isBuildIgnored(repository)).toBe(true)
  })

  it('builds when an earlier commit since the last deployment changes runtime code', () => {
    const previousSha = currentCommit(repository)
    commitFile(repository, 'app/page.tsx', 'runtime change')
    commitFile(repository, 'README.md', 'later documentation change')

    expect(
      isBuildIgnored(repository, {
        VERCEL_GIT_COMMIT_SHA: currentCommit(repository),
        VERCEL_GIT_PREVIOUS_SHA: previousSha
      })
    ).toBe(false)
  })

  it('ignores multiple non-runtime commits since the last deployment', () => {
    const previousSha = currentCommit(repository)
    commitFile(repository, 'CHANGELOG.md', 'documentation change')
    commitFile(repository, 'e2e/second.spec.ts', 'test change')

    expect(
      isBuildIgnored(repository, {
        VERCEL_GIT_COMMIT_SHA: currentCommit(repository),
        VERCEL_GIT_PREVIOUS_SHA: previousSha
      })
    ).toBe(true)
  })

  it('builds an initial Vercel deployment without a previous SHA', () => {
    expect(isBuildIgnored(repository, { VERCEL_GIT_COMMIT_SHA: currentCommit(repository) })).toBe(
      false
    )
  })

  it('builds when the previous deployment commit is unavailable', () => {
    expect(
      isBuildIgnored(repository, {
        VERCEL_GIT_COMMIT_SHA: currentCommit(repository),
        VERCEL_GIT_PREVIOUS_SHA: '5e3b51f6f25193fc0fd395486b477168874dd20d'
      })
    ).toBe(false)
  })
})
