# Design Router

Load this file on every invocation and re-entry. Recompute one route from
current evidence; transcript continuity and a recorded route suggestion are
never required.

Load [the design handoff contract](../references/design-handoff.md). Discover
the design handoff by its discovery rule before applying route precedence.
When the target resolves and no handoff exists, create it there with its
Design Target section.

## Inputs And Authority

Inspect, in authority order:

1. current direct evidence: the user's current message (request, checkpoint
   reply, verdict, steering answer, visual change request), the repository
   (routes, `components.json`, DESIGN.md, theme files, working-branch diff,
   `git log`), and the running app;
2. fresh workflow-native artifacts: Brand Kit boards, DESIGN.md and the
   applied theme, Compositions, the Motion Plan, variant code behind
   `?variant=`, quality results, the promote commit;
3. committed design handoff entries, including the round counter;
4. any suggested route.

Evidence is eligible only when it is in scope (the resolved spec folder and
its scope units), fresh under the staleness rules, and valid (files exist,
durable links resolve, commits are reachable). Higher authority wins. At the
same authority, prefer the most advanced state whose complete predecessor
evidence is valid; any other same-authority conflict is blocked
`design_state_conflict`.

## Staleness Rules

Treat evidence as stale when scope, route, theme, component, content, brand
constraints, accepted constraints, verdict, backlog ids, or target surface
changed after it was produced.

Treat visual artifacts as stale when screenshots, design inputs, Brand Kit
boards, Compositions, durable asset links, or variant code no longer match
current code, accepted constraints, or user-visible scope. In particular:

- DESIGN.md and the theme are stale when the Brand Kit or intake brand
  evidence changes.
- Compositions of a scope unit are stale when DESIGN.md changes or a request
  changes that scope unit's layout.
- A Motion Plan is stale when its Composition changes or user direction
  changes which motion is wanted.
- An open round is stale when its Compositions, DESIGN.md, or Motion Plan
  changed after the round started.

## Re-entry Rule

A later visual change re-enters here, never outside the design flow. When the
change alters a scope unit's layout, mark that unit's Compositions stale, and
the precedence below selects `compose`. Otherwise the change makes a new round
due, and the precedence selects `variant-round`. A `reject` Verdict reason
follows the same rule.

## Route Precedence

Evaluate top to bottom and return the first matching row. Return only its one
output.

| Priority | Current evidence | Output |
| --- | --- | --- |
| 1 | Durable `human_steering_required` with a recorded decision that current user direction does not resolve | terminal `human_steering_required` |
| 2 | Design goal, target surface, or spec folder unresolved, or several design handoffs match the request | blocked `design_target_unclear` |
| 3 | Same-authority admissible evidence conflicts and no tie-break above resolves it | blocked `design_state_conflict` |
| 4 | A brand, compose, or verdict checkpoint is pending with fresh inputs, and current evidence holds no reply to it | checkpoint `brand_acceptance_required`, `composition_acceptance_required`, or `verdict_required` |
| 5 | Current evidence holds the user's reply to a pending checkpoint | the gate that owns that checkpoint: [`brand.md`](brand.md), [`compose.md`](compose.md), or [`verdict.md`](verdict.md) |
| 6 | Intake evidence is missing, low-confidence, or stale | [`intake.md`](intake.md) |
| 7 | Accepted constraints are missing or conflict with evidence | [`grill.md`](grill.md) |
| 8 | No fresh accepted Brand Kit and no fresh brand artifacts recorded by intake | [`brand.md`](brand.md) |
| 9 | DESIGN.md or the applied theme is missing or stale | [`design-system.md`](design-system.md) |
| 10 | A scope unit lacks fresh accepted Compositions | [`compose.md`](compose.md) |
| 11 | An accepted Composition lacks a fresh Motion Plan with every entry decided | [`motion-plan.md`](motion-plan.md) |
| 12 | The open round has an unbuilt or failing variant, or is stale; or no round is open and none exists yet, the last Verdict is `riff`, `combine`, or `reject`, or a fresh visual change request makes a new round due | [`variant-round.md`](variant-round.md) |
| 13 | The open round is fully built and a variant lacks a quality result for its current build | [`quality-gate.md`](quality-gate.md) |
| 14 | Every variant of the open round has a passing latest quality result and the round has no Verdict | [`verdict.md`](verdict.md) |
| 15 | A `keep` Verdict is recorded and no promote commit exists for that variant | [`promote.md`](promote.md) |
| 16 | A fresh promote commit and approved artifact contract exist, and no fresh backlog outcome is recorded for that commit | [`backlog.md`](backlog.md) |
| 17 | The latest fresh backlog outcome for the promote commit is `requirements_phase_return` | terminal `requirements_phase_return` |
| 18 | Backlog identities link the promote commit and the delivery brief is missing or stale | [`delivery-handoff.md`](delivery-handoff.md) |
| 19 | A fresh delivery brief is recorded | terminal `design_complete` |

Row 8 is the brand skip: when intake recorded fresh brand artifacts, write a
route-trace row naming them as the reason `brand` was skipped, then continue
evaluation.

Before loading a selected gate, read its latest outcome. When it is `blocked`
and current evidence adds nothing that resolves the recorded blocker, return
that blocked outcome and stop instead of loading the gate. For
`image_generation_pending`, first read the recorded `taskId` with
`task_status`: a finished task is new evidence, so load the gate.

## Route Trace

Every output above, including terminals, checkpoints, blocked outcomes, and
the brand skip, appends one Route Trace row to the design handoff: timestamp,
output, evidence, and rejected alternatives. On cold resume, read the round
counter and the open round from the handoff's Round State before row 12.

## Router Outputs

- terminal: `human_steering_required` (restate the recorded decision),
  `requirements_phase_return` (tell the user that `$requirements-phase` owns
  the next step), `design_complete` (report completion with route-trace
  evidence).
- checkpoint: restate the pending decision and its durable links, then stop.
- blocked: `design_target_unclear` asks one concrete question;
  `design_state_conflict` names the conflicting evidence; a restated gate
  blocker names the missing evidence.
- gate: load exactly that flat phase file; sibling gates stay outside the
  current trace.
