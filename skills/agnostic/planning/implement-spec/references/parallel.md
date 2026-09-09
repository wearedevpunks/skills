# Scoped Execution

Every implementation edit belongs to a scoped worker on the recorded branch.
The parent parses the accepted graph, reserves scopes, dispatches, reviews Task
Results, applies Task Gates and reconciles shared artifacts.

Read [parallel-orchestration.md](parallel-orchestration.md) to compute the complete
Execution Frontier after each result. Read
[parallel-worker-brief.md](parallel-worker-brief.md) when preparing a worker's
context or consuming its Task Result. Architecture-bearing plans also use
[architecture-conformance.md](architecture-conformance.md) for cumulative proof.

Retain task identity, scope custody, dispatch and gate timestamps/native handles,
stable relevant inputs, acceptance/check evidence, unchanged guidance with one
application record per entry, and exact queued or blocked reasons. Wave labels
organize planned work; independent eligible work progresses after its own gates.
Task Gate success, shared-record reconciliation, final acceptance and Code Review
remain distinct. Continue until all accepted work is proved or the exact remaining
blocker requires external change.
