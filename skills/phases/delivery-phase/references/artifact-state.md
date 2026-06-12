# Artifact State

Use this reference when deciding whether a phase is complete enough to skip.

## Spec Complete

- `SPEC.md` exists and matches the requested goal.
- Scope includes required tracker children, acceptance criteria, constraints,
  and non-goals.
- Open questions are parked, resolved, or explicitly blocking.

## Plan Complete

- `PLAN.md` exists and matches the spec.
- Tasks have order, dependencies, owned paths, and validation gates.
- Mode is explicit or derivable: `parallel: true` or `parallel: false`.

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
