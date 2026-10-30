# Sanity Workflow

One Sanity project (`SANITY_PROJECT_ID` in `lib/config.ts`) with two datasets: `production`,
which guesthouseosaka.com reads, and `development`, which local builds and Worker Previews read.
Each dataset has its own hosted Studio (`SANITY_STUDIO_HOSTS` in `lib/config.ts`), built from the
`studio/` workspace, which has its own dependencies and shares the site's config, locales, icons and
types through `@/`:

| Studio                              | Edits         | Deployed                                          |
| ----------------------------------- | ------------- | ------------------------------------------------- |
| `guesthouseosaka.sanity.studio`     | `production`  | By GitHub Actions when its files change on `main` |
| `guesthouseosaka-dev.sanity.studio` | `development` | By hand, with `bun run studio:deploy`             |

The site's `/studio` redirects to the Studio for the dataset it shows, and `robots.txt` keeps
crawlers out of it.

## Changing the schema

1. Edit the types in `studio/schemaTypes/`
2. Run `bun run typegen` to regenerate `sanity.types.ts`
3. Try it locally: `bun dev` and `bun run studio:dev` open a Studio at `localhost:3333` that edits
   `development` and previews `localhost:3000`
4. To show it in the hosted development Studio, run `bun run studio:deploy` from the branch.
   There is one development Studio, so the last deploy wins: a field another branch adds shows
   as unknown until someone deploys that branch, or a `main` that includes it
5. Merge to `main`: `.github/workflows/studio.yml` deploys the production Studio. It runs only
   from `main`; run it again with `gh workflow run studio.yml`

`sanity deploy` also deploys the schema to the dataset, so a separate `sanity schema deploy` isn't
needed. The workflow authenticates with the `SANITY_DEPLOY_TOKEN` secret, a Sanity token with the
Deploy Studio role.

## Upgrading Sanity

Both Studios have auto-updates on (`deployment.autoUpdates` in `studio/sanity.cli.ts`): they load the
`sanity` package from Sanity's CDN, so upgrading it needs no deploy. Each Studio's channel is set
in sanity.io/manage → Studios: `stable` for production, `latest` for development. A deployed
Studio never runs a version older than the one it was built with. Plugins are bundled, so their
updates go out with the next deploy.

## Publishing

Pages are cached by Workers Cache for a day. A GROQ-powered webhook on the `production` dataset
purges the ones that read the published document's type, so changes show within seconds and the
rest of the site stays cached. It is set up in sanity.io/manage → API → Webhooks:

| Field           | Value                                                    |
| --------------- | -------------------------------------------------------- |
| URL             | `https://guesthouseosaka.com/api/revalidate`             |
| Dataset         | `production`                                             |
| Trigger on      | Create, Update, Delete                                   |
| Filter          | Empty (any document)                                     |
| Projection      | `{_id, _type}` (the purge reads `_type`)                 |
| HTTP method     | `POST`                                                   |
| Drafts/Versions | Off                                                      |
| Secret          | The Worker's `SANITY_WEBHOOK_SECRET` (`void secret put`) |

The endpoint checks the signature against `SANITY_WEBHOOK_SECRET`, answers `401` without it,
and `503` (which Sanity retries) when the purge fails. It purges the `sanity-<type>` tag, which
every response reading that type carries (see `sanity/lib/content-types.ts`); Sanity's own
documents, like image assets, purge nothing; any other type, or a body without one, purges every
published response. The webhook's attempts log in
sanity.io/manage shows each delivery. If a delivery fails for good, the change shows once the
cache expires, within a day, or after the next deploy; publishing again retries the purge.

`development` needs no webhook: nothing caches it. Local builds have no Workers Cache, and
Worker Preview URLs don't go through it (no `Cf-Cache-Status`, and `Cache-Tag` reaches the
browser), so previews always show the latest `development` content. Production starts from an
empty cache on every deploy, since the cache key includes the Worker version.

## GROQ queries

- Use `defineQuery()` in `sanity/lib/queries.ts` for type safety, then run `bun run typegen`
- Localized content pattern:
  ```groq
  coalesce(field[language == $locale][0].value, field[language == "en"][0].value)
  ```

## Content

Use the Sanity MCP tools rather than ad-hoc scripts: `query_documents` to read,
`create_documents`, `patch_documents` and `publish_documents` to write, and `get_schema` to
inspect the deployed schema. Load `list_sanity_rules` / `get_sanity_rules` before writing schema
or GROQ. Set up the MCP server with `bunx sanity@latest mcp configure`.

## Rules

- **Always**: Run `typegen` after schema or query changes
- **Always**: When a query starts reading another document type (directly or through `->`), add
  it to the loader's list in `sanity/lib/content-types.ts`, or publishes of that type won't
  refresh the page
- **Ask first**: Before modifying `studio/sanity.config.ts` or deleting schema files
- **Never**: Hardcode API tokens (read them from `env` in `@/env`)
