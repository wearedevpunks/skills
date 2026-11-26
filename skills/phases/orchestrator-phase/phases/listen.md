# Listen

## Entry Guard

Enter only when the router selected this gate: the event is a Track line, a
PR event, a Worker result, or a human reply that the Ledger Events do not yet
hold. Listen is the steady state of the run.

## Inputs

- the current event, with its send time
- the Charter and Ledger
- the live PR state of any PR the event names

## Actor-Like Gate Boundary

Listen owns turning one event into Ledger state and at most one next action.
It delegates triage of a large batch of lines to a Worker and keeps the
Ledger write.

## Bounded Action

1. **Freshness.** Judge the event by its send time. Before acting on a line
   about a PR, read that PR's current state; an event the current state has
   overtaken is recorded as stale.
2. **Apply by event kind.**
   - **Track line.** Move the Track's state as the line says. On "grill
     closed": unless the human holds it, write `delivering` first, then send
     `$delivery-phase` to the Track; a later "grill closed" for a Track
     already `delivering` changes nothing. On "ready" with a commit: record the
     commit and mark the Track `ready`. On a cross-Track need: send it to the
     owning Track. On an out-of-bounds decision: add it to Decisions and to
     Needs you.
   - **Start check result.** Started: mark the Track by its phase. Not
     started within 2 minutes: mark it `stalled`, read the thread's error,
     then spawn it again or open an access item.
   - **PR event.** Record checks and review results. A head that moved after
     "ready" returns the Track to `in_review`.
   - **Worker result.** Record it against its Track or Needs-you item.
   - **Human reply.** Match it to a Needs-you item by its N-id or its quoted
     line, record the answer, and close the item. A scope change updates the
     exit criteria. A hold parks its Track; a release resumes it. A relayed
     "go" counts only when its quoted words are found in the human's own
     messages in the source thread; otherwise it stays open.
3. **Silence.** When an event wakes the run, a Track silent past its expected
   next line gets a Worker that reads its thread.
4. **Report.** After a change the human must see, send one report.

## Invariants

- One event per turn; the turn ends after the Ledger write.
- Listen merges, ships and verifies nothing itself; the router selects those
  gates from the new state.
- A Human Gate opens only on approval as the skill defines it.

## Completion Evidence

- an Events line for the event, with its send time
- the changed Track, Needs-you or Decisions rows

## Declared Exits

- `complete` `event_recorded`: the Ledger holds the event and its effect.
- `no-op` `stale_event`: current state has overtaken the event.

## Durable Handoff

Write the changed rows and one Events line through
[the Track Ledger contract](../references/ledger.md).

## Stop Or Router Re-entry

Re-enter [the router](router.md).
