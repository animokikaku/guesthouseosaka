# Testing

Each behavior is tested once, at the cheapest layer that can observe it the way
a visitor, an editor or a crawler would.

| Layer                                 | Runs                         | Use it for                                                                                             |
| ------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------ |
| Unit (`bun run test --run`)           | Vitest, Node or jsdom        | Logic with inputs and outputs: schemas, transforms, routing rules, email content, catalog parity       |
| Component (`bun run test:components`) | Real Chromium, story gallery | Widgets whose behavior lives in the browser: carousels, dialogs, drawers, focus, responsive visibility |
| E2E (`bun run test:e2e`)              | Production build             | Journeys, redirects, status codes, metadata, anything that needs the real server or Sanity data        |

## Rules

- Assert what users see: roles, accessible names, copy, URLs, status codes. Not class names, prop
  forwarding or how often a callback ran.
- Find elements by role, adding a name only where several share a role. Write names as word-bounded,
  case-insensitive regexes (`/\bagree\b/i`): they survive rewording around the word but not
  lookalikes, so "Disagree" or a CMS caption about "the closet" won't match `/\bclose\b/i`. Match
  names on the element that carries them (a column header, not the table's concatenated text). Keep
  exact text where formatting is the behavior (plurals, prices, counters); use a test id only when
  nothing visible identifies the element.
- Mock only at the edges: the server function, Resend, Turnstile (its widget and Siteverify), the
  router, `Image`. Render our own components, `urlFor`, `stegaClean` and translations for real.
- Prefer a table (`it.each`) over near-identical tests, and one test per behavior over one per prop.
- A test that only restates the implementation (a hard-coded copy of a computed value, a mock that
  reimplements the code under test) is a change detector; test the rule it encodes instead.

## Coverage

Codecov reports one figure for the codebase, merged from two uploads: Vitest's, and the browser
coverage the component suite records with `COVERAGE=1` (`playwright/coverage.ts`). Moving a widget
test from jsdom to a story keeps its coverage. The E2E suite is not instrumented, so code only it
exercises (route files, server components) shows as uncovered; keep that logic thin or test it in a
unit test.

## Unit test environment

- Translations resolve against `messages/en.json` (`vitest.setup.ts`), so components render real
  English copy and a broken key or ICU message fails. Schema tests pass a translator that returns the
  key, so they assert which message a rule produces rather than its wording.
- `urlFor` is the real builder; check URL parameters (`w`, `h`, `fit`) rather than whole strings.
  Fixture asset refs must look like real ones (`image-<id>-<width>x<height>-<format>`).
- Environment variables are fixed in `vitest.config.mts`, and the suite runs in a time zone behind
  UTC, where date-only strings parsed as UTC show up on the wrong day.
- Faker is seeded, so fixtures are the same on every run.
- Tests that never touch the DOM opt into `// @vitest-environment node`.
