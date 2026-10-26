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

`.github/workflows/studio.yml` deploys them when a file the Studio is built from changes:
pushes to `main` deploy both, other branches only the development Studio. It authenticates
with the `SANITY_DEPLOY_TOKEN` secret, a Sanity token with the Deploy Studio role.
