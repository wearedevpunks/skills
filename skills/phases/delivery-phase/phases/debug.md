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
- When current evidence triggers `$handback`, return it to the router without
  opening another goal.
- Preserve review lineage, `review_count`, `repair_count`, and the opening
  `review_run_id` through the repair.
- After an ordinary fix with `review_count < 3`, stale the preceding report and
  enter `review_due`.
- After debug fix 3 (`review_count = 3`, `repair_count = 3`), enter
  `focused_validation`. Failure resumes `debug_active` in epoch 3 without a
  counter change; passing records `clean_handoff`. Fix 3 never opens review 4.

## Completion State

Write or verify:

- runtime evidence
- root cause or narrowed hypothesis
- fix or explicit blocker
- rerun validation
- resulting state and preserved counter evidence

Then stop or re-enter `delivery-phase` for routing.
