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
- If the bug is broader than delivery scope, capture debt or open a separate
  debugging goal.

## Completion State

Write or verify:

- runtime evidence
- root cause or narrowed hypothesis
- fix or explicit blocker
- rerun validation
- whether another review is required

Then stop or re-enter `delivery-phase` for routing.
