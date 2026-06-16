---
name: docs-ingest-phase
description: Routes docs-affecting work into private/internal ingest and public-facing docs paths. Use when specs need durable domain capture, public docs need creation or material updates, wiki/Fumadocs routing changes, or code changes alter architecture, setup, contracts, operator workflow, or user-facing behavior.
---

# Docs Ingest Phase

## Quick Start

`docs-ingest-phase` is a reusable docs router.

1. Read [phases/router.md](phases/router.md).
2. Inspect only enough source, diff, spec, notes, wiki, public docs, and root docs state to choose the current docs path.
3. Load exactly one phase file from `phases/`.
4. Complete that path, write the docs-ingest outcome, then stop or re-enter `docs-ingest-phase` to route again.

Completion of one path does not imply loading the other path.

## Entry Modes

- **Private/internal ingest:** durable capture for specs, project docs, wiki internals, root `docs/`, runbooks, operator workflow, routing metadata, or learning artifacts.
- **Public docs:** reader-facing product, usage, domain, command, onboarding, or changelog docs.
- **Mixed docs:** one change needs both private/internal capture and public-facing docs.
- **No-op check:** determine whether docs ingest is already complete or intentionally unnecessary.

## Phase Files

- [phases/router.md](phases/router.md): choose the next docs path from artifacts and audience.
- [phases/private-internal.md](phases/private-internal.md): ingest specs, project/wiki docs, root docs, routing metadata, and learning artifacts.
- [phases/public-docs.md](phases/public-docs.md): create or update reader-facing docs through the public writer flow.

## Router Rules

- Do not read path files other than `router.md` until the router selects them.
- Classify by audience first: internal/project/operator docs are private/internal; reader/adopter/scaffold-recipient docs are public.
- Use the repo's existing private and public docs surfaces. Do not create a second routed docs surface or hardcode Harness-specific route names in other repos.
- If both paths apply, prefer private/internal first when source capture, route policy, metadata, or durable writer artifact location is unresolved.
- Public docs work that runs the writer flow must include the fragment sufficiency checkpoint from [phases/public-docs.md](phases/public-docs.md).
- After a path completes, report enough state for future resume: selected path, inputs processed, docs written or skipped, validation, blockers, and next path if any.

## Stop Conditions

- Selected path completed and its resumable outcome was reported.
- Router finds no docs-affecting change and reports a no-op reason.
- Required docs surface, route policy, source artifact, or user guidance is missing.
- Public fragment sufficiency checkpoint is waiting for the user's answer.
