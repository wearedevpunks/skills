# Spawn

## Entry Guard

Enter only when the router selected this gate: a Track is `proposed`, or an
adopt is pending.

## Inputs

- the `proposed` Track rows and pending adopts
- the Charter (model settings, repositories, start branches)
- [the Track brief template](../references/track-brief.md) and
  [the Host binding](../references/hosts.md)

## Actor-Like Gate Boundary

Spawn owns starting each Track and proving it started. It delegates the Start
check to a Worker and keeps the Ledger write.

## Bounded Action

1. **Brief.** Fill the Track brief template for the Track. An explicit-only
   phase starts only from its typed command, so the brief's first line is the
   phase command.
2. **Start.**
   - A Track that continues an existing thread's history: fork that thread.
   - A new Track: spawn a thread in the project of its repository, on its
     start branch, with the Charter's model settings.
   - Adopt: send the adopt brief to the named thread.
3. **Start check.** Run a Worker that waits until the Track's first run
   starts and reports back. A Track whose first run has not started within 2
   minutes becomes `stalled`; Listen reads its error.
4. **Write.** Record the thread link and mark the Track `spawned`.

## Invariants

- Every Track gets the full brief; nothing in it lives only in the
  Orchestrator's context.
- One Start check per spawn.

## Completion Evidence

- the thread link and brief for each Track
- a running Start check Worker per spawned Track

## Declared Exits

- `complete` `spawned`: each Track is spawned or adopted, its Start check
  running.
- `blocked` `spawn_failed`: the host refused the spawn; the Ledger records the
  error and Listen retries or opens an access item.

## Durable Handoff

Write the Track rows and one Events line through
[the Track Ledger contract](../references/ledger.md).

## Stop Or Router Re-entry

Re-enter [the router](router.md).
