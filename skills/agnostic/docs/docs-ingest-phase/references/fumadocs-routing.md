# Fumadocs Routing

Use this reference during Step 10 of `docs-ingest-phase`.

## Source And Projection

`apps/wiki` is both the private Fumadocs app and the canonical wiki source owner. Do not create another wiki, another content-owner layer, or a mirrored docs tree outside this app.

Canonical source content may remain in:

- `apps/wiki/domains`
- `apps/wiki/specs`
- `apps/wiki/raw`
- `apps/wiki/index.md`
- `apps/wiki/log.md`

Rendered/discoverable pages live under:

- `apps/wiki/content/docs/wiki`
- `apps/wiki/content/docs/project`

The routed pages are a projection layer. They may summarize, curate, and point back to canonical source files. They should not duplicate large specs, plans, implementation notes, runbooks, or source pages.

## Route Boundaries

Use `/docs/wiki` for product/domain knowledge:

- usage model
- concepts
- theory
- flows
- glossary
- docs-ingest-phase concept/flow ingest output

Use `/docs/project` for internal project operations:

- specs
- plans
- implementation notes
- maintenance logs
- decisions
- repo guidance
- operator/project runbooks
- useful Linear/grill-derived management context

Docs ingest concepts and flows are abstract/domain-theory outputs. The Fumadocs projection makes those outputs navigable.

## Fumadocs Mechanics

Fumadocs uses file paths to determine route slugs. Examples:

- `content/docs/wiki/index.mdx` -> `/docs/wiki`
- `content/docs/wiki/cli/index.mdx` -> `/docs/wiki/cli`
- `content/docs/project/specs/index.mdx` -> `/docs/project/specs`

Each folder with an explicit `meta.json` `pages` array must list every page or child folder that should appear in the page tree. Update `meta.json` whenever pages are added, moved, or removed.

Use root folders for the two main surfaces:

```json
{
  "title": "Wiki",
  "root": true
}
```

```json
{
  "title": "Project",
  "root": true
}
```

## Access Frontmatter

Preserve access-control frontmatter on routed pages:

```yaml
surface: wiki
permission: internal
```

```yaml
surface: project
permission: project
```

Do not implement full auth unless the repo already has the required auth primitives. When auth exists, prefer a small Fumadocs loader-level filter so restricted files are removed from the input source before page tree/search generation.
