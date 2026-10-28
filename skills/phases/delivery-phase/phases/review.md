# Review Phase

Use after `implement-spec` returns complete implementation evidence, or to
resume an active review run or route an unrouted Pass Report. `review.mjs` is
the [review-phase](../../review-phase/SKILL.md) skill's `scripts/review.mjs`;
`<goal_dir>` is `.devpunks/delivery/<goal>`.

## Prepare Review

1. Recheck the [Architecture/SPEC pair](../references/artifact-state.md#architecturespec-pair-complete)
   before review or resume. Carry the exact architecture identity and required
   decision selectors as governing review sources alongside Spec and plan, and
   pass the spec folder as `--spec`.
   Require implementation, applicable task checks and Task Gates, Verification,
   parent shared-summary reconciliation, Architecture Checkpoints and final
   acceptance evidence. Missing or stale proof returns the exact owning gate;
   it cannot enter Code Review. Review consumes Verification evidence while
   implementation owns verifier execution and maintenance.
2. Validate accepted bounds. The review target is the delivery branch from its
   base commit to `HEAD`. Invalid bounds return `review_failed` with exact
   evidence; the pass count stays unchanged.
3. Read `pass_count` from `review.mjs status --goal <goal_dir>`. It counts the
   valid Pass Reports in `<goal_dir>/reviews/`; an incomplete or interrupted run
   has no Pass Report and counts no pass.
4. Default to one Full Code Review Pass over the implemented change.
   After a completed pass, apply the repair rules below before opening another;
   a risk-triggered second pass passes `--accepted-risk <kind>:<evidence>`.
   At two completed passes, a further pass needs explicit
   human direction, passed as `--human-direction <evidence>`. Without it return
   `review_budget_exhausted` with the `prepare` blocker and keep the Pass
   Reports and pending work.
5. For an eligible pass, persist `review_due` and the
   `$review-phase` invocation context from the
   [phase-handoff reference](../references/phase-handoff.md#review-invocation-context).
   In `provider-task` mode, record the review started fact on every linked
   Task (see [Ticket Live State](#ticket-live-state)). Full
   delivery invokes it immediately; other modes return that context and stop.
   Only the Pass Report that `retain` commits completes the pass.

`$review-phase` runs the whole Full Code Review Pass: two Axis Runs with Engine
Fallback, one Adjudicator and one Pass Report, and it starts every review
engine. Every delivery takes this full pass, whatever its size.

A semantic input change during an active run invalidates it: `status` returns
`next: prepare` once `HEAD` moves after `prepare`. Record the changed input,
recheck affected implementation gates and prepare a fresh run over the new
target. This is distinct from accepted repair after a completed pass.

## Validate Accepted Repair

Ordinary accepted repair runs Focused Repair Validation and reruns only
Verification scenarios whose evidence it invalidated. Keep matching unaffected
proof with its identity and freshness. Passing focused checks resumes delivery
routing without automatically opening a second Full Code Review Pass.

One second completed pass is eligible only when accepted repair changes
architecture, security or authorization, a public contract, runtime or deployment
topology, or accepted scope. Record that change as the `accepted_risk` kind
`architecture`, `security`, `public_contract`, `runtime_topology` or
`accepted_scope` with its accepted repair evidence; changed accepted scope must
already have explicit authority. Recheck implementation completion before the
pass. The two-completed-pass ceiling still applies.

Continue a repair only when new evidence advances diagnosis or validation, or a
remaining discriminating diagnostic can resolve the failure. Record that evidence
or diagnostic before retrying. A stagnant loop returns an exact blocker and
remaining work; it never counts as progress or expands the review allowance.

## Route Findings

`$review-phase` returns the Pass Report `route`. The
[routing reference](../../review-phase/references/routing.md) is the single
route table: follow the transition it names for `route.primary` and
`route.secondary_debt`, including its one handoff write that opens a repair. For
primary `human_steering_required`, preserve the returned decision record and
stop; delivery never opens a repair state from it.

## Ticket Live State

In `provider-task` mode, the linked Tasks follow the review through
`write-backlog`'s
[Delivery Checkpoints](../../../agnostic/requirements/write-backlog/references/delivery-status.md#delivery-checkpoints),
each with exact readback before the next step:

1. `review_due` persisted: review started.
2. Pass Report returned: review result with the Pass Report path,
   `route.primary` and open finding count.
3. The route acts: work resumed with the finding ids for repair or debugging;
   blocked with the decision needed for `human_steering_required` or
   `review_budget_exhausted`.

Completion: every linked Task's readback shows the review state of the latest
step, so no ticket still says in progress while review runs.

## Capture Debt Follow-Up

For each primary or secondary debt finding, enter `debt_follow_up` and upsert a
goal/spec-linked debt artifact exactly once. Key each entry by Pass Report path
and stable finding ID. Persist the artifact path, keys, captured finding IDs,
and the `post_debt_route` from the route table in the review handoff before
leaving this state. On resume, reuse matching keys, add only missing entries,
and follow the recorded route after every key is present.

Debt capture records unaccepted work; it does not implement the debt or open an
implementation task. Primary capture resumes `docs_ingest` or `closeout`;
secondary capture resumes its recorded repair. Capture happens once before that
route.

## Completion

Before review, completion is a durable `review_due` handoff plus an invocation
context; full delivery consumes it immediately. After `$review-phase` returns,
`review_routed` records `pass_report`, `review_run_id`, stable finding ids,
`route.primary`, `route.secondary_debt` and the resulting state. Full delivery
re-enters routing; other modes stop at their boundary.
