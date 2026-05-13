---
name: docs-ingest-phase
description: Ingest specs into the wiki source layer, project wiki/project pages into Fumadocs routes, and keep repo docs accurate. Use when a spec is ready for domain capture, when apps/wiki content or Fumadocs navigation changes, or when code changes alter architecture, setup, contracts, or operator workflow.
---

# Docs Ingest Phase

## Contract

- **Role:** higher-order ingest and repo-docs phase
- **Entrypoint type:** public phase entrypoint
- **Upstream:** reviewed or implemented spec folder, or concrete docs-affecting code changes
- **Delegates to:** internal flow-writing phase, internal concept-writing phase, Fumadocs projection
- **Downstream:** synced wiki indexes, ingest metadata, wiki log, routed Fumadocs pages/meta, and required `docs/` updates
- **Entry conditions:** resolved spec folder for ingest work, or a concrete docs-affecting code change
- **Stop conditions:** ingest bookkeeping complete, required docs updates complete, failures reported honestly

## Use When

- A reviewed or implemented spec folder should become durable domain knowledge.
- `apps/wiki` source content, Fumadocs navigation, `meta.json`, or routed pages change.
- Code changes alter architecture, setup, contracts, decisions, runbooks, or operator workflow.
- `delivery-phase` reaches `$docs-ingest-phase` and docs-affecting changes exist.

## Do Not Use When

- The work is still requirements discovery, planning, coding, or review.
- The target spec is already marked `ingested: true`; report a no-op.
- The requested docs would document speculative future behavior as current truth.
- The task would duplicate large specs/plans/source pages into routed MDX instead of summarizing and linking.

## Quick Start

1. Resolve `<wiki-root>`:
   - monorepo: `apps/wiki`
   - single-repo: `wiki`
2. Read `<wiki-root>/AGENTS.md` before touching wiki content.
3. If ingesting a spec, read [references/wiki-ingest.md](references/wiki-ingest.md).
4. If updating routed docs, read [references/fumadocs-routing.md](references/fumadocs-routing.md).
5. If updating root `docs/`, read [references/repo-docs.md](references/repo-docs.md).
6. Finish by reporting written pages, metadata changes, docs updates, validation run, and any no-op reason.

## Wiki Ingest Pipeline

Run this order exactly:

```text
docs-ingest-phase
  -> flow-writing phase
  -> concept-writing phase
  -> ingest bookkeeping
  -> Fumadocs projection
```

Why: concept pages can cross-link flow pages, so flows must exist first.

## Fumadocs Routing

Keep the private Fumadocs app discoverable:

- `/docs/wiki` renders product/domain knowledge: usage, concepts, theory, flows, glossary, and concept/flow ingest output.
- `/docs/project` renders internal project operations: specs, plans, implementation notes, maintenance logs, decisions, repo guidance, runbooks, and useful management context.

Do not create a second wiki or separate content-owner layer. `apps/wiki` owns canonical source content and rendered Fumadocs pages.

## Output Contract

Always report:

- source spec or docs-affecting change processed
- flows written or skipped
- concepts written or skipped
- source frontmatter/bookkeeping updates
- Fumadocs routed pages and `meta.json` updates
- root `docs/` updates, if any
- validation commands run
- no-op reasons or blockers

## Never Do

- Leave new or moved routed pages out of Fumadocs `meta.json`.
- Strip or omit `surface` / `permission` frontmatter from routed pages.
- Proceed to concept writing after a flow write fails.
- Create `docs/prd`, `docs/dev`, roadmap, sprint, or backlog-mirror folders.
- Put agent task instructions inside human-facing docs pages.
- Leave docs orphaned from `docs/README.md` after adding or renaming them.
- Duplicate content between `<wiki-root>/domains/` and `docs/reference/domains/`.
