# Orchestrator Phase Graph Authoring Handoff

This is the graph-authoring record for the `write-graph-based-skills` Create
run on `orchestrator-phase`. It is separate from the runtime Track Ledger
defined in [references/ledger.md](references/ledger.md).

Authority: the closed grill in `wearedevpunks/harness-intelligence`,
`apps/wiki/content/docs/project/grilling/orchestrator-phase-grill-log.md`
(Q1–Q48 and the R6 module decisions), its status file and brainstorm brief.

Test references are source-repository provenance; reproduce with
`node --test tests/orchestrator-phase-graph.contract.test.mjs`.

## Qualify Outcome

Phase: qualify

Status: complete

Scope: one long-lived AFK Orchestrator over many Track threads; event-driven,
resumable from files.

Artifacts: obligation map below.

| Obligation | Mandatory | Survives interruption | Evidence artifact | Owner | Audit criterion |
| --- | --- | --- | --- | --- | --- |
| Never block on a question tool | yes | yes | SKILL.md AFK | every gate | no gate or brief asks; test checks the ban |
| Route every intake (orchestrate, solo, adopt, Worker) | yes | yes | Ledger Decisions | intake | one decision per request |
| Charter written and shown | yes | yes | `charter.md` | charter | every contract section filled |
| Track graph with dependencies | yes | yes | Ledger Tracks | split | no cycle |
| Every Track briefed and start-checked | yes | yes | Ledger Tracks, Start check result | spawn, listen | `spawned` then started or `stalled` |
| Delivery starts once | yes | yes | Ledger state written first | listen | repeat "grill closed" is a no-op |
| Only the reported commit merges, squash | yes | yes | merge commit per Track | merge | head equals reported commit |
| Human Gates hold only their own work | yes | yes | Needs-you items | merge, ship | gated work waits; others move |
| No overlapping deploys per target | yes | yes | guard output | ship | guard run before each deploy |
| Landing verified on the live target | yes | yes | Worker verdict | verify | one of three methods recorded |
| Go solo and reopen | yes | yes | Ledger Run state | intake, settle, solo, reopen | invariant evidence recorded |
| Host tools named only in the Host binding | yes | n/a | `references/hosts.md` | skill | test greps every other file |

Domain state: graph authoring selected; no direct-composition exception.

Next suggested route: model-state.

Blockers: none

Resume identity: none

## State Model Outcome

Phase: model-state

Status: complete

Scope: run states `open`, `solo`, `closed`; Track states and side states in
the Ledger contract; gates Intake, Charter, Split, Spawn, Listen, Merge,
Ship, Verify, Settle, Solo, Reopen.

Artifacts: `references/ledger.md` state list; `phases/router.md`.

Validation: every Track state has exactly one gate that moves it forward;
Listen is the steady state and the only event consumer.

Domain state: graph layer: Listen ⇄ Merge, Ship, Verify (repair cycle:
verification failure returns the Track to `delivering`); Settle → Solo (skip
path); Solo → Reopen (re-entry); human checkpoint is the `gated` Needs-you
item; human steering terminal only when every live Track waits on access.

Next suggested route: define-authority.

Blockers: none

Resume identity: none

## Authority Outcome

Phase: define-authority

Status: complete

Scope: current event, then Ledger and Charter with live PR and deploy state,
then the latest Events line, then any suggested route. Tie-break: newest send
time; otherwise blocked `ledger_conflict`.

Artifacts: `phases/router.md` Inputs And Authority.

Domain state: Track lines are judged by send time, never arrival order.

Next suggested route: write-router.

Blockers: none

Resume identity: none

## Router And Phases Outcome

Phase: write-router, write-phases

Status: complete

Scope: `SKILL.md` bootstrap; `phases/router.md` with 16 precedence rows;
eleven flat gates, each with the nine gate sections in order.

Artifacts: `SKILL.md`, `phases/*.md`.

Validation: every router row names one flat gate or one terminal,
checkpoint or blocked outcome; every gate links its Durable Handoff to the
Track Ledger contract.

Next suggested route: define-handoffs.

Blockers: none

Resume identity: none

## Handoff Outcome

Phase: define-handoffs

Status: complete

Scope: the Track Ledger is the runtime handoff: one Events line per gate exit,
section rows for state; the Charter holds rules.

Artifacts: `references/ledger.md`, `references/charter.md`.

Next suggested route: verify-disclosure.

Blockers: none

Resume identity: none

## Disclosure Outcome

Phase: verify-disclosure

Status: complete

Validation: a turn loads `SKILL.md`, the router, the Ledger and Charter
contracts, and one gate; the brief, report and Host binding load only from the
gates that use them.

Next suggested route: test-routes.

Blockers: none

Resume identity: none

## Route Matrix

| Scenario | Predicted route | Derived route | Match | Repair if mismatch |
| --- | --- | --- | --- | --- |
| Baseline path | intake → charter → split → spawn → listen → merge → ship → verify → settle | rows 4, 8, 9, 10, 11, 12, 13, 14, 15 | Yes | |
| Branch path: work fits one scope | intake → solo | rows 4, 7 | Yes | |
| Repair cycle: verification fails | verify → listen → merge (new ready) | `verification_failed` sends the defect; the Track's next "ready" enters rows 11, 12 | Yes | |
| Human checkpoint: functional PR | merge `gated`; human reply → listen → merge | rows 12, 11, 12 | Yes | |
| Human steering terminal | every live Track waits on access | row 1 terminal until the reply supplies access | Yes | |
| Cold resume | router from Ledger and Charter only | rows 4–16 need no transcript | Yes | |
| Stale, out-of-scope or invalid artifact | a "ready" line whose PR head moved | Listen `stale_event` or `in_review`; merge waits | Yes | |
| Contradictory suggested route loses to evidence | Events `next: ship`, Track still `ready` | row 12 merge | Yes | |
| Nested executor substitution | a Worker runs the Start check or the verification | the gate keeps the verdict and Ledger write | Yes | |
| Premature completion rejected by terminal guard | close the run with a Track `shipped` | row 14 verify before Settle closes the run | Yes | |

## Audit Outcome

Phase: audit

Status: complete

Validation: every mandatory obligation maps to a gate and an evidence
artifact; every exit writes the Ledger; `human_steering_required` keeps its
terminal and resumption condition; `node --test
tests/orchestrator-phase-graph.contract.test.mjs` passes.

Next suggested route: none

Blockers: none

Resume identity: none
