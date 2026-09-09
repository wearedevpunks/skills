# Failure and Repair Continuity

Use when a Task fails, a Task Gate requests repair, diagnosis advances, or work
crosses accepted bounds. The parent consumes the authoritative
[Task Result](../../../agnostic/planning/implement-spec/references/parallel-worker-brief.md)
and [Task Gate / Execution Frontier](../../../agnostic/planning/implement-spec/references/parallel-orchestration.md)
contracts; these remain the sole owners of worker returns and gate outcomes.

1. Retain the failed Task identity, latest result/gate evidence and dependent
   chain. Block only that chain; recompute independent eligibility through the
   execution owner. Preserve failed or repair-required Active Write Scope until
   the parent proves the old worker stopped and cleanup completed, or transfers
   it to exactly one scoped repair worker. An unproven transfer blocks reuse.
2. Before another scoped repair, identify new actionable evidence from the latest
   Task Result or Task Gate and the exact change it justifies. Bounded authorized
   diagnosis may continue while it can distinguish named hypotheses and produce
   Diagnostic Evidence. Record the observation and discriminating result before
   retrying; repeating the same repair is not new evidence.
3. Stagnant repair, required scope redesign, weaker gates, changed requirements,
   missing access or a human decision routes to [handback](../phases/handback.md).
   Keep accepted bounds and scope custody intact while steering is required.
4. Retain the resulting phase-specific state behind a pointer and emit the common
   [Phase Result](context-continuity.md#common-phase-result). Resume checks current
   authority and mutation proof before doing any remaining work.

Completion: dependent blocking, independent progress, scope custody, new evidence
or exact human boundary and next action are recoverable from durable pointers.
