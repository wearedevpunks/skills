# Requirements Grill Graph Authoring Handoff

This is the graph-authoring record for the `write-graph-based-skills` Convert
run on `requirements-grill`. It is separate from the runtime grill handoff:
the status file's Gate Outcomes section, defined in
[references/artifact-output.md](references/artifact-output.md#gate-outcomes).

Authority: spec `apps/wiki/content/docs/project/specs/cli/brainstorm-grill-altitude/SPEC.md`
(commit `0cefe387b0cc`) and sibling `ARCHITECTURE.md` (commit `5a9667427afe`)
in `wearedevpunks/harness-intelligence`: OUT-003, OUT-005..OUT-008,
AC-005, AC-006, AC-008 (checkpoint), AC-009..AC-018; ARC-002, ARC-004..ARC-010;
FLOW-002, FLOW-003; plan `PLAN.md` task T3 and decisions D4..D7; grill log Q6,
Q9..Q18 and Glossary Q25. Source skill base: skills `main` `c86912b42c3b`.

Executable proof lives in the source repository test
`tests/requirements-grill-graph.contract.test.mjs` (plan task T7).

## Router Selections

Phase: router

Status: complete

Scope: Recompute the authoring route on every re-entry of this Convert run.

Artifacts: the target `SKILL.md`, flat `phases/`, `references/`, and this
record, as each existed at the time of each selection.

Validation and selections, in order:

1. First entry: `SKILL.md` held a linear skill with Core Behavior steps,
   the former live-flow reference held executable grounding steps, no
   `phases/`, no authoring record; the accepted spec adds Altitude
   obligations. Selected `qualify.md`.
2. Obligation map complete; no state model. Selected `model-state.md`.
3. State model complete; authority and overlap tie-breaks absent. Selected
   `define-authority.md`.
4. Authority complete; target root still executable, no router. Selected
   `write-router.md`.
5. Router written; four gate files missing; executable steps still in
   the former live-flow reference and in `artifact-output.md` (response-set steps, branch
   closure steps). Selected `write-phases.md`.
6. Gates written; Gate Outcomes, Required Calls, Precision Inputs, and
   Legacy Status fields named by gates but not defined. Selected
   `define-handoffs.md`.
7. Handoff contract written; disclosure trace unverified. Selected
   `verify-disclosure.md`.
8. Disclosure passes; route matrix absent. Selected `test-routes.md`.
9. Route matrix complete with three repairs re-tested. Selected `audit.md`.
10. Audit passes. Terminal `audit-complete`.

Domain state: every selection cited current files; no overlap required a
tie-break beyond the authoring router's earliest-missing order.

Next suggested route: none (audit-complete).

Blockers: none

Resume identity: none; current target artifacts reconstruct each selection.

## Qualify Outcome

Phase: qualify

Status: complete

Scope: Bound the converted workflow; record mandatory obligations and
survivor artifacts.

Artifacts: the obligation map below.

| Obligation | Mandatory | Survives interruption | Evidence artifact | Owner | Audit criterion |
|---|---|---|---|---|---|
| O1 Model-invocable entry `$requirements-grill`, name unchanged | yes | yes | `SKILL.md` frontmatter | write-router | no invocation flag added; callers `requirements-phase`, `design-phase` grill gate, compile-gap return still resolve |
| O2 One route per entry from current evidence, including cold resume | yes | yes | `phases/router.md`, status file | router | every legal state maps to one precedence row |
| O3 Precision inputs: Fog graph when supplied, Brief, status, code evidence; a settled level starts the branch at the next level (AC-006) | yes | yes | router Precision Inputs, Branch Dashboard anchors | router, ground | router reads all four; row 4 records settled-by-evidence levels |
| O4 Brief import before the first round with the Q6 mapping; no re-ask; sha256 delta re-import (AC-005, D4, D6) | yes | yes | log entries `Source: Brainstorm Brief`, Brief import record | ground | mapping, no-re-ask, delta rule present |
| O5 Altitude Ladder L1/L2/L3 and planning exclusions defined once (AC-012, D5) | yes | yes | router `## Altitude Ladder` | router | one definition; gates link it |
| O6 Target Altitude L3 code-bearing, L1 product-only; raise to L3 on first code consequence (AC-012) | yes | yes | Branch Dashboard | ground, checkpoint | rule in ladder; raise step in checkpoint |
| O7 One Altitude per round, shallowest ready across branches (AC-013) | yes | yes | Current Round `Altitude` | router, round | Round Selection rule; round invariant |
| O8 Level N+1 derivation at checkpoint; L3 via `$codebase-design` vocabulary, stack skills, `opensrc`, `$show-me` sketch or module tree (AC-014) | yes | yes | log questions with Altitude, Required Calls `level derivation` | checkpoint | step 7 names all four inputs |
| O9 No placeholder-label default (AC-015); L3 decides names, interfaces, primitives, seams, layout | yes | yes | log template, ladder | define-handoffs, router | the AC-015 grep over the skill is empty |
| O10 `ground` uses subagents and never asks the user (AC-011) | yes | yes | Technical Grounding, fact records | ground | boundary and invariant state it |
| O11 Technical grounding obligations of the former live-flow reference kept (locate, owner, primitive, consequence, ask) | yes | yes | Technical Grounding table, log technical template | ground, round | steps 8 (ground) and 3–4 (round) |
| O12 `round` runs `$grilling` unchanged through `$wait-what` with a `$show-me` view | yes | yes | Required Calls round lines | round | step 4; `grilling/**` diff empty |
| O13 `$wayfinder` route for one stuck unknown | yes | yes | route result against the question id | round | step 2 with grilling, research, prototype routes |
| O14 Checkpoint on every response set incl. partial: record, `$domain-modeling`, `$flow-lenses`, derive, recompute, persist (AC-008, AC-011) | yes | yes | log, status, Required Calls | checkpoint | steps 1–10 |
| O15 Partial response: omitted ids stay unanswered; stable ids; supersede rule | yes | yes | Current Round table, log | checkpoint | step 1 and invariants |
| O16 Each gate names its required calls; checkpoint records per-round call evidence; a missing call holds the next round (AC-018) | yes | yes | Required Calls section | every gate, router rows 10–11 | each gate has a `Required calls:` line; rows 10–11 precede row 13 |
| O17 Close guard: every branch at Target Altitude or parked at a named Altitude with the user's reason; explicit confirmation; auto-pinned defaults record Altitude (AC-016) | yes | yes | router Close Guard, status confirmation, log Closure | router, close, checkpoint | guard defined once; close re-checks it |
| O18 Close: final `$domain-modeling`, `$show-me` of persisted understanding, wiki synthesis after explicit closure, handoff to `$create-architecture` | yes | yes | Required Calls Close block, wiki pages, log Closure | close | steps 2–5 |
| O19 Four altitude fields in `artifact-output.md` (AC-017) | yes | yes | `references/artifact-output.md` | define-handoffs | dashboard columns, Current Round line, table column, log line |
| O20 Legacy status upgraded once on first resume of an open grill (D7) | yes | yes | `Altitude upgrade:` record | ground | `## Legacy Status` rule; closed grills never upgraded |
| O21 Compile-gap return enters at its Altitude and reopens a closed grill | yes | yes | Precision Inputs `Compile gaps`, `Closure: reopened` | ground | step 4 |
| O22 Conservative closure and auto-pinning kept | yes | yes | Precision Inputs | round, checkpoint | round step 3, checkpoint step 1 |
| O23 Durable artifacts, routed wiki contract, glossary snapshot, wiki output unchanged in role; `## Routed Wiki Contract` heading kept (brainstorm links it) | yes | yes | references | define-handoffs | headings and links resolve |
| O24 `human_steering_required` terminal | yes | yes | Gate Outcomes | every gate, router row 1 | reachable, durable, distinct from checkpoints |
| O25 Planning items stay out of the grill | yes | yes | ladder exclusions | router | gate invariants link the exclusions |

Survivor artifacts: the grill status file (Branch Dashboard, Precision
Inputs, Current Round, Required Calls, Technical Grounding, Gate Outcomes,
Glossary); the grill log; wiki pages written by synthesis. The Brief and the
Fog graph are read-only inputs owned elsewhere.

Validation:

- Every obligation has an owner, evidence artifact, and audit criterion.
- Preserved from the old skill: durable artifact paths and legacy `docs/`
  move rule, routed wiki contract, stable ids and supersession, partial
  response handling, technical-grounding steps, conservative closure,
  auto-pinning, learning-artifact reading, `$wayfinder` routes, explicit
  confirmation, wiki synthesis after explicit closure, handoff report.
- Removed per Q8, Q13, Q16: the `$brainstorm` gap scan (replaced by
  `$flow-lenses`), the placeholder-label log field and its "leave names to
  downstream work" rule, and the former live-flow reference file.
- Four interacting gates, three human checkpoints, two cycles. Direct
  composition does not apply. Graph authoring selected.

Domain state: graph authoring selected.

Next suggested route: `model-state.md`

Blockers: none

Resume identity: none

## Model State Outcome

Phase: model-state

Status: complete

Scope: Define evidence states, topology, guards, and obligation reachability.

Artifacts:

### State Table

| State ID | Meaning | Scope | Entry guard | Exit guard | Next states |
|---|---|---|---|---|---|
| target_unclear | Topic or wiki root unresolved, or several status files match | request | no resolvable grill | one grill resolved | ground_due |
| state_conflict | Same-authority evidence conflicts | grill | tie-break fails | conflict removed by user or edit | any |
| ground_due | Artifacts missing, legacy status, Brief import due, gap unrecorded, evidence-settled level unrecorded, anchor invalid, fact request undispatched | grill | router row 4 | ground outcome `grounded` or `facts_requested` | round_due, facts_pending, closed |
| round_due | A ready question exists | Altitude | row 13 | Current Round presented, round calls recorded | answers_pending, ground_due (rerouted) |
| answers_pending | Round presented, no reply | round R<N> | row 8 | reply arrives | checkpoint_due |
| checkpoint_due | Response set, or checkpoint call missing, or derivation due | round R<N> | rows 6, 10, 12 | checkpoint lines recorded | round_due, ground_due, close_due, round_incomplete |
| round_incomplete | A round call is absent for the latest round | round R<N> | row 11 | round lines recorded | answers_pending, checkpoint_due |
| facts_pending | Open questions, none ready | grill | row 14 | a fact, research, or prototype report | ground_due, round_due |
| close_due | No open question, Close Guard passes | grill | row 15 | confirmation `pending` | confirmation_pending |
| confirmation_pending | Confirmation `pending` or `confirmed` without closure | grill | row 9 | user reply | close_due (reply), checkpoint_due (correction) |
| closed | `Closure: closed R<N>` | grill | row 5 | compile gap or new decision content | ground_due, checkpoint_due |
| human_steering_required | Work beyond the grill or a decision it does not own | grill | row 1 | user direction resolves it | any |

### Gate Table

| Gate ID | Entry guard | Actor-like gate boundary owner | Internal delegation policy | Reconciliation rule | Outputs | Exit semantics | Durable handoff |
|---|---|---|---|---|---|---|---|
| ground | row 4 | artifacts, precision import, branch Altitudes, grounding, fact dispatch | subagents for facts; stack skills and `opensrc` for primitives; `$domain-modeling` load | reports become facts and cleared prerequisites | status, log | `grounded`, `facts_requested`, blocked `precision_input_unreadable`, steering | Gate Outcomes `ground` |
| round | rows 11, 13 | one round at one Altitude | `$grilling`, `$wait-what`, `$show-me`, `$wayfinder` (+ `$parallel-research`, `$prototype`) | wayfinder results recorded per question | Current Round, Required Calls | checkpoint `answers_required`, `frontier_rerouted`, steering | Gate Outcomes `round` |
| checkpoint | rows 6, 10, 12 | recording, Altitude bookkeeping, derivation, call evidence | `$domain-modeling`, `$flow-lenses`, `$codebase-design`, stack skills, `opensrc`, `$show-me` | gaps become questions, resolved, parked, or deferred | log, status | `recorded`, blocked `call_failed`, steering | Gate Outcomes `checkpoint` |
| close | rows 7, 15 | confirmation, closure, synthesis, handoff | `$domain-modeling`, `$show-me`, wiki synthesis | corrections re-route to checkpoint | status, log Closure, wiki pages | checkpoints `shared_understanding_required`, `closure_required`; `grill_closed`; `guard_failed`; steering | Gate Outcomes `close` |

### Graph Layer

| Path | Branch condition | Cycle target | Skip condition | Checkpoint condition |
|---|---|---|---|---|
| ground → round → checkpoint → round … → close | Round Selection Altitude per round | checkpoint → router → round (next round or next level) | level settled by precision inputs (ground records, branch starts next level); Brief absent; Fog not supplied | round presented (`answers_required`) |
| checkpoint derivation | level N settled and N below Target | checkpoint → round at N+1 | Target reached | none |
| missing call | Required Calls incomplete | rows 10–11 → owning gate | none | none |
| close | Close Guard | `guard_failed` → router | none | confirmation, explicit closure |
| reopen | compile gap or new decision content on a closed grill | closed → ground or checkpoint | none | none |

Validation: every obligation O1–O25 maps to at least one state and gate; the
human steering terminal is reachable from every gate.

Domain state: model complete.

Next suggested route: `define-authority.md`

Blockers: none

Resume identity: none

## Define Authority Outcome

Phase: define-authority

Status: complete

Scope: Evidence authority, admissibility, overlap precedence.

Artifacts: router `## Inputs And Authority` and `## Route Precedence`.

| Transition | Evidence condition | Freshness | Scope | Validity | Conflicts | Tie-break rule | Derived route |
|---|---|---|---|---|---|---|---|
| any → ground | row 4 conditions | Brief sha256 vs import record; anchors resolve | this topic | files exist | answers in the same message (row 6) | row 4 first; the message stays current evidence for the next entry | ground |
| closed → terminal | `Closure: closed` | current | topic | — | compile gap (row 4), new decision content (row 6) | rows 4 and 6 exclude terminal | grill_closed |
| reply → checkpoint vs close | reply content | current message | topic | — | reply with corrections and a confirmation | row 6 before row 7; a correction resets confirmation | checkpoint |
| missing calls vs next round | Required Calls of R<N> | current | round | — | ready questions exist | rows 10–11 before row 13 | owning gate |
| derivation vs round | level settled below target | current | branch | — | ready questions at another Altitude | row 12 before row 13 | checkpoint |
| decision conflict | log and status disagree | — | — | — | — | log wins for a decision; status wins for round and frontier state; else blocked | per rule |

Authority table: current direct evidence (1), fresh workflow-native artifacts
(2), Gate Outcomes (3), suggested route (4).

Validation: every overlapping set resolves to one row by top-to-bottom order;
stale (Brief sha256 changed), out-of-scope (other topic), and invalid
(anchor gone) evidence lose eligibility or route to `ground`.

Domain state: authority complete.

Next suggested route: `write-router.md`

Blockers: none

Resume identity: none

## Write Router Outcome

Phase: write-router

Status: complete

Scope: Target bootstrap and router.

Artifacts: `SKILL.md` (bootstrap, no gate bodies; names composition
`$grilling`, `$wait-what`, `$show-me`, `$wayfinder`, `$domain-modeling`,
`$flow-lenses`, `$create-architecture`); `phases/router.md` (Precision Inputs,
Inputs And Authority, Altitude Ladder, Round Selection, Close Guard, Route
Precedence rows 1–16, Router Outputs).

Validation:

- Each legal state returns exactly one gate, terminal, checkpoint, or blocked
  output.
- Cold resume needs only the status file, log, and precision inputs.
- Invocation policy preserved: no `disable-model-invocation`; name unchanged.
- The router writes nothing (D4).

Domain state: router complete.

Next suggested route: `write-phases.md`

Blockers: none

Resume identity: none

## Write Phases Outcome

Phase: write-phases

Status: complete

Scope: Every router-selected gate.

Artifacts: `phases/ground.md`, `phases/round.md`, `phases/checkpoint.md`,
`phases/close.md`. Each has Entry Guard, Inputs, Actor-Like Gate Boundary,
Bounded Action, a `Required calls:` line, Invariants, Completion Evidence,
Declared Exits, Durable Handoff, Stop Or Router Re-entry.

Moves: the former live-flow reference's technical grounding steps 1–3 → `ground` step 8;
steps 4–5 (show the consequence, ask the decision) → `round` steps 3–4; live
visual reasoning → `round` step 4; domain-modeling load → `ground` step 6;
round artifact integration and response-set steps → `checkpoint`; conservative
closure → `round` step 3; final domain-modeling → `close`. `artifact-output.md`
response-set steps and Branch Closure steps → `checkpoint` and `close`.
The former live-flow reference file is deleted.

Validation: every router filename exists; no executable gate body remains in
`SKILL.md` or `references/`; each gate emits only its declared exits.

Domain state: gates complete.

Next suggested route: `define-handoffs.md`

Blockers: none

Resume identity: none

## Define Handoffs Outcome

Phase: define-handoffs

Status: complete

Scope: Runtime handoff schema, storage, discovery, exit coverage.

Artifacts: `references/artifact-output.md`: Gate Outcomes (canonical fields,
domain-state label `Grill state`, UI evidence not applicable), Required Calls,
Precision Inputs (Brief import, Fog, Altitude upgrade, Auto-pin, Conservative
closure, Compile gaps), Current Round (`Altitude`, `Closure`, `Branch` and
`Altitude` columns), Branch Dashboard (`Target altitude`, `Settled altitude`),
log `Altitude:` and `Source:` lines, `Rejected alternatives:`, Legacy Status;
the placeholder-label field removed; links to the former live-flow reference and
`../SKILL.md#core-behavior` removed.

Storage and discovery: the status file at
`<wiki-root>/content/docs/project/grilling/<topic>-grill-status.md`; each
gate exit replaces its own Gate Outcomes entry.

Validation: completion, blocker, skip (`frontier_rerouted`, `guard_failed`),
human checkpoint, and steering exits each write a Gate Outcomes entry;
`Next suggested route` is advisory.

Domain state: handoffs complete.

Next suggested route: `verify-disclosure.md`

Blockers: none

Resume identity: none

## Verify Disclosure Outcome

Phase: verify-disclosure

Status: complete

Scope: Context trace and pointer reachability.

Artifacts: trace `SKILL.md` → `phases/router.md` → one gate (for example
`checkpoint.md`) → `references/artifact-output.md` by link. Siblings stay
unloaded: gates link only `router.md` anchors and references, never a sibling
gate.

Validation: a link check over every Markdown link in the skill, plus the
inbound links from `brainstorm/SKILL.md`
(`artifact-output.md#routed-wiki-contract`) and `flow-lenses/SKILL.md`
(`phases/router.md#altitude-ladder`), reported zero missing files and zero
missing anchors. `wiki-output.md` is reachable from `SKILL.md` and `close.md`.

Domain state: disclosure passes.

Next suggested route: `test-routes.md`

Blockers: none

Resume identity: none

## Test Routes Outcome

Phase: test-routes

Status: complete

Scope: Ten route scenarios plus repair re-tests.

| Scenario | Predicted route (record first) | Derived route (apply contracts) | Match | Repair if mismatch |
|---|---|---|---|---|
| Baseline path: new topic with a Brief | ground → round L1 → answers → checkpoint → round L2 → … → round L3 → checkpoint → close (confirm) → reply confirms and closes → `grill_closed` | row 4, 13, 8, 6, 13, …, 6, 15, 9, 7 → close step 4 | Yes | |
| Branch path: product-only branch has L1 ready; code branch has L2 ready | round at L1 only; code branch waits | Round Selection picks shallowest; row 13 at L1 | Yes | |
| Repair cycle: `$flow-lenses` cannot run in R3 | checkpoint blocked; next round held until it runs | checkpoint `call_failed` writes `flow-lenses: R3 missing`; row 10 before row 13; blocked-restate until new evidence | Yes | |
| Human checkpoint: round R4 presented, user resumes without reply | restate R4 questions, load no gate | row 8 `answers_required` | Yes | |
| Human steering: reply says "now implement it" | terminal until the user redirects | row 6 → checkpoint `human_steering_required` → row 1 until resolved | Yes | |
| Cold resume: transcript lost after checkpoint recorded answers but before its calls | checkpoint resumes at the first missing step | row 8 fails (frontier ids answered); row 10 → checkpoint | Yes | |
| Stale / out-of-scope / invalid: (a) Brief edited after import; (b) two status files match; (c) a grounding anchor path was deleted | (a) ground delta import; (b) one question; (c) ground refresh | (a) row 4 sha256 differs; (b) row 2 `grill_target_unclear`; (c) row 4 anchor no longer resolves | Yes after repair | (c) first derivation found no row for an invalid anchor (Match: No); row 4 now lists it and ground step 8 refreshes it |
| Contradictory suggested route: Gate Outcomes suggests `close`; user message corrects Q7 | checkpoint | row 6; suggestion has priority 4 | Yes | |
| Nested executor substitution: ground facts come from a delegated T3 child instead of an in-process subagent | ground reconciles the report and writes one outcome | ground boundary unchanged; step 9 records the report; router sees one ground outcome | Yes | |
| Premature completion: frontier empty, code branch Settled L2, Target L3 | derive L3, no close | row 12 before row 15; Close Guard also fails | Yes | |
| Repair re-test: compile gap returns to a closed grill | ground records gap, grill reopens | first derivation: row 5 still matched after ground because closure was a bare record (Match: No) | Yes after repair | `Closure` line added (`open`, `closed R<N>`, `reopened R<N>`); ground step 4 and checkpoint step 1 set `reopened`; row 5 reads `closed R<N>` |
| Repair re-test: user answered R5 but `show-me` was never recorded | answers kept; R5 completed through `$show-me` before R6 | first derivation: checkpoint could mark the round line missing and row 10 loops on checkpoint (Match: No) | Yes after repair | checkpoint step 8 leaves an absent round line absent; row 11 sends round, which presents the accepted answers for correction |
| Repair re-test: L3 question derived needs a primitive lookup | ground inspects before the question is asked | first derivation: no row sent ground for a new grounding row (Match: No) | Yes after repair | checkpoint step 6 adds a fact request; row 4 dispatches it; the question waits on the fact |

Validation: all ten rows filled; stale, out-of-scope, and invalid subcases
present; the steering row is distinct from the planned checkpoint row;
repairs appear only on mismatches and were re-derived.

Domain state: routes pass.

Next suggested route: `audit.md`

Blockers: none

Resume identity: none

## Audit Outcome

Phase: audit

Status: complete

Scope: Terminal completeness audit of the converted skill.

Validation:

- Obligations: O1–O25 each reach a state, a gate, and the Close Guard or a
  terminal.
- Determinism: route precedence is first-match over rows 1–16 under the
  authority table; every gate emits only declared exits.
- Cold resume: derives one route from the status file, log, and precision
  inputs (Test Routes rows "Cold resume" and "Human checkpoint").
- Durable handoffs: every exit of every gate writes a Gate Outcomes entry.
- `human_steering_required`: reachable from every gate, durable, router row 1
  until user direction resolves it, distinct from the three planned
  checkpoints.
- Single source of truth: the Altitude Ladder, Round Selection, and Close
  Guard live only in `phases/router.md`; gates link them. Artifact fields
  live only in `references/artifact-output.md`.
- Pointers: link check zero failures; references hold no executable gate
  body.
- No-op test: each gate step changes behavior against the model default
  (Altitude selection, required-call records, Brief no-re-ask, legacy upgrade,
  close guard); restated defaults were not added.
- Structure checks: `phases/` holds exactly `router.md`, `ground.md`,
  `round.md`, `checkpoint.md`, `close.md`; `references/` holds exactly
  `artifact-output.md`, `wiki-output.md`; the plan T3 greps for the removed
  placeholder label and the removed reference file name return nothing;
  `git diff c86912b -- skills/agnostic/requirements/grilling` is empty.
- Validator: no standalone skill validator exists in the skills repo; the
  executable contract test is plan task T7.
- Skill-protocol boundary: written contracts and durable status and log
  evidence. Markdown cannot enforce exclusive writers, ordering, or atomic
  persistence; none of these is a correctness requirement here, because one
  agent session owns one grill at a time.

Domain state: audit-complete.

Next suggested route: none

Blockers: none

Resume identity: none
