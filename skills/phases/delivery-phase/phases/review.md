# Review Phase

Use after `implement-spec` returns complete implementation evidence. For a stale
or missing retained review, first recheck the same completion gates against the
current snapshot.

## Prepare Review

1. Require implementation, applicable task checks and Task Gates, Verification,
   parent shared-summary reconciliation, Architecture Checkpoints and final
   acceptance evidence. Missing or stale proof returns the exact owning gate;
   it cannot enter Code Review. Review consumes Verification evidence while
   implementation owns verifier execution and maintenance.
2. Validate accepted bounds and normalize the supported Git/diff target without
   mutation. Invalid bounds or unsupported targets return `review_failed` with
   exact evidence, no report and no completed-count change.
3. Recover completed Full Code Review Passes from valid retained evidence for
   this delivery lineage and reconcile `review_count`. Interrupted, incomplete
   or invalidated attempts are neither clean nor completed; preserve their
   attempt identity and missing coverage without consuming completed allowance.
4. Default to one Full Code Review Pass over the frozen implemented change.
   After a completed pass, apply the repair rules below before opening another.
   At two completed passes, return `review_budget_exhausted` unless explicit
   human direction authorizes another. Record the exhausted route evidence;
   preserve retained reports, counts and pending work.
5. For an eligible pass, persist `review_due`, the normalized target and
   `$review-phase` invocation context from the phase-handoff reference. Full
   delivery invokes it immediately; other modes return that context and stop.
   Invocation fixes the attempt identity and proposed next completed ordinal;
   only complete coverage plus valid retained evidence establishes completion.

The review owner prepares one frozen Review Packet for the comprehensive primary
reviewer and mandatory independent risk-focused challenger. Completion requires
explicit primary outcomes for Standards, skill adherence, architecture, simplify
and Spec, plus complete challenger coverage for its bounded independent risk
area. The parent adjudicates findings and owns the report. Reach
[review-phase](../../review-phase/SKILL.md) for that protocol.

A semantic input change during an active attempt invalidates it. Record the
changed input, preserve the incomplete attempt evidence and start a fresh attempt
over the new frozen target after rechecking affected implementation gates. This
is distinct from accepted repair after a completed pass.

For `report_retention_pending`, recheck target/source freshness and resume the
existing run and local report identity without rerunning reviewers. Semantic
change instead invalidates the attempt. A retention retry alone grants neither
a new pass nor a second completed ordinal.

## Validate Accepted Repair

Ordinary accepted repair runs Focused Repair Validation and reruns only
Verification scenarios whose evidence it invalidated. Keep matching unaffected
proof with its identity and freshness. Passing focused checks resumes delivery
routing without automatically opening a second Full Code Review Pass.

One second completed pass is eligible only when accepted repair changes
architecture, security or authorization, a public contract, runtime or deployment
topology, or accepted scope. Record the changed risk category and accepted repair
evidence before requesting it; changed accepted scope must already have explicit
authority. Recheck implementation completion and freeze the repaired target.
The two-completed-pass ceiling still applies.

Continue a repair only when new evidence advances diagnosis or validation, or a
remaining discriminating diagnostic can resolve the failure. Record that evidence
or diagnostic before retrying. A stagnant loop returns an exact blocker and
remaining work; it never counts as progress or expands the review allowance.

## Route Retained Findings

After the retained report establishes the completed ordinal:

1. Recompute aggregate routing from every finding's validated `return_route`
   with the review contract helper. Reject a mismatch with the retained routing
   object.
2. For primary `human_steering_required`, preserve the returned decision record
   and stop. It never opens a repair state.
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
