# Human Steering Phase

## Guard

The next action requires access that no
[Autonomous Decision](../SKILL.md#afk) can grant: credentials, permissions or
an unreachable provider. Every other boundary, including changed requirements,
a weaker gate or a redesign, takes an out-of-bounds Autonomous Decision and
never reaches this phase.

## Bounded Action

1. Record the blocked action, supporting evidence, and exact decision needed in
   a durable state artifact.
2. Put its Context Pointer and exact blocker in the compact Delivery Handoff.
3. In `provider-task` mode, record the blocked fact with the decision needed on
   every linked Task through `write-backlog`'s
   [delivery-status branch](../../write-backlog/references/delivery-status.md#delivery-checkpoints),
   and read it back.
4. Return `human_steering_required` and stop. The decision record is the whole
   request to the human; ask nothing, per [AFK](../SKILL.md#afk).

## Completion Evidence

- durable decision record
- preserved accepted bounds and completed in-bounds artifacts
- expanded work awaits the required decision

## Exit

Emit the [common Phase Result](../references/context-continuity.md#common-phase-result)
with pointers to the decision record. In every mode, resume routing when current
user direction resolves the required decision.
