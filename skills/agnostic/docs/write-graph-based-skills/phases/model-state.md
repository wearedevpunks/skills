# Model Evidence State

## Selection Condition

Select when obligations are qualified and the evidence-defined state model, topology, guards, or obligation reachability is missing, stale, or contradictory.

## Bounded Work

- Update [State and Topology](../references/authoring-contract.md#state-and-topology).
- Define states from durable evidence instead of conversational progress.
- Map every mandatory obligation to reachable states and transitions.
- Define applicable paths, branches, cycles, skips, and checkpoints. Mark other topology forms N/A.
- Add freshness, scope, and validity guards where evidence can change or conflict.
- Model the [human steering terminal](../references/authoring-contract.md#human-steering-terminal)
  and make it reachable from every applicable gate.

## Checkable Completion State

- Every state has scope, entry guard, exit guard, and reachable next states.
- Every mandatory obligation is reachable and evidence-backed.
- Each topology form is represented or marked N/A.
- `human_steering_required` is terminal until the `$handback` authority guard passes.

## Durable Phase Outcome

Update the `model-state` entry in `<target-skill>/AUTHORING-HANDOFF.md` with the state artifacts, separate reachability and topology checks, blockers, and unresolved obligations.

## Stop or Re-entry

Stop after writing the outcome, or re-enter root. Do not load another phase directly.
