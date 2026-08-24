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

1. Recompute aggregate routing from every finding's validated `return_route`
   with the review contract helper. Reject a mismatch with the retained routing
   object.
2. For primary `human_steering_required`, preserve the returned `$handback`
   outcome and stop. It never opens a repair state.
3. When `secondary_architecture_follow_up` is true, enter `debt_follow_up`
   first and persist the primary `debugging` or `implementation` route as
   `post_debt_route`.
4. Without secondary debt, `debugging` opens debugging and `implementation`
   opens implementation.
5. Primary `debt_follow_up` enters debt capture with `post_debt_route` set to
   `docs_ingest` when documentation remains, otherwise `closeout`.
6. `docs_ingest` enters docs ingest. `closeout` enters closeout.

Architecture debt may remain a secondary follow-up beside debugging or
implementation. Open its repair only after debt capture. Opening either repair
route is one atomic durable handoff write of active state, route,
`repair_count = review_count`, and idempotency `review_run_id`. Reject a
mismatched or already-consumed repair ordinal. Complete the transition only
after that write. Resume an already-recorded run directly without another
increment.

## Capture Debt Follow-Up

For each primary or secondary debt finding, enter `debt_follow_up` and upsert a
goal/spec-linked debt artifact exactly once. Key each entry by retained report
commit, retained report path, and stable finding ID. Persist the artifact path,
keys, captured finding IDs, and `post_debt_route` in the review handoff before
leaving this state. Set `post_debt_route` to the higher-priority `debugging` or
`implementation` route for secondary debt. For primary debt, set it to
`docs_ingest` when required documentation remains, otherwise `closeout`. On
resume, reuse matching keys, add only missing entries, and follow the recorded
route after every key is present.

Debt capture records unaccepted work; it does not implement the debt or open an
implementation task. Primary capture resumes `docs_ingest` or `closeout`;
secondary capture resumes its recorded repair. Capture happens once before that
route.

## Completion

Before review, completion is a durable `review_due` handoff plus an invocation
context; full delivery consumes it immediately. After review returns `review_routed`, completion
records report path, report SHA-256, report commit SHA, verified retained ref,
lineage, run id, recovered/projected counts, stable finding ids, primary route,
secondary debt route when present, and resulting state. Full delivery re-enters
routing; other modes stop at their boundary.
