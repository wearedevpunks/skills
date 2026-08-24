# Define Durable Handoffs

## Selection Condition

Select when target gates exist and their workflow-owned handoff schema, durable storage, discovery rule, or exit coverage is missing or inconsistent.

## Bounded Work

- Update the [Gate Contract](../references/authoring-contract.md#gate-contract) and [Durable Handoff Questions](../references/authoring-contract.md#durable-handoff-questions).
- Define gate-scoped handoff vocabulary and schema for the target workflow.
- Preserve the canonical categories: phase, phase-scoped status, scope, artifacts, validation, workflow-specific domain state, optional UI evidence, next suggested route, and blockers.
- Use the workflow's own domain-state label; for example, a delivery workflow may use `Review/debug/docs state`.
- Name the durable storage location and the rule for discovering the latest applicable handoff.
- Preserve only state that current artifacts cannot safely reconstruct.
- Add run, revision, attempt, or dependency identity only when reliable resume requires it.
- Keep route suggestions optional, advisory, and lowest authority.
- Require every declared completion, blocker, skip or no-op, and human-checkpoint exit to write a durable handoff when applicable.
- Require the [human steering terminal](../references/authoring-contract.md#human-steering-terminal)
  to preserve the `$handback` outcome and authority guard.

## Checkable Completion State

- Every target gate exit writes a discoverable durable handoff.
- The schema keeps the canonical categories while allowing a workflow-specific domain-state label.
- Storage and discovery rules are explicit.
- Current evidence can override a stale or contradictory suggestion.

## Durable Phase Outcome

Update the `define-handoffs` entry in `<target-skill>/AUTHORING-HANDOFF.md` with the handoff contract artifact, separate exit-coverage checks, blockers, and unresolved irreducible state.

## Stop or Re-entry

Stop after writing the outcome, or re-enter root. Do not load another phase directly.
