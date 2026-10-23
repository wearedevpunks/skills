# Checkpoint

## Entry Guard

Enter only when the router selected this gate:

- route row 6: current evidence holds a response set for this grill, complete
  or partial: answers, parks, deferrals, corrections, auto-pin authorization,
  or a scope direction;
- route row 10: the latest round lacks a `checkpoint` call or records one as
  `missing`; or
- route row 12: a branch's working level is settled below its Target
  Altitude and has no next-level questions.

## Inputs

- the user's response set, when present
- the status file (Current Round, Branch Dashboard, Technical Grounding,
  Precision Inputs, Required Calls, Glossary) and the log
- the [Altitude Ladder](router.md#altitude-ladder)

## Actor-Like Gate Boundary

Checkpoint owns answer recording, Altitude bookkeeping, next-level
derivation, frontier recompute, and the round's required-call evidence. It
delegates terminology to `$domain-modeling` and the gap scan to
`$flow-lenses`, then reconciles their outputs into questions, parks, or
deferrals.

## Bounded Action

Run every step on every response set, a partial set included. On route rows
10 and 12, start at the first step whose evidence is missing.

1. **Record.** Record each supplied answer separately against its stable
   question id through the
   [log contract](../references/artifact-output.md#grill-log-contract), with
   its Altitude, and mark it `answered`. Leave each omitted question
   `unanswered`; never infer an answer. Record a park or deferral with the
   user's reason; a branch park names its Altitude. A changed earlier decision
   gets a superseding entry; a contradiction with an accepted decision becomes
   a new explicit question. A question left open on one precise unknown that
   neither the answer nor fact finding can close gets an `Unknown:`
   prerequisite. A missing fact becomes a fact request. When the user
   authorizes auto-pinning, record the authorization in Precision Inputs and
   record each obvious remaining default of a ready question as an `answered`
   entry with `Source: auto-pinned default` and its Altitude. On a closed
   grill, set `Closure` to `reopened R<N>` first.
2. **Domain model.** Run `$domain-modeling` with the status glossary against
   the changed terms, relationships, and decisions. Persist its accepted
   results in the status Glossary and as Glossary log entries.
3. **Flow Lenses.** Run `$flow-lenses` on the flows that the changed
   decisions touch, with the current decisions and evidence. Reuse lens
   evidence that is still valid; trace each changed decision through its
   paths and dependent branches. Each candidate gap becomes an `unanswered`
   question at its implied Altitude under the owning branch, or is recorded
   as resolved by evidence, or is parked or deferred with a reason.
4. **Expand.** For each answer recorded in step 1, name the decisions it
   opens at its own Altitude, by the design tree of `$grilling`, and record
   each as an `unanswered` question under the owning branch. An "agree all"
   reply accepts the round's recommendations, and the level settles only by
   the [Settled Altitude](router.md#altitude-ladder) rule. For it, dig
   deeper: for each accepted recommendation, name what it now forces
   (dependent choices, edge states, failure paths) and record each open one.
   Imported Brief answers are trusted; Expand reads only this response set.
5. **Target raise.** When an accepted answer has a code consequence, mark the
   branch code-bearing and raise its Target Altitude to L3 by the
   [Altitude Ladder](router.md#altitude-ladder).
6. **Settle.** Update each branch's Settled Altitude by the
   [Altitude Ladder](router.md#altitude-ladder).
7. **Derive.** When a branch's level N settles in step 6 and N is below its
   Target Altitude, derive the branch's level N+1
   questions from that level's ladder contents and the accepted decisions.
   - L3 derivation uses `$codebase-design` vocabulary (module, interface,
     seam, adapter, depth), the applicable stack skills (for example
     `$effect-service-design`), `opensrc` for the exact primitive module,
     symbol, and source version, and a `$show-me` interface sketch or module
     tree of the proposed modules.
   - When the precision inputs already settle level N+1, derive no question
     for it; the router then sends `ground` to record it.
   - A derived technical question gets a Technical Grounding row and a fact
     request for the evidence it needs; `ground` dispatches it.
8. **Recompute.** Update the open-question rows with their Altitude, the
   Branch Dashboard (completion, Target Altitude, Settled Altitude, open
   items, parks), and Technical Grounding. While any question is open, set
   shared-understanding confirmation to `not-ready`.
9. **Call evidence.** Under
   [Required Calls](../references/artifact-output.md#required-calls) for the
   round, read the `round` lines and leave an absent one absent, so the
   router sends `round` to complete the round. Write the `checkpoint` lines:
   `domain-modeling`, `flow-lenses`, `expand` (run, with the new question ids
   at the round Altitude, or `none`), and `level derivation` (run, with the
   derived ids, or `not due`). A call that could not run is written as
   `missing` with the reason; the router holds the next round until it runs.
10. **Persist.** Write the status file and log before leaving the gate.

Required calls: `$domain-modeling` and `$flow-lenses` on every response set;
for an L3 derivation, `$codebase-design`, the applicable stack skills,
`opensrc`, and `$show-me`.

## Invariants

- An answer is recorded only from the user's words, a Brief import, or an
  authorized auto-pin; each records its Altitude.
- Question ids stay stable and are never reused.
- A Target Altitude only rises.
- No planning item from the [Altitude Ladder](router.md#altitude-ladder)
  exclusions enters a question.

## Completion Evidence

- each supplied answer is in the log with its Altitude and in status as
  `answered`; each omitted id is still `unanswered`
- the round's Required Calls lines exist for `domain-modeling`,
  `flow-lenses`, `expand`, and `level derivation`
- each answer's same-Altitude follow-ups are open questions, or `expand`
  reads `none`
- each candidate gap is a question, resolved by evidence, parked, or deferred
- the Branch Dashboard shows current Target and Settled Altitudes

## Declared Exits

- `complete` `recorded`: every step is done and persisted.
- `blocked` `call_failed`: a required call cannot run; it is written as
  `missing` with the reason.
- `human_steering_required`: the response set asks for work beyond the grill
  (implementation, a plan, a code edit) or changes a decision this grill does
  not own; the record names the decision needed.

## Durable Handoff

Write the `checkpoint` entry under
[Gate Outcomes](../references/artifact-output.md#gate-outcomes).

## Stop Or Router Re-entry

After `recorded`, re-enter [`router.md`](router.md). On a blocked or steering
exit, stop.
