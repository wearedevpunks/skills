# Human Steering Gate

## Entry guard

Fog identity, immutable lens, child relevance, support relation, evidence,
scope, or projection ceiling is ambiguous or conflicting under current authority.

## Bounded action

Record the exact conflict, supporting evidence, and minimum human decision.
Return `human_steering_required` and stop before emitting a mutation intent.

## Completion evidence

Durable decision record and evidence that the conflict caused no further mutation.

## Declared exits

- `human_steering_required` -> terminal non-success state.
- `decision_resolved` -> router re-entry with the resolving user direction.

## Durable handoff

Link the decision record and retain the terminal state until current user
direction resolves the conflict.
