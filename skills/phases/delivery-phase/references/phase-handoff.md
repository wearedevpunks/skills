# Phase Handoff

Each phase leaves enough durable state for resume without guessing.

## Phase exit and Delivery Handoff

Every phase emits the [common Phase Result](context-continuity.md#common-phase-result).
Keep its phase-specific evidence in the owning durable artifact. A cross-task
Delivery Handoff contains only:

```text
delivery_goal_identity:
accepted_bounds_identity:
git_identity: branch, base, target
phase:
next_action:
context_pointers: typed stable pointers with identity and freshness rule
provider_identities: relevant identities or explicit none
blocker: exact blocker or explicit none
unknowns: explicit unknowns or none
boundary_rationale: at most one sentence plus rationale pointer, when unusual
```

Validate this envelope before handing off. Resolve fields from durable authority;
missing required proof remains explicit and blocks the dependent action. Exclude
full bodies, logs, unbounded narrative and the disposable Delivery Context Packet.
The receiving task always cold-routes under
[context continuity](context-continuity.md), checking current authority and prior
mutation receipts. Detailed review/repair state below lives in a pointed durable
state artifact, not embedded into the Delivery Handoff. This is distinct from a
scaffold CLI Post-Command Handoff, whose owning CLI contract remains unchanged.

## Review And Repair Projection

For a delivery goal with review activity, also persist:

```text
delivery_goal_identity:
accepted_bounds_identity:
accepted_bounds_hash:
goal_dir: .devpunks/delivery/<goal>
pass_report: .devpunks/delivery/<goal>/reviews/pass-<n>.json
review_run_id:
state: review_due | review_running | review_routed | debt_follow_up | debug_active | repair_active | focused_validation | docs_ingest | closeout | clean_handoff | human_steering_required
primary_route:
secondary_debt:
post_debt_route:
stable_finding_ids:
debt_follow_up_artifact:
debt_follow_up_keys:
captured_debt_finding_ids:
```

`pass_report`, `review_run_id`, `primary_route` and `secondary_debt` hold the
`pass_report`, `review_run_id`, `route.primary` and `route.secondary_debt` that
`$review-phase` returns. The completed pass count is `pass_count` from
`scripts/review.mjs status --goal <goal_dir>` in the
[review-phase](../../review-phase/SKILL.md) skill: the number of valid Pass
Reports in `<goal_dir>/reviews/`. Read it there on every resume. An opening repair transition is the one write the
[routing reference](../../review-phase/references/routing.md) names; a recorded
`review_run_id` resumes its state without opening a second repair.

Each debt follow-up key is the pair of `pass_report` path and stable finding ID.
The debt artifact links the delivery goal and accepted Spec, records those keys,
and lives outside the Pass Report. Replaying a recorded key reuses the existing
entry. It never opens implementation work for unaccepted debt.

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
delivery_goal_identity:
accepted_bounds_identity:
accepted_bounds_hash:
goal_dir: .devpunks/delivery/<goal>
base: delivery base commit SHA
spec: spec folder or none
accepted_risk: <kind>:<evidence> or none
human_direction: evidence or none
current_route:
```

`goal_dir`, `base`, `spec`, `accepted_risk` and `human_direction` are the
`review.mjs prepare` options `--goal`, `--base`, `--spec`, `--accepted-risk` and
`--human-direction`; `none` omits the option. The `review_due` handoff leaves
`review_run_id` unset. Full delivery consumes the context immediately; other
modes return it for explicit operator invocation. Consumption enters
`review_running`; only the Pass Report that `retain` commits advances the count.
A `review_running` resume re-enters `$review-phase`, whose `status` names the
next step from its run directory.

After accepted repair, retain Focused Repair Validation and affected Verification
evidence under the transition rules in [review.md](../phases/review.md). A clean
handoff links the Pass Report, final changes and passing required checks.

For `human_steering_required`, store the blocked action, evidence, and required
decision in the pointed durable state artifact. Keep only its pointer and exact
blocker in the Delivery Handoff. The state remains terminal until current user
direction resolves the required decision.
