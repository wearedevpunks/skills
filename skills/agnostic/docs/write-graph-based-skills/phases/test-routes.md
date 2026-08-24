# Test Target Routes

## Selection Condition

Select when disclosure passes and route predictions, derivations, or mismatch repairs are incomplete or stale.

## Bounded Work

- Update the [Route Matrix](../references/authoring-contract.md#route-matrix-ten-scenarios).
- Record each predicted route before applying the target contracts.
- Derive each route from current evidence, authority, guards, and precedence.
- Cover all ten scenarios: baseline path, branch path, repair cycle, planned
  human checkpoint, failure handback terminal, cold resume, stale or
  out-of-scope or invalid artifact, contradictory suggested route losing to
  evidence, narrower executor substitution with a stable actor-like gate
  boundary, and premature completion rejected by the terminal guard.
- Keep the planned checkpoint distinct from the
  [human steering terminal](../references/authoring-contract.md#human-steering-terminal).
- Repair only mismatches, then repeat prediction and derivation for the repaired case.

## Checkable Completion State

- All ten scenarios contain prediction, derived route, and match result.
- Stale, out-of-scope, and invalid artifacts each appear as a subcase.
- Mismatches contain repair evidence; matches contain no speculative repair.

## Durable Phase Outcome

Update the `test-routes` entry in `<target-skill>/AUTHORING-HANDOFF.md` with the route matrix artifact, separate scenario results, blockers, mismatches, and completed repairs.

## Stop or Re-entry

Stop after writing the outcome, or re-enter root. Do not load another phase directly.
