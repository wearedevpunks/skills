---
name: docs-ingest-phase
description: Ingests specs and docs-affecting changes into canonical private/project docs and public-facing docs. Use when a spec is ready for domain capture, public docs need creation or material updates, wiki/Fumadocs routing changes, or code changes alter architecture, setup, contracts, operator workflow, or user-facing behavior.
---

# Docs Ingest Phase

## Contract

- **Role:** public phase entrypoint for docs ingest and repo-doc maintenance
- **Upstream:** reviewed or implemented spec folder, or concrete docs-affecting code changes
- **Delegates to:** private spec/project ingest, public-doc writer skills, routed page writing, route/navigation bookkeeping
- **Downstream:** canonical routed public and private docs, durable private writer artifacts, `meta.json` navigation, ingest metadata, wiki log/index updates, and required `docs/` updates
- **Stop conditions:** ingest bookkeeping complete, required docs updates complete, failures reported honestly

## Use When

- A reviewed or implemented spec folder should become durable routed domain knowledge.
- Substantial public-facing documentation needs to be created or materially updated.
- `apps/wiki` content, Fumadocs navigation, `meta.json`, or routed pages change.
- Code changes alter architecture, setup, contracts, decisions, runbooks, or operator workflow.
- `delivery-phase` reaches `$docs-ingest-phase` and docs-affecting changes exist.

## Do Not Use When

- The work is still requirements discovery, planning, coding, or review.
- The target spec is already marked `ingested: true`; report a no-op.
- The requested docs would document speculative future behavior as current truth.
- The task would duplicate large specs, plans, implementation notes, or runbooks into wiki/project pages instead of summarizing and linking.

## Quick Start

1. Resolve `<wiki-root>`:
   - monorepo: `apps/wiki`
   - single-repo: `wiki`
2. Read `<wiki-root>/AGENTS.md` before touching wiki content.
3. If ingesting a spec, read [references/wiki-ingest.md](references/wiki-ingest.md).
4. If the change produced durable bug or knowledge learning, read [references/learning-artifacts.md](references/learning-artifacts.md).
5. If creating or materially updating public-facing docs, read [references/public-docs.md](references/public-docs.md).
6. If updating routed docs or navigation, read [references/fumadocs-routing.md](references/fumadocs-routing.md).
7. If updating root `docs/`, read [references/repo-docs.md](references/repo-docs.md).
8. Finish by reporting written pages, writer artifacts, metadata changes, docs updates, learning outcomes, validation run, and any no-op reason.

## Wiki Ingest Pipeline

Run this order exactly:

```text
docs-ingest-phase
  -> resolve docs architecture and classify public/private targets
  -> scoped learning-artifact scan and refresh
  -> routed flow-writing phase
  -> routed concept-writing phase
  -> public-doc writer flow when substantial public-facing docs are created or materially updated
  -> ingest bookkeeping
  -> route/navigation bookkeeping
```

Why: concept pages can cross-link flow pages, so flows must exist first.

Public-doc writer flow:

```text
writing-fragments
  -> writing-beats
  -> writing-shape
  -> final public page write/merge
```

Run this flow for substantial public-facing page creation or material updates. Small public-doc patches may skip it with an explicit no-op reason.

## Routing

Use the repo's existing public docs surfaces for reader-facing pages and its private docs surface for specs, runbooks, maintenance, project context, and durable writer artifacts. Do not enforce Harness Intelligence route names in other repos. Do not create a second routed docs surface or separate `domains/` owner layer just because docs ingest ran.

## Output Contract

Always report:

- source spec or docs-affecting change processed
- learning artifacts scanned, written, updated, consolidated, replaced, deleted, marked stale, or intentionally skipped
- flows written or skipped
- concepts written or skipped
- public-doc writer artifacts written or skipped
- public pages written, merged, or skipped
- routed pages and `meta.json` updates
- ingest frontmatter/bookkeeping updates
- root `docs/` updates, if any
- validation commands run
- no-op reasons or blockers

## Never Do

- Leave new or moved routed pages out of navigation metadata.
- Strip access-control frontmatter from routed pages.
- Proceed to concept writing after a flow write fails.
- Create duplicate routed docs surfaces, `domains/` owner layers, roadmap mirrors, or backlog mirrors.
- Create a separate `docs/solutions/` tree or hidden memory tree for canonical learning.
- Write memory notes for every learning artifact; memory is only for compact hard-to-discover routing aids.
- Put agent task instructions inside human-facing docs pages.
- Duplicate article content across routed pages and another source tree.
