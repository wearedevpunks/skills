# Reopen

## Entry Guard

Enter only when the router selected this gate: the run is `solo` and current
evidence shows the work now needs orchestration, by the Intake rule: several
cross-dependent scopes of big size, or several PRs into one integration
branch with their own deploys.

## Inputs

- the Solo Thread's current work, its branch and its phase state
- the run's Ledger and last Charter
- [the Track brief template](../references/track-brief.md) and
  [the Host binding](../references/hosts.md)

## Actor-Like Gate Boundary

Reopen owns turning a Solo Thread back into the Orchestrator and handing its
own work to a Track. It keeps the Ledger write.

## Bounded Action

1. **Handoff.** Run `$handoff` for the thread's own work in progress.
2. **Fork.** Fork this thread, so the new Track keeps the full history. Send
   the fork, as its first message, the handoff document plus a filled Track
   brief. A host without fork spawns a thread with the same first message.
3. **Reopen.** Mark the run `open`. Add the fork as a `spawned` Track and
   start its Start check. Add each new scope as a `proposed` Track. Update the
   Charter for new repositories.
4. **Become the Orchestrator.** From here this thread runs only this skill.

## Invariants

- The work in progress never pauses without an owner: the fork owns it before
  this thread routes anything else.
- The Ledger history from before going solo stays.

## Completion Evidence

- the handoff document, the fork link and its brief
- run state `open` with the new Track rows

## Declared Exits

- `complete` `reopened`: the fork owns the old work; this thread orchestrates.

## Durable Handoff

Write the Run section, Track rows and one Events line through
[the Track Ledger contract](../references/ledger.md).

## Stop Or Router Re-entry

Re-enter [the router](router.md).
