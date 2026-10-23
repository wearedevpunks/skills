# Round

## Entry Guard

Enter only when the router selected this gate:

- route row 13: a ready question exists; the router names the round Altitude
  and the round frontier by [Round Selection](router.md#round-selection); or
- route row 11: the latest round's Required Calls record lacks a `round`
  call; complete that round.

## Inputs

- the round Altitude and frontier question ids from the router
- the status Current Round, open questions, Technical Grounding table, and
  Precision Inputs
- the log entries the frontier questions depend on
- the [Altitude Ladder](router.md#altitude-ladder)

## Actor-Like Gate Boundary

Round owns presenting one round at one Altitude. `$grilling` is the
per-round interview primitive, unchanged: the router's frontier is its
frontier. Round never records an answer; `checkpoint` does.

## Bounded Action

1. **Open the round.** Write the Current Round: the next round id, its
   `Altitude`, and the frontier ids, each at that Altitude. On route row 11,
   keep the existing round id.
2. **Stuck unknown.** For a frontier question that carries an `Unknown:`
   prerequisite (one precise unknown that neither a user answer nor fact
   finding can close), invoke `$wayfinder` with the unknown, its owning branch
   and question id, the evidence so far, and the user as decision owner. Run
   the returned route:
   - `grilling`: the question stays in this round;
   - `research`: run `$parallel-research`; the question waits on its report
     and leaves this frontier;
   - `prototype`: run `$prototype` on a `prototype/<slug>` branch with the
     unknown and owning question as its brief; park the question until the
     human verdict closes it.
   Persist the route result against the question id.
3. **Prepare each question.** For a technical question, state the evidence
   anchor and observed constraint, ask one decision, and state its code
   consequence. Give a recommendation, its rationale, and one meaningful
   alternative. An L3 question decides module names, interfaces, primitives,
   seam placement, or file layout. For a Brief fork, recommend the Brief's
   proposed default. When the Precision Inputs record a conservative-closure
   direction, recommend the smallest already-justified model: no new table,
   mode, enum value, service, or abstraction; future branches parked;
   app-layer projections before database views; text enums enforced in code
   before database-native enum changes.
4. **Ask.** Run `$grilling` over exactly the frontier questions. Present the
   round through `$wait-what` with one `$show-me` view: the smallest
   applicable view from its catalog, derived from the status, log, and code
   evidence. Label existing and proposed boundaries; put material ordering,
   lifetime, transaction, and failure consequences beside the view. At L3,
   the view is an interface sketch or a module tree. Load `$show-me` before
   building the view and render it on its first supported surface; in T3
   Code that is the inline HTML renderer.
5. **Complete a round (route row 11).** Present, through the missing call,
   the round's remaining `unanswered` questions; when none remain, present the
   round's accepted answers for the user to correct.
6. **Record calls.** Write the round's call evidence under
   [Required Calls](../references/artifact-output.md#required-calls):
   `grilling`, `wait-what`, and `show-me` with the view name and the surface
   it rendered on; add `wayfinder`
   when step 2 ran. Then stop for the user's answers.

Required calls: `$grilling`, `$wait-what`, `$show-me`; `$wayfinder` for a stuck
unknown.

## Invariants

- One round asks exactly one Altitude.
- The round asks only the router's frontier ids; it adds and drops none,
  except questions that step 2 routes to research or prototype.
- No answer is inferred or written.
- Question ids stay stable.

## Completion Evidence

- the Current Round names the round id, Altitude, and frontier
- the round's Required Calls lines exist for `grilling`, `wait-what`, and
  `show-me`
- each `$wayfinder` route result is recorded against its question id

## Declared Exits

- `checkpoint` `answers_required`: the round is presented; wait for the
  user's response set.
- `complete` `frontier_rerouted`: step 2 moved every frontier question to
  research or prototype; nothing is presented.
- `human_steering_required`: preparing a question shows that the decision
  belongs outside this grill's topic; the record names the decision needed.

## Durable Handoff

Write the `round` entry under
[Gate Outcomes](../references/artifact-output.md#gate-outcomes).

## Stop Or Router Re-entry

After `answers_required` or a steering exit, stop. After
`frontier_rerouted`, re-enter [`router.md`](router.md).
