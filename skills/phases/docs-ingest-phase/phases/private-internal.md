# Private/Internal Docs Path

Use this path for private/project/operator docs, root docs, wiki ingest,
route/navigation metadata, durable learning, and writer artifact placement.

## Load References

Read only the references that match the selected work:

- Spec or implementation-note ingest: [../references/wiki-ingest.md](../references/wiki-ingest.md)
- Durable bug, knowledge, or research-report learning: [../references/learning-artifacts.md](../references/learning-artifacts.md)
- Routed wiki pages, navigation metadata, or discovery: [../references/fumadocs-routing.md](../references/fumadocs-routing.md)
- Root `docs/` maintenance: [../references/repo-docs.md](../references/repo-docs.md)

## Workflow

1. Use the resolved [wiki contract](../references/wiki-contract.md) for `<wiki-root>`, the raw home, the canonical article tree, the discovery entrypoints and the validation commands, and read `<wiki-root>/AGENTS.md` before touching wiki content.
2. Classify every target as private/internal or public by audience.
   - A durable research report identified by immutable commit SHA and path is
     primary learning evidence; preserve that source pointer during projection.
3. For private/internal ingest, run these steps in order. Each step starts only after the previous one is done.
   1. **Learning**: scoped learning-artifact scan and refresh. Done when each scoped artifact has a recorded refresh outcome.
   2. **Flows**: routed flow writing. Done when the [flow completion rule](../references/flow-pages.md#completion) holds. When a required flow write fails, stop concept writing and go to the Outcome step: the outcome is partial.
   3. **Concepts**: routed concept writing. Done when every extracted concept is written, merged, a knowledge no-op, or recorded unfinished.
   4. **Discovery**: navigation and discovery for every changed article. Done when the [discovery rules](../references/fumadocs-routing.md#discovery) hold.
   5. **Root docs**: root `docs/` updates. A wiki projection of a root doc changes only through its canonical source and the project's sync command. Done when each affected root doc is updated or recorded as unaffected.
   6. **Outcome**: run the contract's validation commands, then record the [ingest outcome](../references/wiki-ingest.md#outcome), its bookkeeping and its [log](../references/wiki-ingest.md#log) entry. Done when the outcome names each unfinished item or none.
4. If public docs are also needed, leave a handoff with the public target, source links, and durable writer artifact home. Re-enter `docs-ingest-phase` for the public path.

## Output Contract

Report:

- source spec or docs-affecting change processed, with its freshness classification
- learning artifacts scanned, written, updated, consolidated, replaced, deleted, marked stale, or intentionally skipped
- flows written or skipped
- concepts written, merged, or recorded as a knowledge no-op
- routed pages, `meta.json` updates and discovery-map entries
- ingest frontmatter/bookkeeping updates
- root `docs/` updates, if any
- public docs handoff, if any
- validation commands run
- outcome: complete, partial with each unfinished item, or no-op with its reason

## Boundaries

- Keep access-control frontmatter on routed pages.
- Keep one routed docs surface: no duplicate article tree, `domains/` owner layer, roadmap mirror, or backlog mirror.
- Keep canonical learning in routed learning artifacts, not in a `docs/solutions/` tree or a hidden memory tree.
- Keep agent task instructions out of human-facing docs pages.
