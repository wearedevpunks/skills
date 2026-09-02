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

1. For durable `human_steering_required`, stop until the `$handback` authority
   guard passes.
2. When current evidence triggers `$handback`, load [handback.md](handback.md).
3. Stop on unclear goal bounds and ask one concrete question.
4. For durable `review_due`, load [review.md](review.md). It first validates
   accepted bounds and normalizes a supported target. A rejection enters
   `review_failed` even when a persisted counter is 3. Only after those checks
   may it recover `review_count` and evaluate the budget in memory. Exhaustion
   returns `review_budget_exhausted` with zero handoff or status writes. A count
   below 3 persists `review_due`. Full delivery activates `$review-phase` with
   that context; other modes return the exact explicit invocation context and stop.
5. For `report_retention_pending`, load [review.md](review.md) to resume
   `$review-phase` in full delivery or return its exact resume context in other
   modes. A fresh local report resumes without rerunning lenses. Stop on terminal
   `review_failed` with its exact evidence.
6. Otherwise recover review state by `review_lineage_id`: read the highest valid
   retained ordinal, reconcile the handoff `review_count` projection, then assess
   target and source freshness separately.
7. Route a fresh retained `review_routed` report through [review.md](review.md)
   when no durable route handoff exists yet.
8. Resume an atomic handoff already in `debug_active` through [debug.md](debug.md)
   or `repair_active` through [implement.md](implement.md). A recorded
   `review_run_id` cannot increment `repair_count` again.
9. Resume `debt_follow_up` through [review.md](review.md). Its handler reuses or
   records the goal/spec-linked debt artifact, then follows durable
   `post_debt_route`: `debugging` or `implementation` for secondary debt;
   `docs_ingest` or `closeout` for primary debt. It never implements the debt.
10. Route `focused_validation` to its recorded implementation or debugging owner.
   Passing becomes `clean_handoff`; failure remains repair epoch 3.
11. Route `clean_handoff` to [docs-ingest.md](docs-ingest.md) when docs remain,
   otherwise [closeout.md](closeout.md).
12. For durable `docs_ingest`, load [docs-ingest.md](docs-ingest.md).
13. For durable `closeout`, load [closeout.md](closeout.md).
14. If no matching agent-ready `SPEC.md` exists for bounded requirements, or the
   specification is stale, contradictory, incomplete, or lacks verified remote
   retention, route them to Requirements Phase. Requirements Phase owns the
   Requirements Grill, Create Spec, and Write Backlog sequence.
15. If a verified specification lacks its current Write Backlog result, route
   the retained specification authority to Requirements Phase for
   delivery-depth projection and exact readback.
16. If no execution-ready matching plan exists, or it lacks dependencies, owned
   paths, validation gates, or wave boundaries, load [plan.md](plan.md).
17. If accepted plan work is incomplete, load [implement.md](implement.md).
18. If implementation exists and its retained review is missing or stale, load
    [review.md](review.md). That phase validates accepted bounds and normalizes a
    supported target before any delivery-budget evaluation, then returns either
    `review_failed`, `review_budget_exhausted`, or a valid `$review-phase`
    context. Full delivery consumes that context immediately; other modes
    return the exact explicit invocation context and stop.
19. Route remaining docs-affecting work to [docs-ingest.md](docs-ingest.md),
    otherwise [closeout.md](closeout.md).

Finder context is optional. Route direct bounded input to Requirements Phase
without creating a Finder artifact. When the caller supplies Finder context,
pass only its exact handle for Requirements Phase to resolve.

When a linked provider Task has a newly observed work start, blocker, pull
request, merge, staging deployment, or production deployment without exact
readback, route to [implement.md](implement.md) before any later phase.

Only an explicitly new delivery goal with materially changed accepted bounds
creates a new lineage and resets review/repair counters. Same-goal bounds
revision, resume, rebase, commit, retry, and handoff preserve them.

## HITL And Resume

A HITL checkpoint exists only when the user explicitly requests it. Full
delivery otherwise continues across ordinary in-bounds operations without
confirmation. Earlier phases may have completed through direct skills; reuse
fresh matching artifacts rather than rerunning them.

`human_steering_required` is a terminal boundary, not an optional HITL
checkpoint.

## Output

Report the selected state and phase, the durable evidence that selected it, the
next file or child skill, and any exact blocker.
