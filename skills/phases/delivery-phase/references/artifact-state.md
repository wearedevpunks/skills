# Artifact State

Use this reference when deciding whether a phase is complete enough to skip.

## Spec Complete

- A matching agent-ready `SPEC.md` has `readiness: agent-ready`; its scope is
  current, complete and consistent with the requested goal.
- Verified remote retention proves the retained ref contains the exact spec commit
  and the verified immutable blob URL resolves that commit/path with bytes matching
  the current SPEC identity. A stored URL or local file alone is insufficient.
- Scope includes required tracker children, acceptance criteria, constraints,
  and non-goals.
- Required unresolved questions or missing, stale or contradictory authority
  prevent completion. Agent-ready compiler output needs no additional spec
  approval or review gate.

## Plan Complete

- `PLAN.md` exists and matches the spec.
- One uniform `task_identity_mode` applies. In `provider-task` mode every `Tn`
  resolves one stable provider Task ID and URL, preserves the same `V*`, and
  mirrors native blocker edges through `depends_on`. In `planning-only` mode
  each `Tn` is the execution identity, provider identity slots are `not_applicable`,
  relation mode is `unprojected`, a nonempty sync-skip reason is present, and
  `depends_on` names plan `Tn` identities.
- Tasks have Active Write Scopes, Read Dependencies, Shared Runtime Resources,
  Relevant Input Set identities, validation gates and wave boundaries.
- Each wave contains every currently unblocked task with a disjoint write scope;
  one-task waves are justified by dependencies or ownership.

## Backlog Projection Complete

- The current Write Backlog result names the verified immutable spec URL and
  identity, provider destination, exact
  Epic and Story identities, provider Task IDs and URLs, same `V*`, native
  blocker edges, and verified observed state.
- Exact provider readback and projection evidence match the current retained
  specification identity and provider state; otherwise the projection is stale.

## Implementation Complete

- Plan tasks are complete or explicitly deferred.
- Implementation notes or equivalent evidence describe changed files, validation,
  blockers, and debt.
- Exact `write-backlog` delivery-status readback exists for each directly
  observed work start, blocker, pull request, merge, staging deployment, or
  production deployment. Merge is never deployment evidence.
- Fog completion exists only when production evidence covers every accepted
  resulting Story and Task.

## Review Complete

- An immutable report matches the delivery lineage, accepted bounds and frozen
  reviewed target/source identities. Unchanged implementation retains fresh proof;
  subsequent accepted repair requires the evidence specified by the review
  transition below rather than an automatic replacement report.
- Its commit exists on a verified retained ref; a local report alone is pending.
- The highest valid retained ordinal is authoritative and the handoff
  `review_count` is its reconciled projection.
- Findings are routed by stable ids. Review itself entered no repair state.
- Accepted repair follows [review transition](../phases/review.md): retain Focused
  Repair Validation and affected Verification evidence; preserve historical report
  identities and ordinals during read-time normalization.

## Debug Complete

- Runtime evidence was investigated.
- Fix or blocker is recorded.
- Relevant validation was rerun.

## Docs Complete

- Docs-affecting changes were ingested, or an explicit no-op reason exists.

## Closeout Complete

- Final report names what ran, what was skipped, validation evidence, docs
  outcome, stack state when relevant, and remaining blockers.
- The final path-limited commit includes review and docs-ingest changes while
  preserving unrelated dirty user files. Required release classification and
  exact-tree provider proof match that final tree.
