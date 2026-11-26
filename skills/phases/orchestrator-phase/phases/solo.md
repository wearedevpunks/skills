# Solo

## Entry Guard

Enter only when the router selected this gate: the Ledger records a
`go_solo` decision not yet carried out.

## Inputs

- the `go_solo` decision and its evidence
- the Track rows and open Needs-you items
- the remaining scope and its phase route

## Actor-Like Gate Boundary

Solo owns the transition from Orchestrator to Solo Thread. After it, this
skill no longer runs the thread.

## Bounded Action

1. **Guard.** No live Track remains and no Needs-you item belongs to another
   Track. Otherwise record `solo_deferred`; Settle checks again after the last
   live Track.
2. **Close.** Write the final Ledger entry: "went solo", the reason, and the
   remaining scope. Mark the run `solo`. The Charter stops applying.
3. **Run the phase.** Type the remaining scope's phase command in this thread
   (`$requirements-phase`, `$delivery-phase` or `$debugging-phase`) and run
   it under that phase's own rules; merge returns to the human as that phase
   says.

## Invariants

- A Solo Thread is not a Track: no Orchestrator sits above it.
- The Ledger keeps every Track and decision for a later reopen.

## Completion Evidence

- the Ledger "went solo" entry and run state `solo`, or the `solo_deferred`
  note

## Declared Exits

- `complete` `went_solo`: the thread runs the remaining phase itself.
- `no-op` `solo_deferred`: live Tracks or their Needs-you items remain.

## Durable Handoff

Write the Run section and one Events line through
[the Track Ledger contract](../references/ledger.md).

## Stop Or Router Re-entry

After `went_solo`, stop: the typed phase command owns the thread. After
`solo_deferred`, re-enter [the router](router.md).
