# Review Router

Load this file on every explicit invocation and re-entry. Recompute one route
from current evidence; transcript continuity and a recorded route suggestion
are never required.

Load [the runtime handoff contract](../references/runtime-handoff.md). Discover
the latest applicable record by its mode-specific rule before applying route
precedence. Persist router-owned stateful checkpoints and blockers through that
contract; use its declared no-write outcomes only when existing authority is
already sufficient.

Load [the state evidence model](../references/state-graph.md) only when
reconstructing delivery-budget authority, checking the review/delivery
ownership boundary, or resolving contradictory state evidence.

## Inputs And Authority

Inspect:

1. direct accepted-bounds, target, validation, failure, and caller evidence;
2. fresh valid normalized targets, frozen snapshots, local reports, and retained
   report candidates;
3. committed review and delivery handoffs;
4. any suggested route.

Apply that authority order. Evidence is eligible only when its scope matches the
current review lineage and its required hashes, schema, and retained-ref
containment remain valid. Recompute derived identities and freshness instead of
trusting labels or counters. A lower-authority state label cannot override
newer admissible evidence.

When eligible evidence conflicts, prefer the higher authority. At the same
authority, prefer the most advanced state whose complete predecessor evidence
is valid. A same-run retained-report conflict is `review_failed`; any other
same-authority conflict without a contract tie-break is
`review_state_conflict`.

## Route Precedence

Evaluate top to bottom and return the first matching row. Return only its one
output.

| Priority | Current evidence | Output |
| --- | --- | --- |
| 1 | Durable `human_steering_required` while the `$handback` authority guard fails | terminal `human_steering_required` |
| 2 | Unsupported target, invalid accepted bounds, non-retryable contract or infrastructure failure, malformed active retention candidate, or `same_run_conflict` | terminal `review_failed` |
| 3 | Delivery entry is otherwise valid, recovered `review_count >= 3`, and no already-started run has valid predecessor evidence | terminal `review_budget_exhausted` |
| 4 | A repository-approved retained ref is required but cannot be derived and requires an operator decision | checkpoint `retained_ref_approval_required` |
| 5 | Same-authority admissible evidence conflicts and no declared tie-break resolves it | blocked `review_state_conflict` |
| 6 | Required explicit invocation context, accepted bounds, target evidence, or reconstructible lineage inputs are missing | blocked `review_context_blocked` |
| 7 | The caller is in delivery-owned `debug_active`, `repair_active`, `debt_follow_up`, `docs_ingest`, `closeout`, `focused_validation`, or `clean_handoff` without fresh `review_due` evidence | blocked `review_not_due` |
| 8 | A valid retained standalone report and durable returned routing output exist | terminal `review_complete` |
| 9 | A valid retained delivery report and durable returned routing output exist | terminal `review_routed` |
| 10 | Retention is verified and fresh, but its returned routing output is absent | [`return-route.md`](return-route.md) |
| 11 | A complete fresh local report exists without unique verified retention, including a retryable retention failure | [`retain-report.md`](retain-report.md) |
| 12 | Fresh `review_running` predecessor evidence exists without a complete local report | [`run-review.md`](run-review.md) |
| 13 | Fresh `review_due` evidence exists, or mutation, partial-run, retryable failure, or stale target/source evidence invalidated later work | [`prepare-review.md`](prepare-review.md) |

## State Coverage

- `review_due` selects `prepare-review.md` after the entry context passes the
  higher-priority guards.
- `review_running` selects `run-review.md` unless newer valid evidence proves a
  later state or direct failure evidence selects a terminal.
- `report_retention_pending` selects `retain-report.md`; fresh verified
  retention advances to `return-route.md`.
- `review_routed` selects `return-route.md` until durable return evidence exists,
  then terminates as `review_complete` for standalone or `review_routed` for
  delivery.
- `human_steering_required`, `review_failed`, and `review_budget_exhausted` are
  terminal router outcomes.
- Review-owned mutation or retryable partial-run evidence projects back to
  `review_due`; retryable fresh retention evidence remains
  `report_retention_pending`.
- Delivery-owned post-review states are outside this skill and resolve to
  `review_not_due` unless a fresh explicit `review_due` handoff exists.

Every gate output above resolves to one flat phase file. Load only that selected
file; sibling gates stay outside the current trace.
