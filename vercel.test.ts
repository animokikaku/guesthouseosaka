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

function commitFile(cwd: string, path: string, content: string) {
  const absolutePath = join(cwd, path)
  mkdirSync(dirname(absolutePath), { recursive: true })
  writeFileSync(absolutePath, content)
  git(cwd, 'add', path)
  git(cwd, 'commit', '-m', `test: update ${path}`)
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

describe('Vercel ignored build command', () => {
  let repository: string

  beforeEach(() => {
    repository = mkdtempSync(join(tmpdir(), 'guesthouseosaka-vercel-'))
    git(repository, 'init')
    git(repository, 'config', 'user.email', 'tests@example.com')
    git(repository, 'config', 'user.name', 'Tests')
    commitFile(repository, 'scripts/vercel-ignore-build.sh', ignoreScript)
    commitFile(repository, 'README.md', 'initial')
  })

  afterEach(() => {
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

  it.each(['docs/guide.md', 'e2e/example.spec.ts', '.github/workflows/ci.yml'])(
    'stays ignored when only %s changes',
    (path) => {
      commitFile(repository, path, 'non-runtime change')
      expect(isBuildIgnored(repository)).toBe(true)
    }
  )

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
    commitFile(repository, 'README.md', 'documentation change')
    commitFile(repository, 'e2e/example.spec.ts', 'test change')

    expect(
      isBuildIgnored(repository, {
        VERCEL_GIT_COMMIT_SHA: currentCommit(repository),
        VERCEL_GIT_PREVIOUS_SHA: previousSha
      })
    ).toBe(true)
  })

  it('builds an initial Vercel deployment without a previous SHA', () => {
    commitFile(repository, 'README.md', 'documentation change')

    expect(
      isBuildIgnored(repository, {
        VERCEL_GIT_COMMIT_SHA: currentCommit(repository)
      })
    ).toBe(false)
  })
})
