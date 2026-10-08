# Fumadocs Routing

Use this reference when `docs-ingest-phase` creates, moves, or changes routed Fumadocs pages. It is the single source of the navigation and discovery rules; other references point here.

## Canonical Routed Content

The canonical article tree from the [wiki contract](wiki-contract.md), for example `<wiki-root>/content/docs`, is the one routed, human-facing article tree. Each concept, flow, or other article has exactly one home in it; a separate `domains/` tree would give one article two homes and drift.

`<wiki-root>/specs`, the raw home, `<wiki-root>/index.md`, and `<wiki-root>/log.md` are source, input, or bookkeeping surfaces, not article trees.

## Route Boundaries

Use the repo's private docs route for:

- specs
- plans
- implementation notes
- maintenance logs
- decisions
- repo guidance
- operator/project runbooks
- useful Linear/grill-derived management context
- project-specific projections
- docs-ingest-phase concept/flow output
- durable public-doc writer artifacts

Link or summarize implementation specs and notes; large source artifacts stay in their source home.

Use the repo's public-facing docs routes for reader-facing product, usage, domain, command, changelog, and onboarding pages. Take public route names from the target repo.

## Fumadocs Mechanics

Fumadocs uses file paths to determine route slugs. Examples:

- `content/docs/project/specs/index.mdx` -> `/docs/project/specs`

A folder's `meta.json` with an explicit `pages` array lists every page or child folder of that folder that appears in the page tree; a page it omits is absent from the sidebar.

Use a root folder for the default project surface:

```json
{
  "title": "Project",
  "root": true
}
```

## Discovery

Every routed article that this run creates, moves, or changes needs three things:

1. **Navigation**: the owning `meta.json`, the one in the article's folder, lists the article. After a move or removal, update every `meta.json` that listed the old path.
2. **Discovery map**: for an article in the wiki's canonical article tree, the root or topic index among the contract's discovery entrypoints holds one discovery-map entry for the article, with its link, a one-line scope summary and an "Applies when" cue that names the task or question that should reach it:

   ```md
   - [<Title>](<route>) — <one-line scope summary>. Applies when: <task or question>.
   ```

3. **Links**: every link in the article and in its discovery-map entry resolves, checked by the contract's validation commands.

Done when, for every changed article, its `meta.json` lists it, its discovery-map entry exists and its links resolve. Check this before the run reports complete; each gap stays recorded as unfinished work.

## Machine views

The machine views that the wiki contract lists as discovery entrypoints, for Fumadocs typically `llms.txt`, `llms-full.txt`, per-page Markdown and search, serve the same routed corpus as the page tree. An article that meets [Discovery](#discovery) reaches every one of them; repository readers and HTTP readers see the same canonical articles.

The raw home, `index.md`, `log.md` and every other file outside the collection stay outside the HTTP exports. When an article cites a raw original, link its repository path and mark it repository-only. Claim HTTP availability or a wider audience only for routed pages, within the contract's visibility policy.

## Routed Page Frontmatter

Preserve access-control frontmatter on routed pages:

```yaml
surface: project
permission: project
```

[concept-pages.md](concept-pages.md#page-shape) and [flow-pages.md](flow-pages.md#page-shape) own the full page frontmatter.

Keep the repo's existing access-control mechanism. When the repo already has auth primitives, prefer a small Fumadocs loader-level filter that removes restricted files from the input source before page tree and search generation.
