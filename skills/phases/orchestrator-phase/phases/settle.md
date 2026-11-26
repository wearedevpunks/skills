# Settle

## Entry Guard

Enter only when the router selected this gate: a Track is `verified`, or the
last live Track settled and the go-solo check is due.

## Inputs

- the `verified` Track rows and the run's exit criteria
- the remaining routed scopes, if any

## Actor-Like Gate Boundary

Settle owns closing finished Tracks, the go-solo check after the last live
Track, and closing the run.

## Bounded Action

1. **Close Tracks.** For each `verified` Track: confirm its worktrees and
   task-started resources are cleaned up, settle its thread through the
   host, and mark it `settled`.
2. **Go-solo check.** When no live Track remains and work is still open,
   weigh it as Intake does. Remaining work of one scope, or of small size,
   records a `go_solo` decision.
3. **Close the run.** When every exit criterion holds and no work remains,
   mark the run `closed` and send the final report.

## Invariants

- A Track settles only after verification.
- The run closes only when every exit criterion holds.

## Completion Evidence

- `settled` Track rows with their cleanup evidence
- the go-solo decision or the closed run, when due

## Declared Exits

- `complete` `track_settled`: finished Tracks are closed.
- `complete` `go_solo_due`: the `go_solo` decision is recorded.
- `complete` `run_closed`: every exit criterion holds; the final report is
  sent.

## Durable Handoff

Write the Track rows, Run section and one Events line through
[the Track Ledger contract](../references/ledger.md).

## Stop Or Router Re-entry

Re-enter [the router](router.md).
