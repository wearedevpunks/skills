# Finder Graph Authoring Handoff

Mode: Convert the former chart/work lifecycle into the accepted Fog-child graph.

## Obligation Map

| Obligation | Mandatory | Survives interruption | Evidence artifact | Owner | Audit criterion |
| --- | --- | --- | --- | --- | --- |
| Explicit human invocation | yes | yes | both `SKILL.md` files and OpenAI metadata | engine and wrapper | invocation flags agree |
| One exact Fog | yes | yes | durable wiki identity, provider readback | ensure gate | create/resume cardinality is one |
| One Business child | yes | yes | child identity and Stage readback | Business gate | ambiguity produces zero writes |
| Deterministic resume | yes | yes | router, runtime handoff, provider snapshot | router | one route from current evidence |
| Business decision depth | yes | yes | immutable resolution pointer | Business gate | atomic grill settles placement without technical policy |
| Support cycles | yes | yes | Research/Prototype child and immutable evidence | support gates | support returns to its named grilling child |
| Provider mutation boundary | yes | yes | semantic intent plus exact readback | reconciliation | all physical writes route through `write-backlog` |
| Exact target return | yes | yes | `target_depth_reached` handoff | return gate | chosen depth returns without Fog completion |

Survivor artifacts: stable wiki/provider Fog identities, exact child identities,
immutable resolution pointers, provider snapshots/readbacks, support evidence,
checkpoints, blockers, target depth, and terminal state.

## Phase: qualify

Status: complete

Scope: Finder engine and Business wrapper conversion.

Artifacts: obligation map and survivor list above.

Validation: The engine is multi-step, resumable, cyclic, and repairable, so the
graph is mandatory. Only the three audience wrappers qualify for direct
composition because each supplies one target/profile call into the graph and
owns no resumable action.

Domain state: All T2 obligations have an owner, evidence artifact, and audit
criterion.

Next suggested route: `model-state.md`

Blockers: none

Resume identity: canonical source tree at current working revision

## State Model

| State | Scope | Entry guard | Exit guard | Next |
| --- | --- | --- | --- | --- |
| Fog absent | invocation | no exact readback | one exact Fog read back | Business or handback |
| Business active | one Fog | Business evidence missing/invalid | accepted pointer plus intent | support, reconcile, checkpoint, handback |
| Support active | named grilling child | precise support unknown | immutable report or verdict | reconcile or handback |
| Stage accepted | one stage | immutable evidence exists | exact projection readback | target return or next depth |
| Functional active | one Story intent | target includes Functional | accepted pointer plus intent | support, reconcile, handback |
| Technical active | one Story | target is Technical | accepted pointer plus intent | support, reconcile, handback |
| Target reached | invocation | all target evidence/readback fresh | durable return written | terminal return |
| Human steering | conflict | admissible evidence cannot resolve | `$handback` guard passes | terminal or router re-entry |

Graph forms: baseline depth path, target-depth branches, Research/Prototype
cycles, accepted-stage reuse skips, structural approval checkpoint, blocked
readback exit, and terminal handback are represented. Current evidence carries
freshness, scope, identity, and validity guards.

## Phase: model-state

Status: complete

Scope: Runtime evidence states and topology.

Artifacts: `references/state-graph.md`, router precedence, state table above.

Validation: Every obligation reaches an evidence-backed state; every gate can
reach `human_steering_required`; target return remains distinct from Fog
completion.

Domain state: No conversational-progress state is authoritative.

Next suggested route: `define-authority.md`

Blockers: none

Resume identity: exact Fog wiki/provider identity when available

## Phase: define-authority

Status: complete

Scope: Evidence admissibility and route tie-breaks.

Artifacts: `references/state-graph.md#evidence-authority` and
`phases/router.md#route-precedence`.

Validation: Current direct evidence outranks fresh workflow-native artifacts,
which outrank the committed runtime handoff and suggested route. Human steering,
identity conflict, Fog ensure, scope checkpoint, support, stage work,
reconciliation, and target return have one declared precedence order. Stale,
invalid, ambiguous, or out-of-scope evidence satisfies no positive gate.

Domain state: All known overlaps resolve to one route; conflicting accepted
identity routes to zero-write handback.

Next suggested route: `write-router.md`

Blockers: none

Resume identity: current provider snapshot plus runtime handoff

## Phase: write-router

Status: complete

Scope: Finder bootstrap and runtime route selection.

