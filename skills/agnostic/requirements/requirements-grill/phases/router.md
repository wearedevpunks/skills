# Grill Router

Load this file on every invocation and re-entry. Recompute one route from
current evidence; transcript continuity and a recorded route suggestion are
never required. The router reads and selects; it writes nothing. Gates write
every durable change through
[the artifact contract](../references/artifact-output.md).

## Precision Inputs

Read, before route precedence:

1. the Finder Fog graph (the Fog and its child decisions), when the caller
   supplies Finder context;
2. the Brainstorm Brief at
   `<wiki-root>/content/docs/project/grilling/<topic>-brainstorm-brief.md`,
   when it exists;
3. the grill status file, then the grill log;
4. code evidence: the repository paths, schemas, contracts, configuration,
   and runtime paths that the status Technical Grounding table anchors.

These inputs set each branch's start level. A branch works at the first
Altitude above its Settled Altitude. When the inputs already settle a level
that the Branch Dashboard does not record, row 4 selects `ground` to record it,
and the branch then starts at the next level.

## Inputs And Authority

Inspect, in authority order:

1. current direct evidence: the user's current message (answers, parks,
   corrections, confirmation, closure, auto-pin authorization, scope
   direction), a compile gap that `create-architecture` returns with its
   Altitude, and code evidence;
2. fresh workflow-native artifacts: the status file, the log, the Brainstorm
   Brief, and the Fog graph;
3. the latest Gate Outcomes entry of each gate in the status file;
4. any suggested route.

Evidence is eligible only when it is in scope (this grill topic and its
branches), fresh (a Brief whose sha256 differs from the Brief import record is
fresh input, not stale import), and valid (files exist, question ids resolve,
anchors resolve). Higher authority wins. At the same authority, the log wins
over the status file for a decision, and the status file wins over the log for
round and frontier state. Any other same-authority conflict is blocked
`grill_state_conflict`.

## Altitude Ladder

This is the single definition of the Altitude Ladder. Gates link here.

- **L1 Outcome**: users, flows, scope, observable behavior, states, copy,
  non-goals.
- **L2 Shape**: deployables, boundaries, state ownership and authority,
  contracts between parts, data lifecycle, external dependencies.
- **L3 Modules**: primitives and libraries with exact module and symbol,
  modules and their interfaces, seams and adapters, dependency direction and
  injection, type and schema shapes, file and folder layout, resource
  lifetime owner. At L3 the grill decides module names, interfaces,
  primitives, seam placement, and file layout.
- Planning stays downstream with `create-plan`: edit order, task breakdown,
  waves, estimates, tuning constants. No grill question asks them.

Each branch has exactly one Target Altitude and one Settled Altitude.

- **Target Altitude**: L3 for a code-bearing branch, L1 for a product-only
  branch. A branch becomes code-bearing when an accepted answer has a code
  consequence (it names or changes code, a schema, a contract, configuration,
  or a runtime path); its Target Altitude then rises to L3. A Target Altitude
  only rises; less depth needs a user park at a named Altitude.
- **Settled Altitude**: the deepest Altitude at which every question of the
  branch, at that Altitude and above, is answered or parked; `none` before L1
  settles.
- One Round asks questions at exactly one Altitude.

## Round Selection

A question is ready when its state is `unanswered`, each prerequisite
question is answered, each fact prerequisite is recorded, and no
`$wayfinder` research or prototype holds it. The round Altitude is the
shallowest Altitude that has a ready question in any branch. The round
frontier is every ready question at that Altitude. Branches descend
independently: a branch whose ready questions are deeper waits for a later
round of their Altitude.

## Close Guard

The Close Guard passes when all of these hold:

- no question is `unanswered`;
- every active branch is settled at its Target Altitude, or parked at a named
  Altitude with the user's reason recorded;
- every auto-pinned default records its Altitude;
- every code-bearing branch is grounded with no open technical decision;
- every round's Required Calls record is complete.

## Route Precedence

Evaluate top to bottom and return the first matching row. Return only its one
output.

| Priority | Current evidence | Output |
| --- | --- | --- |
| 1 | A Gate Outcomes entry records `human_steering_required` with a decision that current user direction does not resolve | terminal `human_steering_required` |
| 2 | The topic or `<wiki-root>` is unresolved, or several grill status files match the request | blocked `grill_target_unclear` |
| 3 | Same-authority admissible evidence conflicts and no tie-break above resolves it | blocked `grill_state_conflict` |
| 4 | Any of: no status file; an open grill whose status lacks the altitude fields; an open grill with a Brief that has no Brief import record or a sha256 that differs from it; a compile gap or other new precision input not yet recorded; precision inputs settle a level the Branch Dashboard does not record; a Technical Grounding anchor that no longer resolves; a recorded fact request not yet dispatched | [`ground.md`](ground.md) |
| 5 | The status `Closure` line reads `closed R<N>` and current evidence holds no new decision content | terminal `grill_closed` |
| 6 | Current evidence holds answers, parks, deferrals, corrections, auto-pin authorization, or a scope direction for this grill | [`checkpoint.md`](checkpoint.md) |
| 7 | Current evidence holds the user's reply to a pending confirmation or closure request, with no new decision content | [`close.md`](close.md) |
| 8 | The Current Round is presented, its round calls are recorded, it has no `checkpoint` call yet, each of its frontier questions is still `unanswered`, and current evidence holds no reply | checkpoint `answers_required` |
| 9 | Shared-understanding confirmation is `pending`, or `confirmed` without explicit closure, and current evidence holds no reply | checkpoint `shared_understanding_required` or `closure_required` |
| 10 | The latest round's Required Calls record lacks a `checkpoint` call, or records one as `missing` | [`checkpoint.md`](checkpoint.md) |
| 11 | The latest round's Required Calls record lacks a `round` call | [`round.md`](round.md) to complete that round |
| 12 | A branch has every question at its working level answered or parked, that level is below its Target Altitude, and neither next-level questions nor a settled-by-evidence record exists | [`checkpoint.md`](checkpoint.md) |
| 13 | A ready question exists | [`round.md`](round.md) at the Round Selection Altitude |
| 14 | Open questions exist and none is ready | blocked `facts_pending` |
| 15 | No open question exists and the Close Guard passes | [`close.md`](close.md) |
| 16 | No open question exists and the Close Guard fails | blocked `grill_state_conflict` |

Rows 10 and 11 hold the next round: the router starts round R<N+1> only after
the Required Calls record of R<N> lists every required call of `round` and
`checkpoint`.

Before loading a selected gate, read its latest Gate Outcomes entry. When it
is `blocked` and current evidence adds nothing that resolves the recorded
blocker, return that blocked outcome and stop instead of loading the gate.

## Router Outputs

- terminal: `human_steering_required` restates the recorded decision;
  `grill_closed` restates the handoff to `$create-architecture`.
- checkpoint: `answers_required` restates the Current Round questions
  through `$wait-what`; `shared_understanding_required` and
  `closure_required` restate the pending request. Then stop.
- blocked: `grill_target_unclear` asks one concrete question about the topic;
  `grill_state_conflict` names the conflicting evidence; `facts_pending` names
  each running fact request, `$wayfinder` research, or prototype and the
  question ids it holds; a restated gate blocker names the missing evidence.
- gate: load exactly that flat phase file; sibling gates stay outside the
  current trace.
