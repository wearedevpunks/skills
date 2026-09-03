---
name: brainstorm
description: Brainstorm a bounded system from the operating agent’s perspective. Use when asked to brainstorm a system or another skill invokes `$brainstorm`.
---

# Brainstorm

1. Bound the system, its operator, accepted constraints, and available
   evidence. Mark every unsupported premise as unknown.
2. Operate the system from the agent's seat. Trace intake, state, control,
   feedback, recovery, and handoff. Account for each applicable surface or
   record why it does not apply.
3. Derive the smallest changes that make the system agent-intuitive,
   agent-ergonomic, and agent-accretive. For each candidate, state its evidence,
   consequence, and unresolved tradeoff.
4. Return the evidence-grounded observations and unresolved decisions. Completion
   requires every observation to trace to evidence or an explicit unknown. They
   remain candidates until the caller accepts them.
