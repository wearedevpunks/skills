# Private/Internal Docs Path

Use this path for private/project/operator docs, root docs, wiki ingest,
route/navigation metadata, durable learning, and writer artifact placement.

## Load References

Read only the references that match the selected work:

- Spec or implementation-note ingest: [../references/wiki-ingest.md](../references/wiki-ingest.md)
- Durable bug or knowledge learning: [../references/learning-artifacts.md](../references/learning-artifacts.md)
- Routed wiki pages or navigation metadata: [../references/fumadocs-routing.md](../references/fumadocs-routing.md)
- Root `docs/` maintenance: [../references/repo-docs.md](../references/repo-docs.md)

## Workflow

1. Resolve `<wiki-root>` when wiki docs are in scope:
   - monorepo: `apps/wiki`
   - single-repo: `wiki`
2. Read `<wiki-root>/AGENTS.md` before touching wiki content.
3. Classify every target as private/internal or public by audience.
4. For private/internal ingest, run the required reference workflows in this order:
   - scoped learning-artifact scan and refresh
   - routed flow-writing phase
   - routed concept-writing phase
   - ingest bookkeeping
   - route/navigation bookkeeping
   - root `docs/` updates
5. If public docs are also needed, leave a handoff with the public target, source links, and durable writer artifact home. Re-enter `docs-ingest-phase` for the public path.

Flow pages must complete before concept pages because concept pages may
cross-link flows. If any required flow write fails, stop and report a resumable
failure.

## Output Contract

Report:

- source spec or docs-affecting change processed
- learning artifacts scanned, written, updated, consolidated, replaced, deleted, marked stale, or intentionally skipped
- flows written or skipped
- concepts written or skipped
- routed pages and `meta.json` updates
- ingest frontmatter/bookkeeping updates
- root `docs/` updates, if any
- public docs handoff, if any
- validation commands run
- no-op reasons or blockers

## Never Do

- Leave new or moved routed pages out of navigation metadata.
- Strip access-control frontmatter from routed pages.
- Proceed to concept writing after a flow write fails.
- Create duplicate routed docs surfaces, `domains/` owner layers, roadmap mirrors, or backlog mirrors.
- Create a separate `docs/solutions/` tree or hidden memory tree for canonical learning.
- Put agent task instructions inside human-facing docs pages.
