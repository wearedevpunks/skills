# Artifact State

Use this reference when deciding whether a phase is complete enough to skip.

## Spec Complete

- `SPEC.md` exists and matches the requested goal.
- Scope includes required tracker children, acceptance criteria, constraints,
  and non-goals.
- Open questions are parked, resolved, or explicitly blocking.

## Plan Complete

- `PLAN.md` exists and matches the spec.
- Tasks have dependencies, owned paths, validation gates, and wave boundaries.
- `execution_mode` is persisted as `sequential` or `parallel`.

## Backlog Projection Complete

- Projection evidence names the immutable spec URL, provider destination,
  epic/story ids and URLs, and verified observed state.
- Evidence matches the current spec; otherwise the projection is stale.

## Implementation Complete

- Plan tasks are complete or explicitly deferred.
- Implementation notes or equivalent evidence describe changed files, validation,
  blockers, and debt.

## Review Complete

- `review-phase` ran after the latest implementation diff.
- Findings are resolved, accepted, routed to debug, or captured as follow-up.

## Debug Complete

- Runtime evidence was investigated.
- Fix or blocker is recorded.
- Relevant validation was rerun.

## Docs Complete

- Docs-affecting changes were ingested, or an explicit no-op reason exists.

## Closeout Complete

- Final report names what ran, what was skipped, validation evidence, docs
  outcome, stack state when relevant, and remaining blockers.
