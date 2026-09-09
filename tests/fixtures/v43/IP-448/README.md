# IP-448 native frontier fixture

Run scoped native Codex workers in a unique temporary Git repository. Freeze the
candidate orchestration, architecture and worker-brief bytes with SHA-256 identities.
Retain prompts, raw JSONL events, process handles and parent gate records outside
that repository before cleanup.

1. Start independent fast and slow workers with disjoint `run/` outputs. The slow
   worker records readiness and blocks on a parent-owned FIFO, not a timed delay.
2. Inspect the fast Task Result and exact output bytes, record its parent Task Gate
   and scope release, then dispatch its child while the slow handle remains live.
   The child must assert slow output is absent before writing its own result.
3. Retain the child result before releasing the slow FIFO. Prove the slow process
   exits and verify its output. Failure to produce the child before release falsifies
   independent progress. Child writes outside its scope falsify isolation.
4. Run the architecture-bearing variant: the fast child consumes only its proved
   local seam; a separate consumer of the slow task's unproved RAC remains blocked.
   Final checkpoint refusal must name unreconciled summaries, unproved cumulative
   RAC, expired migration seam and observed dependency drift.
5. Exercise native parent interpretation of zero/one capacity, failed prerequisite,
   missing Task Result, read/write and runtime conflicts, changed-input invalidation,
   and live-writer versus stopped-writer scope transfer. Label these decision traces
   separately from actual concurrent worker execution; they prove no runtime service.
6. After worker-brief or lifecycle input changes, refresh immutable copies and rerun
   affected compatibility proof. Preserve previous trace identities and invalidation.
7. Retain output bytes and cleanup proof, then remove only this run's repository and
   handles. Supplemental source-contract tests do not replace these native traces.
