# Phase Handoff

Each phase leaves enough durable state for resume without guessing.

## Base Shape

```text
Phase:
Status: complete | blocked | skipped
Scope:
Artifacts:
Validation:
Review/debug/docs state:
UI Evidence:
Next suggested route:
Blockers:
```

State only what ran. Prefer durable artifact paths/links. Carry approved
artifacts and UI evidence. Give every skip an exact no-op reason. Honor explicit
HITL stops.

## Review And Repair Projection

For a delivery goal with review activity, also persist:

```text
delivery_goal_identity:
accepted_bounds_identity:
accepted_bounds_hash:
review_lineage_id:
review_run_id:
state: review_due | review_running | report_retention_pending | review_routed | debug_active | repair_active | focused_validation | clean_handoff
primary_route:
review_count:
repair_count:
authoritative_report_path:
authoritative_report_commit:
verified_retained_ref:
stable_finding_ids:
```

`review_count` is a projection of the highest valid retained report ordinal for
the lineage. Reconcile it on resume. An opening repair transition atomically
writes active state, primary route, `repair_count = review_count`, and
idempotency `review_run_id`; complete the transition only after the write. A
recorded run id resumes its state without increment or guard fallthrough.

## Explicit Review Invocation Context

Delivery persists this block for `review_due` and returns it unchanged before
stopping:

```text
explicit_operator_invocation_required: true
review_invocation_skill: $review-phase
review_invocation_mode: delivery
delivery_goal_identity:
accepted_bounds_identity:
accepted_bounds_hash:
review_lineage_id:
recovered_review_count:
current_route:
normalized_target:
```

The `review_due` handoff leaves `review_run_id` unset. Only the explicit operator
invocation consumes this context, preallocates the next ordinal, fixes the run
id, and enters `review_running`.

For `report_retention_pending`, the explicit resume context additionally carries
the existing `review_run_id`, ordinal, local report path and SHA-256, target hash,
source hashes, and intended retained ref. Delivery returns it and stops; the
operator invokes `$review-phase` to retry retention without rerunning lenses.

After fix 3, `clean_handoff` is final authority. Link immutable review 3, final
changes, the same passing focused validation, and clean status.