Artifacts: `SKILL.md`, `phases/router.md`, and
`scripts/finder-contract.mjs`.

Validation: Root contains bootstrap/pointers only. Router recomputes on cold
resume, returns one gate/checkpoint/blocked/terminal outcome, names only flat
phase files, and preserves the handback terminal. Human-only metadata remains
unchanged.

Domain state: Eleven required route classes plus identity-conflict variants are
covered by the route fixture.

Next suggested route: `write-phases.md`

Blockers: none

Resume identity: current target depth and Fog snapshot

## Phase: write-phases

Status: complete

Scope: Ten flat executable Finder gates.

Artifacts: `phases/ensure-fog.md`, `adopt-business-path.md`, `business-grilling.md`,
`functional-grilling.md`, `technical-grilling.md`, `research.md`,
`prototype.md`, `reconcile.md`, `return-target.md`, and `handback.md`.

Validation: Every gate declares entry guard, inputs, bounded action, invariants,
completion evidence, exits, and durable handoff. Narrow executors return to the
owning gate for reconciliation. Handback invokes `$handback` and persists only
its declared terminal or guard-passed re-entry.

Domain state: No executable gate body remains in root or references.

Next suggested route: `define-handoffs.md`

Blockers: none

Resume identity: gate outcome plus exact evidence identities

## Phase: define-handoffs

Status: complete

Scope: Runtime persistence and discovery.

Artifacts: `references/runtime-handoff.md` plus every gate's durable-handoff
section.

Validation: The schema preserves phase, status, scope, artifacts, validation,
Finder state, optional UI evidence, suggestion, blockers, and resume identity.
The durable wiki Fog identity discovers the record before provider creation;
stable provider identity joins it after readback. Every declared exit writes a
checkpoint, blocker, skip, target return, or human-steering outcome.

Domain state: Suggestions remain advisory and current evidence can supersede
them. The handoff retains only exact identities/pointers and irreducible route
state.

Next suggested route: `verify-disclosure.md`

Blockers: none

Resume identity: durable wiki Fog identity

## Phase: verify-disclosure

Status: complete

Scope: Bootstrap-to-gate context trace.

Artifacts: Root pointers, router links, flat phase files, and three shared
runtime references.

Validation: Business trace loads `business-finder/SKILL.md` -> Finder bootstrap
-> entrypoint contract and router -> exactly `business-grilling.md`; sibling
gates remain unloaded. Every root/router pointer resolves. References contain
state, handoff, and entry contracts only. No old chart/work pointer remains.

Domain state: Branch-specific execution stays behind the selected gate pointer.

Next suggested route: `test-routes.md`

Blockers: none

Resume identity: current target artifact set

## Phase: test-routes

Status: complete

Scope: Runtime route matrix.

Artifacts: `tests/fixtures/finder-phase-routes.json`,
`scripts/finder-contract.mjs`, and `tests/finder-phase-graph.contract.test.mjs`.

Validation: Predictions and derivations match for baseline Fog ensure, Business
branch, Research executor cycle, reconciliation repair, structural checkpoint,
handback terminal, cold resume, stale/invalid/out-of-scope evidence,
contradictory suggestion, and premature completion rejection. The planned
checkpoint remains distinct from human steering. The out-of-scope case first
failed as target return, then was repaired to reject inadmissible evidence.

Domain state: Route fixture contains expected route before the executable
contract derives it; every row matches after the recorded repair.

Next suggested route: `audit.md`

Blockers: none

Resume identity: route fixture and current script revision

## Phase: audit

Status: complete

Scope: Terminal graph-authoring audit.

Artifacts: Finder engine, Business wrapper, runtime references, route contract,
fixtures, and focused contract tests.

Validation: All mandatory obligations, route precedence, cold resume, pointers,
gate exits, handoffs, target-depth return, and human-steering authority guard
pass. `node --test tests/finder-phase-graph.contract.test.mjs
tests/wayfinder-lifecycle.contract.test.mjs` passes 35/35. `git diff --check`
passes. No separate skill validator exists in this canonical repository.

Domain state: Audit complete. The no-op pass removed the old chart/work map,
Fog-graduation rules, placement classification, and duplicate convergence
reference. Remaining instructions change cardinality, evidence, routing,
presentation, mutation-boundary, or terminal behavior.

Next suggested route: audit-complete terminal

Blockers: none

Resume identity: current canonical source working revision
