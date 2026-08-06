# Artifact State

Use this reference when deciding whether a phase is complete enough to skip.

## Plan Complete

- `PLAN.md` exists and matches the requested goal and accepted planning input.
- Tasks have dependencies, owned paths, validation gates, and wave boundaries.
- Each wave contains every currently unblocked task with a disjoint write scope;
  one-task waves are justified by dependencies or ownership.

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
