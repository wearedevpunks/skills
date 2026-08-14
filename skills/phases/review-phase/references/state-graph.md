# Review And Repair State Graph

Review owns normalization, frozen inspection, report retention, routing output,
and termination. Delivery owns debugging, implementation, debt, docs, closeout,
and clean handoff.

| State | Event | Guard | Owner | Next state | Counter effect | Required evidence |
| --- | --- | --- | --- | --- | --- | --- |
| Current delivery state | Review considered | Unsupported target | Delivery caller | Return `review_failed` | None; zero handoff or status writes | Exact target failure; no report |
| Current delivery state | Review considered | Invalid accepted bounds | Delivery caller | Return `review_failed` | None; zero handoff or status writes | Exact bounds failure; no report |
| `review_due` | Authorized review invocation | Delivery; accepted bounds and target valid; recovered `review_count < 3` | Delivery caller | `review_running` | Preallocate ordinal `review_count + 1`; no completed-pass change | Lineage, run id, ordinal, bounds identity/hash, normalized target |
| `review_due` | Explicit review invocation | Standalone; accepted bounds and target valid | Standalone caller | `review_running` | None | Lineage, run id, bounds identity/hash, normalized target |
| Current delivery state | Review considered | Delivery; in-memory accepted bounds and target valid; recovered `review_count >= 3` | Delivery caller | Return `review_budget_exhausted` | None; zero handoff or status writes | Exact current route, lineage, counters; no report or status mutation |
| `review_running` | All lenses and parent verification complete | One frozen snapshot; complete local report exists | `review-phase` | `report_retention_pending` | None; no completed-pass change | Complete report and fresh target/source hashes |
| `review_running` | Validation mutation detected | Frozen-target hash differs after validation | `review-phase` | `review_due` | None | Before/after hashes, command, mutation evidence; no report or pass |
| `review_running` | Retryable infrastructure failure or partial run | No immutable report | `review-phase` | `review_due` | None | Exact retryable evidence; unchanged counters |
| `review_running` | Non-retryable contract or infrastructure failure | No immutable report | `review-phase` | `review_failed` | None | Exact terminal evidence; no report; unchanged counters |
| `report_retention_pending` | Retention verified | Delivery; valid retained-pass predicate; ordinal at most 3; hashes fresh | Report writer | `review_routed` | Unique retained commit establishes authoritative ordinal; reconcile projection | Path, SHA-256, commit, retained ref, ordinal, run id |
| `report_retention_pending` | Retention rejected | Delivery; ordinal is greater than 3 | Report writer | `review_budget_exhausted` | None | Exact ordinal rejection/current route; no authoritative pass |
| `report_retention_pending` | Retention verified | Standalone; valid retained-pass predicate; hashes fresh | Report writer | `review_routed` | None | Path, SHA-256, commit, retained ref |
| `report_retention_pending` | Idempotent retention recovery | Same lineage/run has identical valid path, report blob SHA-256, and commit | Report writer | `review_routed` | Reuse existing pass; project its ordinal at most once | Existing unique authority and containment evidence |
| `report_retention_pending` | Same-run conflict | Same lineage/run has two valid candidates with different path, blob, or commit | Report writer | `review_failed` | None | `same_run_conflict`, both authorities; no pass or counter change |
| `report_retention_pending` | Retained-pass validation rejected | Active candidate is malformed or has wrong derived identity, hash, paths, containment, or ordinal | Report writer | `review_failed` | None | Exact failed predicate; no pass or counter change |
| `report_retention_pending` | Retryable retention failure | Hashes fresh | Report writer | `report_retention_pending` | None | Exact retryable evidence; no authoritative pass |
| `report_retention_pending` | Non-retryable retention failure | Retry cannot succeed | Report writer | `review_failed` | None | Exact terminal evidence; no authoritative pass |
| `report_retention_pending` | Freshness changed | Target or source hash changed | `review-phase` | `review_due` | None | Stale local report; unchanged counters |
| `review_routed` | Readonly return | Standalone | Standalone caller | `review_complete` | None | Retained report output and route |
| `review_routed` | Resume debug route | Handoff already records run id, debug route, and `debug_active` | `delivery-phase` | `debug_active` | None | Existing atomic handoff; no guard fallthrough |
| `review_routed` | Resume implementation route | Handoff already records run id, implementation route, and `repair_active` | `delivery-phase` | `repair_active` | None | Existing atomic handoff; no guard fallthrough |
| `review_routed` | Mixed or single finding route | Runtime evidence exists; run id unrecorded | `delivery-phase` | `debug_active` | Atomic handoff opens corresponding repair | Primary debug route, stable findings, atomic handoff, optional architecture follow-up |
| `review_routed` | Mixed or single finding route | No runtime evidence; in-scope non-runtime blocker exists; run id unrecorded | `delivery-phase` | `repair_active` | Atomic handoff opens corresponding repair | Primary implementation route, stable findings, atomic handoff, optional architecture follow-up |
| `review_routed` | Finding route | No higher blocker; broad architecture debt exists | `delivery-phase` | `debt_follow_up` | None | Debt route and stable findings |
| `review_routed` | No-blocker route | Required documentation remains | `delivery-phase` | `docs_ingest` | None | Report and docs route |
| `review_routed` | No-blocker route | Documentation complete | `delivery-phase` | `closeout` | None | Report and closeout route |
| `repair_active` or `debug_active` | Ordinary repair completes | `review_count < 3` | `delivery-phase` | `review_due` | None | Stale prior report, changed target identity, preserved counters |
| `repair_active` or `debug_active` | Fix 3 completes | `review_count = 3` and `repair_count = 3` | `delivery-phase` | `focused_validation` | None | Fix-3 changes and required focused validation |
| `focused_validation` | Focused validation fails | Repair epoch 3 remains open | `delivery-phase` | `repair_active` or `debug_active` | None; unchanged counters | Failed validation and recorded owning route |
| `focused_validation` | Focused validation passes | Repair epoch 3 complete | `delivery-phase` | `clean_handoff` | None | Passing validation, final changes, report-3 link, clean status |

## Durable Budget

Only a unique valid retained report commit is an authoritative pass record.
Identical rediscovery reuses it. A conflicting same-run candidate supplies no
authority. Recover `review_count` from unique valid retained ordinals for the
lineage, using the highest valid retained ordinal; the handoff counter is a projection reconciled after interrupted
updates.

Repair opening is one atomic durable handoff write containing active state,
primary route, `repair_count = review_count`, and idempotency `review_run_id`.
This enforces the corresponding numbered repair and rejects mismatched or
already-consumed ordinals. Complete the transition only after the write. An
already recorded run ID resumes its active state without another increment and
cannot fall through to an unrecorded guard.

Review 1 may open fix 1, review 2 fix 2, and review 3 fix 3. Fix 3 never opens
review 4. A failed focused validation stays in repair epoch 3 until that same
validation passes.

Same-goal bounds revisions preserve delivery lineage and counters. Resume,
rebase, new commit, process retry, and handoff preserve them. Only an explicitly
new delivery goal with materially changed accepted bounds creates a new lineage
and resets counters.

`review_budget_exhausted` is a terminal no-op for the route evaluation: exact
current route evidence, no handoff write, report, counter or status change, and no block on clean
continuation. `review_failed` is only a non-retryable invocation-level contract
or infrastructure failure and consumes no counter.

External GitHub and Codex PR reviewer integration is excluded.
