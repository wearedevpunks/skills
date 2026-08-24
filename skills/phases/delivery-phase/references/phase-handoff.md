# Phase Handoff

Each phase leaves enough durable state for resume without guessing.

## Base Shape

```text
Phase:
Status: complete | blocked | skipped | human_steering_required
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
state: review_due | review_running | report_retention_pending | review_routed | debt_follow_up | debug_active | repair_active | focused_validation | docs_ingest | closeout | clean_handoff | human_steering_required
primary_route:
secondary_architecture_follow_up:
post_debt_route:
review_count:
repair_count:
authoritative_report_path:
authoritative_report_commit:
verified_retained_ref:
stable_finding_ids:
debt_follow_up_artifact:
debt_follow_up_keys:
captured_debt_finding_ids:
```

`review_count` is a projection of the highest valid retained report ordinal for
the lineage. Reconcile it on resume. An opening repair transition atomically
writes active state, primary route, `repair_count = review_count`, and
idempotency `review_run_id`; complete the transition only after the write. A
recorded run id resumes its state without increment or guard fallthrough.

Each debt follow-up key is the tuple of authoritative report commit,
authoritative report path, and stable finding ID. The debt artifact links the
delivery goal and accepted Spec, records those keys, and lives outside the
immutable report. Replaying a recorded key reuses the existing entry. It never
opens implementation work for unaccepted debt.

`post_debt_route` is durable before debt capture starts. It is `debugging` or
`implementation` for secondary debt, and `docs_ingest` or `closeout` for
primary debt after capture. Resume follows this field after every debt key is
present. For primary debt, the successful capture transition atomically records
every debt key and sets state = `post_debt_route`. Resume continues from the
recorded `docs_ingest` or `closeout` state without repeating capture.

## Review Invocation Context

Delivery persists this block for `review_due`:

```text
review_invocation_authority: full_delivery | explicit_operator
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

The `review_due` handoff leaves `review_run_id` unset. Full delivery consumes the
context immediately; other modes return it for explicit operator invocation.
Consumption preallocates the next ordinal, fixes the run id, and enters
`review_running`.

For `report_retention_pending`, the explicit resume context additionally carries
the existing `review_run_id`, ordinal, local report path and SHA-256, target hash,
source hashes, and intended retained ref. Full delivery resumes `$review-phase`;
other modes return the context for explicit retry without rerunning lenses.

After fix 3, `clean_handoff` is final authority. Link immutable review 3, final
changes, the same passing focused validation, and clean status.

For `human_steering_required`, store the complete `$handback` outcome under
`Blockers`. Keep the state terminal until the `$handback` authority guard
passes.
