# Review Runtime Handoff

This is the single runtime resume contract for review gates and router-owned
stateful outcomes. Retained reports remain finding and pass authority. Delivery
handoffs remain delivery-route and repair authority.

## Storage

Delivery mode reuses the caller-provided delivery handoff:

1. The explicit invocation context supplies `delivery_handoff_path`.
2. Resolve that path from the repository root. It must already be the durable
   delivery handoff for the same `delivery_goal_identity`; otherwise return
   `review_context_blocked` without writing.
3. Append review records under its `Review Phase Runtime Handoffs` section.
   Review never creates a second delivery handoff.

Standalone mode stores records at this deterministic repository-local path:

`<repo-root>/.devpunks/review-phase/handoffs/<review_lineage_id>/<review_run_id>.md`

Both path components are the canonical lowercase 64-character identities. A
standalone record cannot be written until both identities are derived. This
local workflow state is not a retained review report, pass record, or reviewed
target artifact. Keep it uncommitted, never push or retain it, and exclude it
from the report retention envelope and reviewed artifact bytes.

## Record Schema

Append one fenced `review-handoff-v1` record per stateful attempt. Use every
category and nested field exactly; write `null`, `[]`, or `none` rather than
omitting an inapplicable value.

```review-handoff-v1
Phase: prepare-review | run-review | retain-report | return-route | router
Status: complete | retryable | failed | blocked | checkpoint
Scope:
  mode: delivery | standalone
  review_lineage_id:
  target_locator:
  inclusive_scope_hash:
Artifacts:
  accepted_bounds_identity:
  accepted_bounds_hash:
  normalized_target_locator:
  frozen_target_evidence_locator:
  frozen_source_evidence_locator:
  snapshot_hash:
  source_set_hash:
  local_report_path:
  local_report_sha256:
  report_commit:
  retained_ref:
  stable_finding_ids: []
  primary_route:
  secondary_architecture_follow_up:
Validation:
  outcome:
  evidence_locator:
Review state:
Next suggested route:
Blockers:
Resume identity:
  review_run_id:
  review_ordinal:
  recovered_review_count:
  attempt:
```

`Review state` is exactly one of `review_due`, `review_running`,
`report_retention_pending`, `retained_ref_approval_required`,
`review_context_blocked`, `review_routed`, `review_complete`,
`human_steering_required`, or `review_failed`. `Next suggested route` is optional advice represented by
`none` when absent and is always lowest authority. `attempt` starts at 1 for a
run and increases by one for each new stateful record. Persist locators and
hashes, not reconstructible raw target, source, report, validation, or finding
bytes.

## Write And Reconciliation

Before writing, revalidate storage identity, mode, lineage, run identity, scope,
and the evidence supporting the declared exit. Append only after the gate owns
a complete record. A partial or malformed trailing fence is invalid and cannot
advance state.

Appending the same canonical record for the same attempt is an idempotent
no-op. Two different valid records for the same attempt are
`review_state_conflict`; preserve both authorities, write nothing, and return
their exact evidence. Markdown defines this protocol but cannot guarantee
exclusive writers or atomic persistence; use the repository's existing safe
writer when those guarantees matter.

## Cold-Resume Discovery

1. Resolve mode from current direct invocation evidence.
2. For delivery, open only the validated caller-provided
   `delivery_handoff_path`. For standalone, derive the exact deterministic path
   from current lineage and run identity.
3. Parse complete `review-handoff-v1` records. Reject records with another mode,
   lineage, run, target scope, or malformed schema.
4. Select the highest valid `attempt` for the applicable run. A missing attempt,
   a gap, or different records at one attempt is `review_state_conflict`.
5. Recompute current bounds, target, source, report, and retained-pass evidence.
   Direct current evidence outranks fresh workflow artifacts, which outrank the
   selected handoff; its suggested route remains last.
6. Project the route from the highest fresh valid evidence. A stale or
   contradictory handoff never advances the router and remains exact diagnostic
   evidence.

Delivery recovery may scan earlier records in the same caller handoff only to
match the active lineage and run. Standalone recovery reads no sibling lineage
or run file. Retained report discovery and delivery counter projection continue
to use the retained-pass contract, not handoff recency.

## Required Writes And No-Write Outcomes

Every gate exit and router-owned checkpoint writes a record when storage and run
identity are valid, including successful completion, retryable return, failure,
blocker, and retained-ref approval checkpoint.

The following already-authoritative outcomes write no new runtime record:

- `review_budget_exhausted`, which preserves the caller's valid delivery
  handoff and retained-count authority unchanged;
- `review_not_due`, whose caller-provided delivery handoff already proves a
  delivery-owned state;
- pre-run `review_failed` from an unsupported target, invalid bounds, or
  non-retryable identity failure, before a valid run and storage identity exist;
- pre-storage `review_context_blocked`, when safe storage, lineage, or run
  identity cannot be established; return exact direct evidence instead;
- `review_state_conflict`, because conflicting handoff authority cannot safely
  authorize another append;
- rediscovery of an identical already-recorded terminal, blocker, checkpoint,
  `review_routed`, or `review_complete` outcome.

These are idempotent no-write returns, not missing handoffs. Once storage and
run identity are valid, a new stateful failure or blocker uses the normal record
schema.
