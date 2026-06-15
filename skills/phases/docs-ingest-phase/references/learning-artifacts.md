# Learning Artifacts

Use this reference when `docs-ingest-phase` receives a spec, implementation, bugfix, debugging result, review result, or operator workflow change that produced durable learning.

## Purpose

Close the loop so future discovery, planning, debugging, and review can reuse what was learned. Canonical learning lives in routed wiki/project docs, not in a separate `docs/solutions/` tree and not as a hidden memory mirror.

## Scope

Run a scoped scan around the current ingest's:

- domain
- module
- component
- referenced files
- source spec or implementation notes

Do not run broad repository archaeology by default.

## Learning Types

Every learning artifact must declare one type:

- `learning_type: bug`
- `learning_type: knowledge`

Shared fields:

- `date`
- `domain`
- `module`
- `component`
- `severity`
- `source`
- `referenced_files`
- `future_use_hooks`

Bug-only fields:

- `symptoms`
- `root_cause`
- `resolution_type`
- `prevention`

Knowledge-only fields:

- `applies_when`
- `guidance`
- `why_it_matters`

## Refresh Outcomes

Before writing a new learning artifact, check existing routed learning pages in the scoped area and choose exactly one outcome:

- `keep`: current learning is still accurate and this ingest adds nothing durable
- `update`: same learning needs fresher facts, references, examples, or prevention notes
- `consolidate`: overlapping learnings should become one canonical page
- `replace`: old guidance is misleading and a clear successor exists
- `delete`: old guidance is clearly obsolete, unreferenced, and no longer useful
- `mark_stale`: accuracy is ambiguous or needs a human decision

Record the outcome in the ingest report.

## Future-Use Hooks

Every learning artifact must expose at least one hook that makes future reuse likely:

- link from a routed flow, concept, or runbook
- link from spec or implementation notes
- compact memory note only for hard-to-discover gotchas or routing aids
- update a phase skill reference when the learning changes agent behavior
- add a prevention or test note to a validation/review checklist

Do not rely on search alone as the hook.

## Memory Boundary

Use memory notes sparingly.

- Canonical knowledge: routed learning artifact.
- Navigation/discovery: future-use hooks.
- Compact gotcha/routing aid: memory note.

Do not create memory notes for routine learnings, obvious file locations, or content that already has a routed page and future-use hooks.

## Output

For each scoped ingest, report:

- scoped search area
- existing learning artifacts considered
- chosen refresh outcome
- pages written or changed
- future-use hooks added
- memory note written or skipped with reason
