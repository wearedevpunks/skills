# Fumadocs Routing

Use this reference when `docs-ingest-phase` updates routed wiki or project docs.

## Canonical Routed Content

`apps/wiki` owns the wiki application and its documentation content. Routed MDX pages are the canonical human-facing docs surface:

- `<wiki-root>/content/docs/wiki`
- `<wiki-root>/content/docs/project`

Do not create or maintain a separate canonical `domains/` tree for concepts and flows. That split creates drift because one article then has two homes.

`<wiki-root>/specs`, `<wiki-root>/raw`, `<wiki-root>/index.md`, and `<wiki-root>/log.md` may remain source/input/bookkeeping surfaces. They are not duplicate article trees.

## Route Boundaries

Use `/docs/wiki` for product/domain knowledge:

- usage model
- concepts
- theory
- flows
- glossary
- docs-ingest-phase concept/flow output

Use `/docs/project` for internal project operations:

- specs
- plans
- implementation notes
- maintenance logs
- decisions
- repo guidance
- operator/project runbooks
- useful Linear/grill-derived management context

Keep implementation specs and notes linked or summarized. Do not paste large source artifacts into routed pages.

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

## Routed Page Frontmatter

Preserve access-control frontmatter on routed pages:

```yaml
surface: wiki
permission: internal
```

```yaml
surface: project
permission: project
```

Routed ingest pages should also carry durable metadata when useful:

```yaml
domain: <domain>
type: concept | flow
status: proposed | implemented
source:
  - apps/wiki/specs/<domain>/<spec>/SPEC.md
updated: YYYY-MM-DD
```

Do not implement full auth unless the repo already has the required auth primitives. When auth exists, prefer a small Fumadocs loader-level filter so restricted files are removed from the input source before page tree/search generation.
