# Debug Phase

Use this phase only when validation or review produced runtime evidence of a
bug inside the active delivery scope.

## Delegate

Load `debugging-phase` only after this phase is selected.

## Rules

- Do not use debugging as a normal delivery-start dependency.
- Start from concrete runtime evidence: failing command, log, browser state,
  trace, reproduction, or review finding.
- Readonly parallel hypothesis research is allowed.
- Speculative parallel fixes are not allowed.
- When the next action exceeds accepted bounds, return the required decision
  to the router before opening another goal.
- Preserve review lineage, `review_count`, `repair_count`, and the opening
  `review_run_id` through the repair.

## Accepted Repair Continuity

Follow [review.md](review.md) for Focused Repair Validation, affected Verification
reruns and risk-triggered second-pass eligibility. Preserve lineage, retained
ordinals and consumed repair run IDs. On failure, use
[bounded diagnosis and scope custody](../references/failure-continuity.md).

## Completion State

Write or verify:

- runtime evidence
- root cause or narrowed hypothesis
- fix or explicit blocker
- rerun validation
- resulting state and preserved counter evidence

Then stop or re-enter `delivery-phase` for routing.

Emit the [common Phase Result](../references/context-continuity.md#common-phase-result)
with pointers to this completion evidence. Continue only in Full Delivery;
otherwise stop at the requested boundary.
