# Plan Phase

Use this phase when a matching spec exists but no execution-ready `PLAN.md`
exists, or the plan is stale, vague, or missing validation gates.

## Delegate

Load `create-plan` only after this phase is selected.

## Checks Before Delegating

- Verify the spec still matches the requested goal.
- Preserve tracker hierarchy and every child-story or sub-issue requirement.
- Require owned paths, dependencies, execution order, validation gates, and review mode.
- Choose sequential or parallel implementation mode from the plan shape.

## Completion State

Write or verify:

- execution-ready `PLAN.md`
- phase/wave boundaries
- validation commands or manual scenarios
- mode choice: `parallel: true` or `parallel: false`
- planned review and docs-ingest expectations

Then stop or re-enter `delivery-phase` for routing.
