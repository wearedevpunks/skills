# Plan Phase

Use this phase when no execution-ready `PLAN.md` exists, or the plan is stale,
vague, or missing validation gates.

## Delegate

Load `create-plan` only after this phase is selected.

## Checks Before Delegating

- Verify the planning input still matches the requested goal.
- Preserve tracker hierarchy and every child-story or sub-issue requirement.
- Require dependencies, owned paths, validation gates, review routing, and explicit wave boundaries.
- Group independent tasks with disjoint write scopes into the same wave.
- Put every currently unblocked task with a disjoint write scope in the same
  wave. Use a one-task wave only when dependencies or ownership leave one task
  unblocked.

## Completion State

Write or verify:

- execution-ready `PLAN.md`
- dependencies, owned paths, and wave boundaries
- validation commands or manual scenarios
- planned review and docs-ingest expectations

Then stop or re-enter `delivery-phase` for routing.
