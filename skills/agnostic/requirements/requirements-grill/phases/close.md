# Close

## Entry Guard

Enter only when the router selected this gate:

- route row 15: the [Close Guard](router.md#close-guard) passes: every
  branch is settled at its Target Altitude or parked at a named Altitude with
  the user's reason; or
- route row 7: current evidence holds the user's reply to a pending
  confirmation or closure request, with no new decision content.

## Inputs

- the status file and log
- the user's reply, when present
- [wiki output](../references/wiki-output.md), for synthesis after explicit
  closure

## Actor-Like Gate Boundary

Close owns shared-understanding confirmation, grill closure, wiki synthesis,
and the handoff. Corrections in a reply belong to `checkpoint`; close records
only confirmation and closure.

## Bounded Action

1. **Guard.** Re-check every condition of the
   [Close Guard](router.md#close-guard) against the status file and log. On
   failure, exit `guard_failed`.
2. **Request confirmation.** When confirmation is `not-ready`:
   1. run `$domain-modeling` for a final consistency pass over the full
      status glossary and persist its results;
   2. invoke `$show-me` to present the persisted shared understanding:
      branches with Target and Settled Altitudes, parks with Altitude and
      reason, glossary, and axioms. The view is derived; approval applies to
      the status file and log;
   3. set confirmation to `pending` and ask the user to confirm shared
      understanding.
3. **Record the reply.** Set confirmation to `confirmed` only on the user's
   explicit words, and quote them. When the same reply explicitly closes the
   grill, continue to step 4; otherwise ask for explicit closure.
4. **Close.** On explicit closure:
   1. write the log Closure section and set the status `Closure` line to
      `closed R<N>`;
   2. run wiki synthesis by [wiki output](../references/wiki-output.md), so
      accepted terms land at
      `<wiki-root>/content/docs/project/domains/<context>-glossary.mdx`;
   3. report branch percentages, parked branches with their Altitude and
      reason, remaining non-design validation work, which routed artifacts
      and bookkeeping changed, and the recommended next direction;
   4. hand the status file and log to `$create-architecture`, the next step
      of `$requirements-phase`; its retained `ARCHITECTURE.md` then feeds
      `$create-spec`. Backlog projection comes later, outside this skill.
5. Write the close calls under
   [Required Calls](../references/artifact-output.md#required-calls):
   `domain-modeling`, `show-me`, and, on closure, `wiki synthesis`.

Required calls: `$domain-modeling` (final pass), `$show-me` (persisted
understanding), wiki synthesis on explicit closure.

## Invariants

- Confirmation and closure come only from the user's explicit words.
- Close records no decision; a correction re-enters through `checkpoint`.
- Wiki synthesis runs only after explicit closure.

## Completion Evidence

- the Close Guard check result
- confirmation state with the user's quoted words
- on closure: the log Closure section, wiki pages written, and the
  `$create-architecture` handoff

## Declared Exits

- `checkpoint` `shared_understanding_required`: confirmation is `pending`.
- `checkpoint` `closure_required`: confirmation is `confirmed` and explicit
  closure is missing.
- `complete` `grill_closed`: the grill is closed and handed to
  `$create-architecture`.
- `complete` `guard_failed`: the Close Guard no longer passes; the record
  names the failing branch.
- `human_steering_required`: the reply asks for work beyond the grill; the
  record names the decision needed.

## Durable Handoff

Write the `close` entry under
[Gate Outcomes](../references/artifact-output.md#gate-outcomes).

## Stop Or Router Re-entry

After `guard_failed`, re-enter [`router.md`](router.md). After any other exit,
stop.
