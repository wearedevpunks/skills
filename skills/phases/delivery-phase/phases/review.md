# Review Phase

Use after implementation or whenever delivery has `review_due` for a stale or
missing retained review.

## Prepare Review

1. Validate accepted bounds and normalize a supported Git/diff target without
   mutating it. Unsupported targets or invalid bounds enter `review_failed`
   with exact evidence, no report, and no counter change.
2. Keep that result in memory and recover `review_count` from unique valid retained passes for the
   delivery lineage and reconcile the handoff projection.
3. If recovered `review_count >= 3`, return `review_budget_exhausted` with exact
   current-route evidence. This is a zero-write no-op: do not persist
   `review_due` or mutate any handoff, counter, or delivery status.
4. Only when recovered `review_count < 3`, persist `review_due` with the valid
   normalized target and `$review-phase` invocation context defined in the
   phase-handoff reference. Do not preallocate an ordinal or derive
   `review_run_id` yet.
5. Full delivery invokes `$review-phase` with that context immediately. Other
   modes return it and stop. Invocation preallocates ordinal `review_count + 1`,
   fixes `review_run_id`, and enters `review_running`.

For `report_retention_pending`, use a `$review-phase` resume context with the
existing run id, local report identity, and fresh target/source hashes. Full
delivery resumes it immediately; other modes return it and stop. Retention
resumes without rerunning lenses.

## Route Retained Findings

After the retained report establishes the completed ordinal:

1. Runtime evidence routes primarily to debugging.
2. Otherwise, an in-scope non-runtime blocker routes primarily to implementation.
3. Otherwise, broad architecture debt routes to debt follow-up.
4. Otherwise, route to docs ingest or closeout by documentation completeness.

Architecture debt may remain a secondary follow-up beside debugging or
implementation. Opening either repair route is one atomic durable handoff write
of active state, route, `repair_count = review_count`, and idempotency
`review_run_id`. Reject a mismatched or already-consumed repair ordinal.
Complete the transition only after that write. Resume an already-recorded run
directly without another increment.

## Completion

Before review, completion is a durable `review_due` handoff plus an invocation
context; full delivery consumes it immediately. After review returns `review_routed`, completion
records report path, report SHA-256, report commit SHA, verified retained ref,
lineage, run id, recovered/projected counts, stable finding ids, primary route,
secondary debt route when present, and resulting state. Full delivery re-enters
routing; other modes stop at their boundary.
