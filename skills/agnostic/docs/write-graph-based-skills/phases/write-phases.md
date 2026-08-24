# Write Every Target Gate

## Selection Condition

Select when the target router exists and one or more executable target gates are missing, stale, embedded in root or references, or inconsistent with router selection.

## Bounded Work

- Update the [Gate Contract](../references/authoring-contract.md#gate-contract).
- Create a flat target `phases/` directory.
- Create one `phases/<gate>.md` for every executable gate or step selected by the target router.
- Give every gate file these contracts: guard, inputs, bounded action or delegation, invariants, completion evidence, declared exits, durable handoff, and stop or router re-entry.
- When a gate uses a narrower executor, keep reconciliation, validation, and the durable handoff owned by the actor-like gate boundary.
- Move executable gate bodies out of target root and references.
- Apply the [human steering terminal](../references/authoring-contract.md#human-steering-terminal)
  from each applicable gate.

## Checkable Completion State

- Every router-selected gate filename exists.
- Every executable gate has exactly one flat phase file.
- Every gate defines the normalized contract and emits only declared exits.
- Target root and references contain no executable gate body.
- Every applicable gate invokes `$handback` and emits only the terminal's
  durable outcome when its guard selects human steering.

## Durable Phase Outcome

Update the `write-phases` entry in `<target-skill>/AUTHORING-HANDOFF.md` with the gate-file artifacts, separate filename and contract checks, blockers, and any missing router-selected gate.

## Stop or Re-entry

Stop after writing the outcome, or re-enter root. Do not load another phase directly.
