# Design Handoff Contract

One durable design handoff holds the state the router cannot rebuild from the
repository: gate outcomes, the route trace, the round counter, Verdicts, the
Motion Plan, the artifact index, and approved artifact contracts. The router
reads it on every entry, including cold resume.

## Location

- One file per design target, beside `SPEC.md` in the resolved spec folder:
  `<resolved-specs-root>/<domain>/<folder-name>/DESIGN-HANDOFF.md`. The file
  name is illustrative; once a run writes it, keep it.
- Resolve the root, domain, and folder with `create-spec`'s
  `references/folder-naming.md`. When no `SPEC.md` exists yet, reserve the
  folder as `create-architecture` does for `ARCHITECTURE.md`: create the folder
  and the handoff, and leave `SPEC.md` absent.
- Images and screenshots become durable through `repo-asset-management`.
  A local path is pending evidence until it has a durable link or a recorded
  upload blocker.

## Discovery

1. When the request names a spec folder or `SPEC.md`, use the handoff in that
   folder.
2. Otherwise search `<resolved-specs-root>/*/*/DESIGN-HANDOFF.md` for a Design
   Target whose scope units or routes match the request. Exactly one match is
   the handoff. No match means a new handoff. Several matches are router
   blocked `design_target_unclear`.
3. Inside the file, the latest applicable outcome of a gate is the last entry
   for that gate in Gate Outcomes. The ledger sections hold current state.

## File Layout

Sections, in this order:

1. `## Design Target`: spec folder, surface (`web` | `expo`), existing-UI
   intent, scope units with real routes, working branch, target app root.
   Written by intake.
2. `## Round State`: the round counter, then one block per round: start time
   and source (first round, Verdict, or change request); each variant's id,
   name, divergence axis, `?variant=` URL, and build identity; quality results
   per check per build; "Decisions for you"; the Verdict with the user's words;
   superseded or dropped status. Written by variant-round, quality-gate, and
   verdict.
3. `## Motion Plan`: one table per Composition, with columns entry id,
   location, opportunity, suggested motion, state, round, variant ids,
   evidence.
4. `## Artifact Index`: one row per artifact, with columns artifact, kind,
   scope unit, local path, durable link or upload blocker, produced by,
   fresh against, accepted (user words and time, or n/a).
5. `## Approved Artifact Contracts`: one block per promoted scope unit.
   Written by promote.
6. `## Route Trace`: one row per router output, with columns timestamp,
   output, evidence, rejected alternatives. Written by the router.
7. `## Gate Outcomes`: append-only gate outcome entries.

## Gate Outcome Schema

```text
Gate:
Status: complete | checkpoint | blocked | human_steering_required
Exit:
Recorded at:
Scope:
Artifacts:
Validation:
Design state:
UI Evidence:
Next suggested route:
Blockers:
Resume identity:
```

- `Exit` is one declared exit of the gate.
- `Design state` is this workflow's domain-state field: round number, Verdict,
  Motion Plan transitions, checkpoint decision pending.
- `UI Evidence` lists durable links; omit it when the gate made no visual.
- `Next suggested route` is advisory and has the lowest authority.
- `Resume identity` holds only what the repository cannot rebuild: the open
  round number and variant ids, an image task's `taskId` and
  `clientRequestId`, the image attempt number, the promote commit SHA.
- A `checkpoint` entry names the decision asked and the links shown.
- A `blocked` entry names the missing evidence or failed check.

Every declared exit of every gate writes one entry. The router writes Route
Trace rows; it writes no gate outcome.

## Human Steering

A `human_steering_required` entry records the blocker, the evidence, the
proposed action, and the required decision, then the gate stops. The router
returns terminal `human_steering_required` until current user direction
answers that decision; then the gate that recorded it runs again.

## Motion Plan States

`proposed → accepted → built → verified`, each with one writer:

- `motion-plan` writes `proposed` and `accepted`. A changed Composition
  returns its entries to `proposed`.
- `variant-round` writes `built` with the round number and variant ids. A new
  round sets every `accepted`, `built`, or `verified` entry it implements to
  `built` for that round.
- `quality-gate` writes `verified` per variant after the conformance check.

## Approved Artifact Contract

Each approved artifact set covers one user-visible scope unit and holds:

- scope unit
- artifact intent: Design-Owned UI Code on the named route
- artifact links or files: the Brand Kit, Compositions, and screenshots of the
  promoted route
- durable visual asset links when available
- evidence summary
- accepted constraints
- implementation notes
- acceptance checks
- staleness risks
- promote commit SHA and its Design-Owned UI Code file list
- the kept variant (round and id) and the dev-only fixture and toggle location
