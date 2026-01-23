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
bunx sanity deploy            # Deploy Studio to Sanity hosting

# MCP Setup
bunx sanity@latest mcp configure  # Configure MCP for AI editor

# Help
bunx sanity docs search "query"   # Search documentation
```

## MCP Tools (Preferred)

Use MCP tools instead of ad-hoc scripts:

| Tool | Use For |
|------|---------|
| `query_documents` | Run GROQ queries |
| `create_document_from_markdown` | Create content |
| `patch_document` | Modify documents |
| `deploy_schema` | Deploy schema |
| `get_schema` | Inspect schema |
| `list_sanity_rules` / `get_sanity_rules` | Load best practices |

## GROQ Queries

- Use `defineQuery()` in `sanity/lib/queries.ts` for type safety
- Localized content pattern:
  ```groq
  coalesce(field[_key == $locale][0].value, field[_key == "en"][0].value)
  ```

## Rules

- **Always**: Run `typegen` after schema/query changes
- **Ask first**: Before modifying `sanity.config.ts` or deleting schema files
- **Never**: Hardcode API tokens (use `process.env`)
