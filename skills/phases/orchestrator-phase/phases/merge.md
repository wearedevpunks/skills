# Merge

## Entry Guard

Enter only when the router selected this gate: a Track is `ready` at a
recorded commit, or an integration sync, rebase or release is due.

## Inputs

- the `ready` Track rows with their reported commits
- the Charter: review gate per repository, merge style, Integration branch,
  Human Gates
- the live PR state, checks and review results

## Actor-Like Gate Boundary

While the run is open, Merge is the only merger of Track PRs: Tracks never
merge. It may delegate check reading and sync preparation to a Worker or to
the owning Track and keeps every merge.

## Bounded Action

1. **Head check.** Merge only the exact commit the Track reported ready. A
   moved head waits for a new "ready".
2. **Review gate.** The repository's checks and its PR review mechanism, as
   the Charter names them, are clean on that commit.
3. **Gate.** A new functional PR without a recorded approval becomes a
   Needs-you item and waits. A fix, test, tooling, sync or repair PR merges
   now.
4. **Merge.** Squash, pinned to the reported commit. Mark the Track `landed`.
5. **Integration branch.**
   - Keep it current with the default branch by squash sync or rebase;
     record the synced range in the Ledger.
   - After a rebase, tell each Track with a branch on it to rebase onto the
     new head and report a new ready commit.
   - When a Track's PR grows past about 1.5 million changed lines, create the
     Integration branch, record it in the Charter, and move the open PRs onto
     it.
   - Release it as one PR to the default branch, squash-merged; a release
     carrying new functionality is a Human Gate.

## Invariants

- Merge style is squash; never a merge commit.
- Only the reported commit merges.

## Completion Evidence

- the merge commit per landed Track, or the Needs-you id that holds it
- the synced range or rebase head for each Integration branch change

## Declared Exits

- `complete` `merged`: the PR landed at the reported commit.
- `checkpoint` `gated`: a Needs-you item holds the merge.
- `no-op` `waiting_ready`: checks pending, review open, or head moved.
- `blocked` `merge_conflict`: the owning Track resolves the conflict and
  reports a new ready commit.

## Durable Handoff

Write the Track rows, Needs-you items and one Events line through
[the Track Ledger contract](../references/ledger.md).

## Stop Or Router Re-entry

Re-enter [the router](router.md).
