# Qualify the Workflow

## Selection Condition

Select when workflow bounds, mandatory obligations, or survivor artifacts are unresolved.

## Bounded Work

- Update the [Obligation Map](../references/authoring-contract.md#obligation-map).
- Record every mandatory obligation, owner, evidence artifact, and audit criterion.
- Identify intermediate artifacts that must survive interruption or later audit.
- Default every multi-step skill to a graph.
- Choose direct composition only for one atomic, discardable, cheap-to-restart action with no routing, repair, or resume obligation.

## Checkable Completion State

- Every mandatory obligation has an owner, evidence artifact, and audit criterion.
- Every survivor artifact is named.
- Graph authoring is selected for multi-step work, or the direct-composition decision proves the action is atomic, discardable, cheap to restart, and free of routing, repair, and resume obligations.

## Durable Phase Outcome

Update the `qualify` entry in `<target-skill>/AUTHORING-HANDOFF.md` with the obligation artifact, separate qualification checks, blockers, and the graph or direct-composition decision.

## Stop or Re-entry

For direct composition, stop without claiming a graph-based skill was authored. Otherwise stop or re-enter root.
