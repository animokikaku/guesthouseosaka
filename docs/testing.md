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
- Mock only at the edges: the server action, Resend, the router, `next/image`. Render our own
  components, `urlFor`, `stegaClean` and translations for real.
- Prefer a table (`it.each`) over near-identical tests, and one test per behavior over one per prop.
- A test that only restates the implementation (a hard-coded copy of a computed value, a mock that
  reimplements the code under test) is a change detector; test the rule it encodes instead.

## Unit test environment

- Translations resolve against `messages/en.json` (`vitest.setup.ts`), so tests assert real English
  copy and a broken key or ICU message fails.
- `urlFor` is the real builder; check URL parameters (`w`, `h`, `fit`) rather than whole strings.
  Fixture asset refs must look like real ones (`image-<id>-<width>x<height>-<format>`).
- Environment variables are fixed in `vitest.config.mts`, and the suite runs in a time zone behind
  UTC, where date-only strings parsed as UTC show up on the wrong day.
- Faker is seeded, so fixtures are the same on every run.
- Tests that never touch the DOM opt into `// @vitest-environment node`.
