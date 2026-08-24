# Write the Target Router

## Selection Condition

Select when bounds, state, and authority are complete while the target root bootstrap or target `phases/router.md` is missing, stale, or invalid.

## Bounded Work

- Update the [Router Contract](../references/authoring-contract.md#router-contract).
- Write or repair the target `SKILL.md` as bootstrap and invocation guidance.
- Write or repair the target `phases/router.md` so it derives the next route from current evidence, active obligations, current artifacts, and committed handoffs.
- Make cold resume independent of transcript continuity.
- Return exactly one selected gate, terminal, checkpoint, or blocked outcome for every legal state.
- Preserve the [human steering terminal](../references/authoring-contract.md#human-steering-terminal)
  until the `$handback` authority guard passes.
- Preserve the target's intentional invocation policy.

## Checkable Completion State

- The target root contains no executable gate body.
- The target router resolves every legal state and conflict to exactly one output.
- Every selected gate filename is a flat path under target `phases/`.

## Durable Phase Outcome

Update the `write-router` entry in `<target-skill>/AUTHORING-HANDOFF.md` with the root and router artifacts, separate route checks, blockers, and unresolved legal states.

## Stop or Re-entry

Stop after writing the outcome, or re-enter root. Do not load another phase directly.
