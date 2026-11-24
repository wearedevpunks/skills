# Human Steering Phase

## Guard

The next action requires access that no
[Autonomous Decision](../SKILL.md#afk) can grant: credentials, permissions or
an unreachable provider. Every other boundary, including changed requirements,
a weaker gate or a redesign, takes an out-of-bounds Autonomous Decision and
never reaches this phase.

## Bounded Action

1. Record the blocked action, supporting evidence, and exact access needed
   (credential, permission or provider) in a durable state artifact.
2. Put its Context Pointer and exact blocker in the compact Delivery Handoff.
3. In `provider-task` mode, record the blocked fact with the access needed on
   every linked Task through `write-backlog`'s
   [delivery-status branch](../../write-backlog/references/delivery-status.md#delivery-checkpoints),
   and read it back.
4. Return `human_steering_required` and stop. The access record is the whole
   request to the human; ask nothing, per [AFK](../SKILL.md#afk).

## Completion Evidence

- durable access record
- preserved accepted bounds, completed artifacts and the Autonomous Decisions
  list
- the blocked action waits only for the named access

## Exit

Emit the [common Phase Result](../references/context-continuity.md#common-phase-result)
with pointers to the access record. In every mode, resume routing when the
named access is present.
