# Charter

## Entry Guard

Enter only when the router selected this gate: the run has no Charter, or the
event changes a Charter rule.

## Inputs

- the Ledger Run section and the routed scopes
- each repository the scopes touch: CI configuration, PR review settings,
  deploy pipelines, env and secret tooling
- the human's rule change, when present
- [the Charter contract](../references/charter.md) and
  [the Host binding](../references/hosts.md)

## Actor-Like Gate Boundary

Charter owns `charter.md`. It may delegate repository reading to Workers and
keeps every binding decision and the file write.

## Bounded Action

1. **Write once.** Fill every section of the Charter contract from repository
   evidence. A binding the evidence does not settle is an Autonomous Decision
   with the recommended default, recorded in the Ledger.
2. **Amend.** For a human rule change, update the named section in place,
   record the change in the Ledger Decisions, and tell each Track the change
   touches in one line.
3. **Show.** The first report after the Charter is written includes it in
   short form. Tracks start without waiting for approval.

## Invariants

- The Human Gates section holds at least the four gates of the skill.
- A Charter rule changes only by the human's words or a recorded Autonomous
  Decision.

## Completion Evidence

- `charter.md` with every contract section filled
- a Ledger Decisions entry for each defaulted binding and each amendment

## Declared Exits

- `complete` `charter_written`: the first Charter exists.
- `complete` `charter_amended`: the named rule changed and affected Tracks
  were told.

## Durable Handoff

Write `charter.md` and one Events line through
[the Track Ledger contract](../references/ledger.md).

## Stop Or Router Re-entry

Re-enter [the router](router.md).
