# Plan Phase

Use this phase when a matching spec exists but no execution-ready `PLAN.md`
exists, or the plan is stale, vague, or missing validation gates.

## Delegate

Load `create-plan` only after this phase is selected.

## Checks Before Delegating

- Verify the spec still matches the requested goal.
- Preserve tracker hierarchy and every child-story or sub-issue requirement.
- Require dependencies, Active Write Scopes, Read Dependencies, Shared Runtime
  Resources, Relevant Input Set identities, validation gates, review routing and
  explicit wave boundaries through `create-plan` and its `swarm-planner` primitive.
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

Emit the [common Phase Result](../references/context-continuity.md#common-phase-result)
with pointers to this completion evidence. Continue only in Full Delivery;
otherwise stop at the requested boundary.
