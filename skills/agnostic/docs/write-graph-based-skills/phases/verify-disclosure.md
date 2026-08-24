# Verify Progressive Disclosure

## Selection Condition

Select when target root, router, gates, and handoffs exist while context loading, pointer reachability, sibling isolation, or reference placement is unverified or invalid.

## Bounded Work

- Trace one target invocation from bootstrap to router to one selected gate.
- Verify the loaded context contains bootstrap, router, and exactly one selected gate.
- Resolve every operational pointer from target root, router, and selected phases.
- Keep sibling gate files outside the trace.
- Keep references shared, or split them only when a genuine conditional branch saves unrelated context.
- Move any executable gate body found in a reference into its flat target phase file.

## Checkable Completion State

- The context trace contains target bootstrap, router, and exactly one selected gate.
- Every operational reference is reachable from root, router, or the selected phase.
- Every pointer resolves, sibling gates remain unloaded, and references contain no executable gate body.

## Durable Phase Outcome

Update the `verify-disclosure` entry in `<target-skill>/AUTHORING-HANDOFF.md` with the context trace, separate pointer and isolation checks, blockers, and unreachable material.

## Stop or Re-entry

Stop after writing the outcome, or re-enter root. Do not load another phase directly.
