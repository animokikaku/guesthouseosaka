# Sanity Workflow

## Schema Changes

1. Edit schemas in `sanity/schemaTypes/`
2. Run `bun run typegen` to regenerate TypeScript types
3. Use MCP tools for content operations

## CLI Commands

```bash
# Schema & Types
bunx sanity schema deploy     # Deploy schema to Content Lake
bunx sanity schema extract    # Extract schema for TypeGen
bunx sanity typegen generate  # Generate TypeScript types

# Development
bunx sanity dev               # Start Studio dev server
bunx sanity build             # Build Studio for production
bun run studio:deploy         # Deploy the development Studio
bun run studio:deploy:production  # Deploy the production Studio

# MCP Setup
bunx sanity@latest mcp configure  # Configure MCP for AI editor

# Help
bunx sanity docs search "query"   # Search documentation
```

## MCP Tools (Preferred)

Use MCP tools instead of ad-hoc scripts:

| Tool                                     | Use For             |
| ---------------------------------------- | ------------------- |
| `query_documents`                        | Run GROQ queries    |
| `create_document_from_markdown`          | Create content      |
| `patch_document`                         | Modify documents    |
| `deploy_schema`                          | Deploy schema       |
| `get_schema`                             | Inspect schema      |
| `list_sanity_rules` / `get_sanity_rules` | Load best practices |

## GROQ Queries

- Use `defineQuery()` in `sanity/lib/queries.ts` for type safety
- Localized content pattern:
  ```groq
  coalesce(field[language == $locale][0].value, field[language == "en"][0].value)
  ```

## Rules

- **Always**: Run `typegen` after schema/query changes
- **Ask first**: Before modifying `sanity.config.ts` or deleting schema files
- **Never**: Hardcode API tokens (use `process.env`)

## Hosted Studios

Each dataset has its own Studio on Sanity hosting (`SANITY_STUDIO_HOSTS` in `lib/config.ts`):
`guesthouseosaka.sanity.studio` edits `production`, `guesthouseosaka-dev.sanity.studio` edits
`development`. The site's `/studio` redirects to the Studio for the dataset it shows, and
`robots.txt` keeps crawlers out of it.

`.github/workflows/studio.yml` deploys the production Studio when a file the Studio is built
from changes on `main`. It authenticates with the `SANITY_DEPLOY_TOKEN` secret, a Sanity token
with the Deploy Studio role.

The development Studio is deployed by hand: run `bun run studio:deploy` from the branch whose
schema it should show, such as a feature branch that adds types. There is one development
Studio, so the last deploy wins. A field a branch adds shows as unknown in it until someone
deploys that branch or a `main` that includes it. To try a schema change without deploying,
`bun dev` and `bunx sanity dev` open a Studio at `localhost:3333` that edits `development` and
previews `localhost:3000`.

Both Studios have auto-updates on (`deployment.autoUpdates` in `sanity.cli.ts`): they load the
`sanity` package from Sanity's CDN, so upgrading it needs no deploy. Each Studio's channel
(`latest`, `stable`, `next` or a pinned version) is set in sanity.io/manage → Studios. Plugins
are bundled, so their updates go out with the next deploy.
