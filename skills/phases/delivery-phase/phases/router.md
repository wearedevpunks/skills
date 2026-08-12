# Router Phase

Choose one next phase from durable artifacts. Review counters and active repair
state take precedence over inferred artifact order.

## Inputs

- entry intent and accepted goal bounds
- matching spec, backlog projection, plan, implementation notes, and validation
- retained review reports plus durable phase handoff
- current diff/target and governing source hashes
- docs, stack, tracker, and PR state when relevant

## Route

1. Stop on unclear goal bounds and ask one concrete question.
2. For durable `review_due`, load [review.md](review.md). It first validates
   accepted bounds and normalizes a supported target. A rejection enters
   `review_failed` even when a persisted counter is 3. Only after those checks
   may it recover `review_count` and evaluate the budget in memory. Exhaustion
   returns `review_budget_exhausted` with zero handoff or status writes. A count
   below 3 persists `review_due` and returns the exact explicit `$review-phase`
   invocation context. Then stop. Delivery never enters `review_running` itself.
3. For `report_retention_pending`, load [review.md](review.md) only to return the
   exact explicit `$review-phase` resume context, then stop. A fresh local report
   resumes without rerunning lenses. Stop on terminal `review_failed` with its
   exact evidence.
4. Otherwise recover review state by `review_lineage_id`: read the highest valid
   retained ordinal, reconcile the handoff `review_count` projection, then assess
   target and source freshness separately.
5. Route a fresh retained `review_routed` report through [review.md](review.md)
   when no durable route handoff exists yet.
6. Resume an atomic handoff already in `debug_active` through [debug.md](debug.md)
   or `repair_active` through [implement.md](implement.md). A recorded
   `review_run_id` cannot increment `repair_count` again.
7. Resume `debt_follow_up` through [review.md](review.md). Its handler reuses or
   records the goal/spec-linked debt artifact, then routes to docs ingest or
   closeout without implementing the debt.
8. Route `focused_validation` to its recorded implementation or debugging owner.
   Passing becomes `clean_handoff`; failure remains repair epoch 3.
9. Route `clean_handoff` to [docs-ingest.md](docs-ingest.md) when docs remain,
   otherwise [closeout.md](closeout.md).
10. If no matching agent-ready `SPEC.md` exists, it is stale, contradictory, or
   incomplete, or its remote retention or stable blob URL is missing or
   unverified, load [spec.md](spec.md).
11. If the verified post-spec backlog projection is missing or stale, load
   [backlog.md](backlog.md).
12. If no execution-ready matching plan exists, or it lacks dependencies, owned
   paths, validation gates, or wave boundaries, load [plan.md](plan.md).
13. If accepted plan work is incomplete, load [implement.md](implement.md).
14. If implementation exists and its retained review is missing or stale, load
    [review.md](review.md). That phase validates accepted bounds and normalizes a
    supported target before any delivery-budget evaluation, then returns either
    `review_failed`, `review_budget_exhausted`, or the exact explicit
    `$review-phase` invocation context and stops.
15. Route remaining docs-affecting work to [docs-ingest.md](docs-ingest.md),
    otherwise [closeout.md](closeout.md).

Only an explicitly new delivery goal with materially changed accepted bounds
creates a new lineage and resets review/repair counters. Same-goal bounds
revision, resume, rebase, commit, retry, and handoff preserve them.

## HITL And Resume

A HITL checkpoint is explicit user control. Run only the requested phase and
stop after its handoff. Earlier phases may have completed through direct skills;
reuse fresh matching artifacts rather than rerunning them.

## Output

Report the selected state and phase, the durable evidence that selected it, the
next file or child skill, and any exact blocker.
