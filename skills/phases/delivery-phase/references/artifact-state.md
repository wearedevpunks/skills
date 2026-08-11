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
- Each wave contains every currently unblocked task with a disjoint write scope;
  one-task waves are justified by dependencies or ownership.

## Backlog Projection Complete

- Projection evidence names the immutable spec URL, provider destination,
  epic/story ids and URLs, and verified observed state.
- Evidence matches the current spec; otherwise the projection is stale.

## Implementation Complete

- Plan tasks are complete or explicitly deferred.
- Implementation notes or equivalent evidence describe changed files, validation,
  blockers, and debt.

## Review Complete

- A fresh immutable report matches the delivery lineage, accepted bounds,
  normalized target, governing source hashes, and latest implementation state.
- Its commit exists on a verified retained ref; a local report alone is pending.
- The highest valid retained ordinal is authoritative and the handoff
  `review_count` is its reconciled projection.
- Findings are routed by stable ids. Review itself entered no repair state.
- After fix 3, `clean_handoff` supersedes the normal fresh-review requirement
  and links report 3, final changes, focused validation, and clean status.

## Debug Complete

- Runtime evidence was investigated.
- Fix or blocker is recorded.
- Relevant validation was rerun.

## Docs Complete

- Docs-affecting changes were ingested, or an explicit no-op reason exists.

## Closeout Complete

- Final report names what ran, what was skipped, validation evidence, docs
  outcome, stack state when relevant, and remaining blockers.
