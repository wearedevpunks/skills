# Execution Frontier

The parent owns Task Gates and scope transfer. Workers implement on the recorded
current branch and return the Task Result defined in
[parallel-worker-brief.md](parallel-worker-brief.md). Use native agent handles;
this contract introduces no scheduler, lock service, worker branch or worktree.

## 1. Resolve the graph

Read the accepted `PLAN.md`, requested subset and every required prerequisite.
Preserve task/provider identities and native blocker edges. For each task resolve
its outcome, acceptance references, checks, guidance, `owned_paths`,
`read_dependencies`, `shared_runtime_resources`, `relevant_input_set`, and
architecture fields. Missing or ambiguous authority blocks that task with the
exact missing input; it does not grant an empty read set or a passing gate.

`wave_boundary` records an earliest frontier for planning; it is not a barrier.
Keep the execution board's passed, active, eligible, queued, repair-required and
blocked states separate from shared-summary reconciliation and final acceptance.

## 2. Reserve and dispatch

An **Active Write Scope** is the exact reserved path set, owning task, native
worker handle and lifecycle state. Reserve before spawning; keep it exclusive
through execution, failure, interruption, gate review and cleanup. A finished
handle alone does not release ownership. Before release or transfer, the parent
proves the old writer has stopped, inspects its changes and cleanup, records the
retained output and exact new owner, then dispatches that owner. Every
implementation edit, including repair, stays delegated. Preserve unrelated
working-tree changes.

The **Execution Frontier** contains every unfinished task whose prerequisites
have passed their current Task Gates and whose scopes, declared reads, runtime
resources and required architecture responsibilities permit release. Recompute
after each gate result, input invalidation, capacity change or scope transfer:

1. Exclude tasks with failed, incomplete or invalidated prerequisites.
2. Exclude overlapping reserved writes, writes intersecting an active declared
   read, reads intersecting an active write, and incompatible shared-runtime
   use. Read/read overlap alone is safe. Name each actual conflict and owner;
   preserve provider blockers unchanged.
3. Require stable Relevant Input Set identities. An unknown identity or active
   mutation affecting it waits; unrelated disjoint work stays eligible.
4. For architecture-bearing work, apply
   [architecture-conformance.md](architecture-conformance.md) to the specific
   responsibilities it consumes. An unproved checkpoint responsibility blocks
   its consumers, not unrelated preparation.
5. Dispatch the complete eligible frontier within actual native capacity.
   Prefer assumption-invalidating work, then longest remaining dependency chain,
   then unlock count, then plan order. Record capacity and queued reason for
   each eligible task left waiting. Capacity one delegates one worker; capacity
   zero records a capacity blocker and performs no parent implementation.

Use the verified scoped specialist and worker brief. Record dispatch timestamp,
handle, scope, Relevant Input Set identities and required gates. A slow unrelated
worker never becomes an extra prerequisite.

## 3. Apply each Task Gate

As each Task Result arrives, inspect it immediately without waiting for other
workers. A missing, malformed or unsupported result is `blocked`, never success.
The parent records one Task Gate result: `passed`, `repair_required` or `blocked`,
with task identity, timestamp, relevant input identities and evidence pointers.

A passing Task Gate requires all applicable task-local proof:

- assigned scope complete and changed paths within its Active Write Scope;
- acceptance references satisfied by parent inspection of observable results;
- actual RED/GREEN target, or the accepted non-testable reason and exact proof;
- relevant typecheck and lint passed, with explicit applicability when absent;
- task validation, runtime proof and one verified application-evidence record
  per forwarded guidance entry;
- declared public seam, topology and task-local responsibility obligations met.

Verification joins this gate only when the task owns a complete visible journey
or runtime side effect consumed by a dependent; otherwise it remains a final
acceptance gate. Capture the Relevant Input Set before and after checks. Compare
again before dependent release and finalization. A changed source, declared read,
runtime resource or authority identity invalidates only affected evidence and
gates; schedule affected checks again before their consumers can proceed.

On `passed`, retain the parent gate evidence, release or transfer the scope by
step 2, and immediately recompute the frontier. On `repair_required` or
`blocked`, reserve the scope until safe transfer and keep dependents ineligible;
continue independent eligible work. Retry only with actionable evidence or
continue bounded discriminating diagnosis; route an authority boundary to the
owning delivery phase.

## 4. Reconcile and close

Parent-only reconciliation follows the worker brief's shared-record contract.
Task Gate success can release work before summary materialization, but reconcile
`PLAN.md` and `IMPLEMENTATION-NOTES.md` before cumulative Architecture Checkpoints,
final acceptance, handoff and closeout. Record touched files, deviations and exact
guidance evidence. A gate, reconciled summaries, final acceptance and Code Review
are separate facts.

At each due architecture boundary, run cumulative conformance and persist its
proof. Finish only with all accepted task checks, required runtime and Verification
proof, reconciled summaries, acceptance audit and architecture zero-drift closure
with an empty migration ledger. Otherwise retain exact task-local blockers and
scope custody so resume can reconstruct the frontier truthfully.
