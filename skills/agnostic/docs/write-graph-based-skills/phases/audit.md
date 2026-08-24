# Audit the Graph-Based Skill

## Selection Condition

Select when every earlier authoring phase has fresh completion evidence and terminal readiness remains unverified.

## Bounded Work

- Apply the [Final Audit](../references/authoring-contract.md#final-audit).
- Verify every mandatory obligation is reachable and required by the terminal guard.
- Prove cold resume derives one route from current evidence and discoverable handoffs.
- Recheck overlapping guards, authority, and deterministic precedence.
- Keep each transition meaning in one source of truth.
- Verify every operational reference is reachable and every target router-selected phase exists.
- Verify the [human steering terminal](../references/authoring-contract.md#human-steering-terminal)
  is reachable, durable, authority-gated, and distinct from planned human checkpoints.
- Run the no-op test: delete instructions whose removal does not change behavior relative to the model default.
- Run the available skill validator and record its result.

## Checkable Completion State

- Obligations, terminal accounting, cold resume, routes, pointers, and durable handoffs pass.
- Transition meanings have one source of truth.
- The no-op test leaves only instructions that change behavior relative to the model default.
- The available validator passes.

## Durable Phase Outcome

Update the `audit` entry in `<target-skill>/AUTHORING-HANDOFF.md` with audited artifacts, separate validation results, blockers, and the terminal decision.

## Stop or Re-entry

Return the audit-complete terminal only when every check passes. On any failure, write the outcome and re-enter root so the earliest broken phase is selected.
