# Retain Report

## Entry Guard

Enter only when the router selected this gate from a complete immutable local
report in `report_retention_pending`. Parse the report and prove its exact schema
before any repository write. Delivery reports must carry an ordinal from 1
through 3. A malformed report routes to `review_failed`; an ordinal above 3
returns the zero-write `review_budget_exhausted` terminal.

## Inputs

- exact local report path and bytes
- primitive accepted-bounds, normalized-target, and governing-source evidence
- review mode, lineage, run ID, and delivery ordinal when applicable
- expected report SHA-256 and allowed navigation/wiki-log envelope paths
- current retained candidates for the same lineage and run
- repository-approved retained refs, or the evidence needed for approval

Load [the report evidence contract](../references/durable-report.md) for the
schema, canonical validity predicates, and same-run identity rules. Use
[`review-contract.mjs`](../scripts/review-contract.mjs) to parse and validate
report bytes and derived identities.

## Actor-Like Gate Boundary

The retention gate owns candidate reconciliation, freshness checks, the one
designated report-writer assignment, post-write validation, and its durable
outcome. The designated writer may commit and push only the report,
navigation, and wiki-log envelope. The gate validates that work itself before
accepting an exit.

## Bounded Action

1. Parse the immutable local bytes. Recompute report path, report SHA-256,
   lineage, run ID, snapshot, source-set hash, and delivery ordinal relations
   from primitive evidence. Reject a delivery ordinal above 3 before any write.
2. Recompute accepted-bounds, normalized-target, and governing-source hashes.
   When any value changed, mark the local report stale and route to
   `review_due` without committing it.
3. Validate every retained candidate for the same `(review_lineage_id,
   review_run_id)` independently. Reuse one unique valid candidate, including
   repeated discovery of its identical path, blob SHA-256, and commit. Treat
   different valid candidates for the same run as `same_run_conflict`.
4. Resolve the retained ref. Delivery uses its current delivery branch or
   another repository-approved ref. Standalone uses
   `review/<review-scope-slug>-<snapshot12>` or another approved ref. When the
   required approval cannot be derived, emit the operator checkpoint before
   repository mutation.
5. When no reusable valid candidate exists, assign one writer to commit only
   the report and allowed envelope, then push or use the approved ref. Preserve
   the report bytes exactly.
6. Verify that the retained ref contains the exact report commit and that the
   commit changed only approved envelope paths. Run the complete retained-pass
   validator again against the retained blob and current primitive evidence.
7. Only a unique valid retained delivery report establishes its ordinal.
   Reconcile the delivery `review_count` projection from the highest unique
   valid retained ordinal. Standalone retention changes no delivery counter.

## Invariants

- The reviewed target remains readonly. Only the report, navigation, and
  wiki-log envelope may change.
- The local report becomes immutable when complete; retention preserves its
  exact bytes.
- A report is not a pass until schema, identity, freshness, approved paths,
  uniqueness, blob hash, and retained-ref containment all validate.
- Identical rediscovery reuses one pass and projects its ordinal at most once.
- Retryable retention reuses the same fresh local report and never reruns
  review lenses.
- Stale, malformed, conflicting, or non-retained evidence changes no pass or
  counter.
- Delivery ordinals stop at 3. Retention never creates review 4 or opens a
  repair.

## Completion Evidence

- local report path and SHA-256
- report schema and canonical-identity validation result
- target, bounds, and source freshness recomputation
- same-run candidate inventory and uniqueness decision
- report commit SHA and its exact changed-path set
- approved retained ref and proof that it contains the report commit
- delivery ordinal and reconciled counter projection, or standalone mode

## Declared Exits

- `review_routed`: one unique fresh retained pass is verified.
- `report_retention_pending`: retention failed retryably; the fresh local report
  remains reusable and no pass exists.
- `retained_ref_approval_required`: an operator must approve the retained ref;
  no repository mutation or pass exists.
- `review_due`: target, bounds, or source freshness changed before retention;
  the local report is stale.
- `review_failed`: schema or identity validation failed, a malformed active
  candidate or `same_run_conflict` exists, or retention failed non-retryably.
- `review_budget_exhausted`: a delivery ordinal above 3 was rejected before any
  write, pass, counter, or status mutation.

## Durable Handoff

Load [the runtime handoff contract](../references/runtime-handoff.md). Persist
every stateful success, retry, failure, or retained-ref approval checkpoint with
its exact schema before stop or router re-entry.

`review_budget_exhausted` remains the zero-write no-op because the valid caller
handoff and retained-count authority already prove exhaustion.

## Stop Or Router Re-entry

Stop on terminal, blocked, or checkpoint output. After a stateful outcome is
durable, stop or re-enter [`router.md`](router.md). Never load a sibling gate
directly, rerun lenses, mutate a delivery route, or enter repair.
