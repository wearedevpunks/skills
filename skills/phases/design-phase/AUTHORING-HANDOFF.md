# Design Phase Graph Authoring Handoff

This is the graph-authoring record for the `write-graph-based-skills` Convert
run on `design-phase`. It is separate from the runtime design handoff defined
in [references/design-handoff.md](references/design-handoff.md).

Authority: spec `apps/wiki/content/docs/project/specs/cli/design-phase-redesign/SPEC.md`
and sibling `ARCHITECTURE.md` in `wearedevpunks/harness-intelligence` at commit
`693b1485a1ada17bd842bdb63f6e4e0a672b065d` (OUT-001..OUT-010, AC-001..AC-013,
AC-015), grill log Q1–Q28 and Glossary Q29, and the design-phase redesign
glossary.

Test references below are source-repository provenance. The installed package
omits the source repository test files; reproduce a claim from the immutable
source commit with `node --test tests/design-phase-graph.contract.test.mjs`.

## Router Selections

Phase: router

Status: complete

Scope: Recompute the authoring route on every re-entry of this Convert run.

Artifacts: the target `SKILL.md`, flat `phases/`, `references/`, and this
record, as each existed at the time of each selection.

Validation and selections, in order:

1. First entry: `SKILL.md` held a linear seven-phase router with `approval.md`
   and `prototype.md`; no authoring record existed; the accepted spec adds
   obligations the old bounds do not hold. Selected `qualify.md`.
2. Obligation map complete; no state model. Selected `model-state.md`.
3. State model complete; transition authority and overlap tie-breaks absent.
   Selected `define-authority.md`.
4. Authority complete; target root still executable and router linear.
   Selected `write-router.md`.
5. Router written; nine new gate files missing and `approval.md`,
   `prototype.md` present. Selected `write-phases.md`.
6. Gates written; runtime handoff contract named by every gate but not yet
   written. Selected `define-handoffs.md`.
7. Handoff contract written; disclosure trace unverified. Selected
   `verify-disclosure.md`.
8. Disclosure passes; route matrix absent. Selected `test-routes.md`.
9. Route matrix complete with two repairs re-tested. Selected `audit.md`.

Domain state: every selection cited current files; no overlap required a
tie-break beyond the authoring router's earliest-missing order.

Next suggested route: see the latest phase entry below.

Blockers: none

Resume identity: none; current target artifacts reconstruct each selection.

## Qualify Outcome

Phase: qualify

Status: complete

Scope: Bound the converted workflow and record its mandatory obligations and
survivor artifacts.

Artifacts: the obligation map below.

| Obligation | Mandatory | Survives interruption | Evidence artifact | Owner | Audit criterion |
|---|---|---|---|---|---|
| O1 Explicit-only invocation | yes | yes | `SKILL.md` frontmatter, `agents/openai.yaml` | write-router | `disable-model-invocation: true`; `allow_implicit_invocation: false` |
| O2 One route per entry from current evidence, including cold resume | yes | yes | `phases/router.md`, design handoff | router | every legal state maps to one precedence row |
| O3 Intake: surface, existing-UI intent, routes, `components.json`, DESIGN.md, theme, brand artifacts, screenshots, confidence | yes | yes | Design Target section, intake outcome | intake | low-confidence rule kept; every field recorded |
| O4 Lean constraints through `requirements-grill` | yes | yes | grill outcome | grill | delegation and lean scope kept |
| O5 Brand Kit accepted by the user, or brand skipped on fresh brand artifacts | yes | yes | Artifact Index, brand outcome, route-trace skip row | brand, router | acceptance only from explicit user words |
| O6 DESIGN.md in Stitch format, shadcn Steps 3–7 in the existing app or NativeWind theme, browser check, no user stop | yes | yes | DESIGN.md, theme files, design-system outcome | design-system | no `--template`; no checkpoint exit |
| O7 Compositions per scope unit, both imagegen skills by default, brief carries DESIGN.md + directive + copy lens, user accepts | yes | yes | Artifact Index, compose outcome | compose | both references appended to every brief |
| O8 Codex image ladder or a visible blocked outcome | yes | yes | gate outcome, Artifact Index | brand, compose | one reference; no code or HTML fallback |
| O9 Motion Plan ledger `proposed → accepted → built → verified` | yes | yes | Motion Plan section | motion-plan, variant-round, quality-gate | each state has one writer |
| O10 Variants on the real route behind a dev-only `?variant=` switch; 3 default, cap 5; named axes; mobile and desktop widths; agreed skill set | yes | yes | Round State, working-branch code | variant-round | no standalone HTML, prototype branch, or isolated route |
| O11 Round counter persists for cold resume | yes | yes | Round State | variant-round | increments once per new round |
| O12 Five Quality Gate checks per variant; only passing variants reach the Verdict | yes | yes | Round State quality results | quality-gate | pass/fail per check per variant |
| O13 Verdict from explicit user words; `keep` is the approval | yes | yes | Round State verdict | verdict | four routes; no inferred approval |
| O14 Promote: full break-ui pass, rewrite in place, remove switch, fixtures dev-only, commit, contract | yes | yes | promote commit, Approved Artifact Contracts | promote | pass definition from Q21 |
| O15 Backlog linkage or Requirements Phase return | yes | yes | backlog outcome | backlog | current rules kept; promote commit linked |
| O16 Delivery brief names the promote commit and the delivery boundary; stop for explicit `$delivery-phase` | yes | yes | delivery-handoff outcome | delivery-handoff | brief fields complete |
| O17 Durable design handoff beside `SPEC.md`; images through `repo-asset-management` | yes | yes | `DESIGN-HANDOFF.md` | every gate | location and discovery rule explicit |
| O18 `human_steering_required` terminal | yes | yes | gate outcome | every gate | reachable, durable, distinct from checkpoints |
| O19 Later visual change re-enters at `compose` on layout change, else `variant-round` | yes | yes | route trace, router row | router | rule in one place |
| O20 Route trace on every selection | yes | yes | Route Trace section | router | timestamp, output, evidence, rejected alternatives |

Survivor artifacts: the design handoff; Brand Kit images; DESIGN.md and theme
edits; Compositions; the Motion Plan; variant code on the working branch;
quality results; verdicts; the promote commit; approved artifact contracts;
backlog identities; the delivery brief.

Validation:

- Every obligation has an owner, evidence artifact, and audit criterion.
- Preserved from the current skill: intake fields and low-confidence rule,
  lean `requirements-grill` delegation, staleness rules, route trace, backlog
  rules, approved artifact contract fields, "approval is never inferred from
  artifact existence", and the explicit `$delivery-phase` stop.
- Removed per Q1, Q2, Q5, Q13: `approval.md`, `prototype.md`, Matt's
  `$prototype`, standalone HTML, `prototype/<slug>` branches, isolated
  prototype routes, and the image fallback to `$prototype`.
- The workflow has thirteen interacting gates, three human checkpoints, and
  two cycles. Direct composition does not apply. Graph authoring selected.

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
| target_unresolved | Goal, surface, or spec folder unknown, or several handoffs match | request | no resolvable target | one target resolved | intake_due |
| intake_due | Intake evidence missing, low-confidence, or stale | spec folder | no fresh intake outcome | fresh intake with confidence ≥ medium | grill_due, intake_blocked |
| grill_due | Accepted constraints missing or conflicting | scope units | no fresh constraints | constraints accepted | brand_due, design_system_due |
| brand_due | No fresh Brand Kit and no fresh brand artifacts | spec folder | as stated | boards presented | brand_pending_answer, image_blocked |
| brand_pending_answer | Boards presented, answer not recorded | spec folder | brand checkpoint written | answer recorded | design_system_due, brand_due |
| design_system_due | DESIGN.md or theme missing or stale | target app | as stated | checks pass | compose_due |
| compose_due | A scope unit lacks fresh accepted Compositions | scope unit | as stated | Compositions presented | compose_pending_answer, image_blocked |
| compose_pending_answer | Compositions presented, answer not recorded | scope units | compose checkpoint written | answer recorded | motion_plan_due, compose_due |
| motion_plan_due | An accepted Composition lacks a decided Motion Plan | Composition | as stated | every entry decided | round_due |
| round_due | No open round and a new round is due, or the open round is stale | scope unit | as stated | round N started | round_building |
| round_building | Open round with an unbuilt or failing variant | round N | round started or quality failure | every variant built | quality_due |
| quality_due | Open round built; a variant lacks a current quality result | round N | as stated | every variant checked | verdict_due, round_building |
| verdict_due | Every variant passes; no verdict | round N | as stated | checkpoint written | verdict_pending_answer |
| verdict_pending_answer | Round presented, verdict not recorded | round N | verdict checkpoint written | verdict recorded | round_due, promote_due, router re-derivation |
| promote_due | `keep` recorded; no promote commit for it | kept variant | as stated | commit and contract written | backlog_due, human_steering_required |
| backlog_due | Promote commit fresh; backlog linkage missing or stale | spec | as stated | linkage or return recorded | delivery_handoff_due, requirements_phase_return |
| requirements_phase_return | Scope needs new Stories or Tasks | spec | backlog return recorded | fresh backlog identities | backlog_due |
| delivery_handoff_due | Backlog linked; brief missing or stale | spec | as stated | brief presented | design_complete |
| design_complete | Fresh brief presented | spec | as stated | later visual change | compose_due, round_due |
| human_steering_required | Unresolved human decision or out-of-scope action | gate | durable steering record | user direction resolves it | gate that recorded it |
| gate_blocked | Gate blocked without new resolving evidence | gate | blocked outcome | new evidence | that gate |
| state_conflict | Same-authority evidence conflict without tie-break | spec folder | as stated | conflict resolved | re-derived |

### Gate Table

| Gate ID | Entry guard | Actor-like gate boundary owner | Internal delegation policy | Reconciliation rule | Outputs | Exit semantics | Durable handoff |
|---|---|---|---|---|---|---|---|
| intake | intake_due | intake | none | n/a | Design Target, evidence summary | complete, blocked, steering | gate outcome |
| grill | grill_due | grill | `requirements-grill` | gate records accepted constraints | constraints by scope unit | complete, blocked, steering | gate outcome |
| brand | brand_due, brand_pending_answer | brand | `brandkit` brief; Codex image ladder | gate verifies returned files | Brand Kit | checkpoint, complete, blocked, steering | Artifact Index + outcome |
| design-system | design_system_due | design-system | `shadcn` skill | gate runs browser checks | DESIGN.md, theme | complete, blocked, steering | outcome |
| compose | compose_due, compose_pending_answer | compose | imagegen skills; Codex image ladder | gate verifies returned files | Compositions | checkpoint, complete, blocked, steering | Artifact Index + outcome |
| motion-plan | motion_plan_due | motion-plan | `find-animation-opportunities` | gate decides acceptance | Motion Plan entries | complete, blocked, steering | Motion Plan + outcome |
| variant-round | round_due, round_building | variant-round | `prototype-variants` and craft skills | gate checks both widths | variants, round record | complete, blocked, steering | Round State + outcome |
| quality-gate | quality_due | quality-gate | `break-ui`, `mobile-native`, `review-animations` | gate records per-check result | quality results | complete (two exits), blocked, steering | Round State + outcome |
| verdict | verdict_due, verdict_pending_answer | verdict | none | n/a | Verdict | checkpoint, four verdict exits, steering | Round State + outcome |
| promote | promote_due | promote | `break-ui`, `prototype-variants` | gate runs full pass and final checks | commit, contract | complete, blocked, steering | contract + outcome |
| backlog | backlog_due | backlog | `repo-asset-management` | gate verifies identities | backlog linkage | complete (two exits), blocked, steering | outcome |
| delivery-handoff | delivery_handoff_due | delivery-handoff | none | n/a | delivery brief | complete, blocked, steering | outcome |

### Graph Layer

| Path | Branch condition | Cycle target | Skip condition | Checkpoint condition |
|---|---|---|---|---|
| FLOW-001 baseline | surface web or Expo (design-system, variant-round) | n/a | grill when constraints fresh | brand, compose, verdict |
| Brand | change request | brand (new attempt) | fresh brand artifacts from intake | boards presented |
| Compose | user names one surface | compose (new attempt) | n/a | Compositions presented |
| Variant loop | riff, combine, keep, reject | variant-round (new round on riff/combine; same round on quality failure) | `mobile-native` on Expo | verdict |
| Reject / later change | layout change | compose; else variant-round | n/a | n/a |
| Promote | open break-ui decisions | promote after steering resolves | n/a | none (steering terminal, not a checkpoint) |
| Backlog | new Stories or Tasks needed | backlog after Requirements Phase | n/a | n/a |

Validation:

- Every state has scope, entry guard, exit guard, and next states.
- Every obligation O1–O20 maps to a reachable state: O3 intake_due; O4
  grill_due; O5 brand states; O6 design_system_due; O7 compose states; O8
  brand/compose blocked exits; O9 motion_plan_due, round_building,
  quality_due; O10–O11 round states; O12 quality_due; O13 verdict states; O14
  promote_due; O15 backlog_due; O16 delivery_handoff_due; O17 every gate exit;
  O18 human_steering_required; O19 design_complete and verdict re-derivation;
  O20 every router output.
- Human checkpoints are exactly brand, compose, verdict (Q28). Intake
  low-confidence questions and the router's target question are blocked
  outcomes; open break-ui decisions at promote use the steering terminal.

Domain state: authoring decisions not made by the grill, recorded here as the
minimum operational rules the graph needs:

- D1 Checkpoint answers record before staleness: a reply to a pending
  checkpoint routes to its gate first, so a reject reason never leaves a round
  without a verdict.
- D2 A quality failure repairs within the same round; the counter increments
  only when a new round starts (Q4, architecture "Idempotency and retries").
- D3 A failing check that a repair cannot fix ends in
  `human_steering_required`, so the repair cycle is bounded by a human
  decision instead of an invented retry budget.
- D4 Motion Plan acceptance is a motion-plan gate check against the accepted
  Composition, DESIGN.md, and constraints; it adds no human checkpoint (Q28).
- D5 "Light" break-ui is one worst-case dataset at 375px and 1280px;
  "full" is the complete break-ui workflow. The Q21 pass definition applies
  to the full pass.
- D6 Open break-ui "Decisions for you" go to the user at the verdict and, if
  still open at promote, through `human_steering_required`.
- D7 Generated images are written to an illustrative
  `.devpunks/design-phase/<folder-name>/` path and are pending evidence until
  `repo-asset-management` returns durable links.

Next suggested route: `define-authority.md`

Blockers: none

Resume identity: none

## Define Authority Outcome

Phase: define-authority

Status: complete

Scope: Evidence authority, admissibility, overlap precedence, tie-breaks.

Artifacts: the authority and precedence rules now in
[phases/router.md](phases/router.md) "Inputs And Authority" and "Route
Precedence".

| Signal | Priority | Allowed when conditions pass |
|---|---|---|
| Current direct evidence (user reply, repo state, running app, `git log`) | 1 | direct and admissible |
| Fresh workflow-native artifacts (Brand Kit, DESIGN.md, Compositions, Motion Plan, variant code, quality results, promote commit) | 2 | fresh, valid, in the resolved spec folder's scope |
| Committed design handoff entries | 3 | committed and intact |
| Suggested route | 4 | suggestion only |

Overlaps resolved:

| Overlap | Tie-break | Derived route |
|---|---|---|
| Pending checkpoint and a stale earlier artifact | a pending checkpoint returns only while its inputs are fresh | earliest stale gate |
| Checkpoint reply and a stale earlier artifact | the reply records first (D1) | owning checkpoint gate |
| Open round and changed Compositions/DESIGN.md/Motion Plan | stale open round is superseded by a new round | earliest stale gate, then variant-round |
| Fresh brand artifacts and no Brand Kit | intake brand artifacts satisfy the brand row; router writes a skip row | next gate |
| Recorded `keep` and a later visual change request | direct evidence outranks the recorded completion | compose on layout change, else variant-round |
| Blocked outcome and the same gate re-selected | blocked restated unless new evidence resolves it | blocked outcome |
| Steering record and a user reply | the reply resolves the terminal only when it answers the recorded decision | gate that recorded it |
| Same-authority conflict | most advanced state with complete valid predecessor evidence; otherwise blocked `design_state_conflict` | one route |

Validation:

- Stale, out-of-scope (other spec folder or scope unit), and invalid (missing
  file, dead durable link, unreachable commit) evidence loses eligibility.
- Every overlap above selects exactly one route.

Domain state: complete.

Next suggested route: `write-router.md`

Blockers: none

Resume identity: none

## Write Router Outcome

Phase: write-router

Status: complete

Scope: Replace the executable root with bootstrap-only guidance and write the
deterministic cold-resume router.

Artifacts:

- `SKILL.md`: explicit-only bootstrap, updated description, one router
  pointer; `agents/openai.yaml` unchanged (`allow_implicit_invocation: false`).
- `phases/router.md`: authority order, staleness rules (kept from the linear
  skill and extended to Brand Kit, DESIGN.md, Compositions, Motion Plan, and
  open rounds), the Re-entry Rule (O19), 19 ordered precedence rows, the brand
  skip, the blocked-restate rule, Route Trace (O20), and router outputs.

Validation:

- The root contains invocation policy and bootstrap only.
- 19 rows: 13 gate rows (row 5 resolves to the one gate owning the pending
  checkpoint) and 6 stop rows: terminals `human_steering_required`,
  `requirements_phase_return`, `design_complete`; checkpoint pass-through for
  brand, compose, verdict; blocked `design_target_unclear`,
  `design_state_conflict`.
- Every gate filename is a flat path under `phases/`.
- Cold resume reads the round counter and open round from Round State.

Domain state: nine new gate files are intentional future targets at this
point; `write-phases.md` creates them.

Next suggested route: `write-phases.md`

Blockers: none

Resume identity: none

## Write Phases Outcome

Phase: write-phases

Status: complete

Scope: Write every router-selected gate file and remove obsolete gates.

Artifacts:

- Rewritten: `phases/intake.md`, `phases/grill.md`, `phases/backlog.md`,
  `phases/delivery-handoff.md`.
- New: `phases/brand.md`, `phases/design-system.md`, `phases/compose.md`,
  `phases/motion-plan.md`, `phases/variant-round.md`,
  `phases/quality-gate.md`, `phases/verdict.md`, `phases/promote.md`.
- Deleted: `phases/approval.md` (folded into `verdict` and `promote`, Q5) and
  `phases/prototype.md` (replaced by `variant-round`, Q1, Q2).

Validation:

- Each of the 12 gates has the nine sections in order: Entry Guard, Inputs,
  Actor-Like Gate Boundary, Bounded Action, Invariants, Completion Evidence,
  Declared Exits, Durable Handoff, Stop Or Router Re-entry.
- Every gate declares `human_steering_required` and writes through the design
  handoff contract.
- Only `brand`, `compose`, and `verdict` hold a `HUMAN checkpoint` step and a
  `checkpoint` exit (Q28).
- Narrower executors (`requirements-grill`, `brandkit`, imagegen skills,
  Codex image child, `shadcn`, `find-animation-opportunities`,
  `prototype-variants` and craft skills, `break-ui`, `mobile-native`,
  `review-animations`, `repo-asset-management`) run inside their gate; the
  gate keeps reconciliation, validation, and the handoff write.
- Child skills run autonomously (Q24); every activation names a concrete
  target.
- Kept rules: low-confidence rule, lean grill scope, backlog glossary sentence
  and Requirements Phase return, `repo-asset-management` ownership, explicit
  `$delivery-phase` stop.
- No gate names Matt's `prototype`, standalone HTML, a `prototype/<slug>`
  branch, or a `/prototypes/<slug>` route.

Domain state: complete.

Next suggested route: `define-handoffs.md`

Blockers: none

Resume identity: none

## Define Handoffs Outcome

Phase: define-handoffs

Status: complete

Scope: Define the runtime durable handoff, its storage, discovery, schema, and
exit coverage.

Artifacts: `references/design-handoff.md`.

Validation:

- Storage: one `DESIGN-HANDOFF.md` (illustrative name, ARC-002) beside
  `SPEC.md` in the folder `create-spec` folder-naming resolves; the folder is
  reserved like `ARCHITECTURE.md` when no spec exists (Q27, AC-015).
- Discovery: named spec folder; else exactly one matching Design Target; none
  creates; several is router blocked `design_target_unclear`. Latest gate
  outcome is the last Gate Outcomes entry for that gate.
- Schema keeps the canonical categories; the domain-state field is
  `Design state`. Resume identity holds only the open round and variant ids,
  image `taskId`/`clientRequestId`/attempt, and the promote commit.
- Exit coverage: completion (every gate), blocker (every gate), skip or no-op
  (router brand-skip Route Trace row; blocked-restate no-op; `mobile-native`
  not applicable on Expo), planned human checkpoint (brand, compose,
  verdict), human steering (every gate). Every declared exit writes one gate
  outcome; the router writes Route Trace rows.
- Motion Plan states have one writer each (O9). The approved artifact
  contract keeps the current fields and adds the promote commit, file list,
  kept variant, and fixture location.

Domain state: complete.

Next suggested route: `verify-disclosure.md`

Blockers: none

Resume identity: none

## Verify Disclosure Outcome

Phase: verify-disclosure

Status: complete

Scope: Verify context reachability, sibling isolation, and reference
placement.

Artifacts:

- Context trace for a verdict reply: `SKILL.md` → `phases/router.md` (+
  `references/design-handoff.md`) → `phases/verdict.md` (+
  `references/design-handoff.md`). No sibling gate loads.
- Reference reachability: `design-handoff` from the router and all 12 gates;
  `image-generation` from brand and compose; `shadcn-primitive-directive` from
  compose; `copy-lens` from compose and quality-gate; `design-md-template`
  from design-system.

Validation:

- A scripted check over every Markdown link in the skill found 56 relative
  pointers, 0 dead, and 0 gate-to-sibling-gate links (gates link only
  `router.md` and references).
- References hold shared material only. The image ladder is shared by two
  gates; the directive, copy lens, and template are appended or filled
  inputs; no reference holds a gate body.
- Cross-skill material (`create-spec` folder-naming, taste `copy.md`,
  imagegen copy sections, shadcn `design-system.md`) is named by skill and
  in-skill path, because installed skills sit in a flat directory.

Domain state: complete.

Next suggested route: `test-routes.md`

Blockers: none

Resume identity: none

## Test Routes Outcome

Phase: test-routes

Status: complete

Scope: Predict, derive, and repair the ten route scenarios.

Artifacts:

| Scenario | Predicted route (record first) | Derived route (apply contracts) | Match | Repair if mismatch |
|---|---|---|---|---|
| Baseline path | intake → grill → brand (checkpoint) → reply → design-system → compose (checkpoint) → reply → motion-plan → variant-round → quality-gate → verdict (checkpoint) → `keep` → promote → backlog → delivery-handoff → `design_complete` | rows 6, 7, 8, 4/5, 9, 10, 4/5, 11, 12, 13, 14, 4/5, 15, 16, 18, 19 | Yes | |
| Branch path: intake records fresh brand artifacts; user names web only | brand skipped; compose uses `imagegen-frontend-web` only | row 8 false, skip row written; row 9; compose step 3 one skill | Yes | |
| Repair cycle: variant B fails the copy lens | variant-round repairs B in round N, counter unchanged; quality-gate re-checks B | quality `variants_failed` → row 12 repair mode → row 13 for B's new build → row 14 | Yes | |
| Human checkpoint: Compositions presented, user resumes with no reply | restate the checkpoint, load no gate | row 4 `composition_acceptance_required` | Yes | |
| Human steering terminal: promote finds an open "Decision for you" | terminal until the user closes it; promote then re-runs | promote `human_steering_required` → row 1 until the reply answers it → row 15 | Yes | |
| Cold resume: transcript lost; Round 2 started, variants A, B built, C unbuilt | variant-round continues round 2 | row 12 continue mode; counter read from Round State | Yes | |
| Stale / out-of-scope / invalid: (a) DESIGN.md edited after Compositions accepted; (b) a second handoff matches the same route; (c) a Composition's local file and durable link are gone | (a) design-system, then compose; (b) ask one question; (c) compose | (a) row 9, then row 10 (Compositions stale against DESIGN.md); (b) row 2 blocked `design_target_unclear`; (c) evidence ineligible → row 10 | Yes | |
| Contradictory suggested route loses to evidence: handoff suggests `promote`; user asks for a new header layout | compose | layout change → Compositions stale → row 10; suggestion has priority 4 | Yes | |
| Nested executor substitution: compose images come from `codex exec` instead of a T3 child | compose verifies files and writes the same outcome | ladder step 3; compose boundary unchanged; router sees one compose outcome | Yes | |
| Premature completion: delivery brief drafted but backlog ids absent; variants exist without a `keep` | not complete | row 16 backlog precedes row 19; without `keep` row 15 never matches and row 14 presents the Verdict | Yes | |
| Repair re-test: compose blocked `image_generation_pending`; the Codex child has since finished | compose loads and reads the task | first derivation: blocked-restate rule restated the blocker and never read the task (Match: No) | Yes after repair | Router blocked-restate rule now reads the recorded `taskId` with `task_status` first; a finished task is new evidence |
| Repair re-test: backlog returned the scope to Requirements Phase; user re-enters | terminal `requirements_phase_return` | first derivation: row 16 ("backlog linkage missing") matched again and looped on backlog (Match: No) | Yes after repair | Row 16 now requires that no fresh backlog outcome exists for the promote commit; row 17 matches a fresh `requirements_phase_return`; new backlog ids make that outcome stale and re-select backlog |

Validation:

- All ten scenarios hold a prediction, a derivation, and a match result;
  stale, out-of-scope, and invalid appear as subcases.
- The planned checkpoint row and the human steering row stay distinct.
- Two mismatches found and repaired in `phases/router.md`; both re-tests match.

Domain state: complete.

Next suggested route: `audit.md`

Blockers: none

Resume identity: none

## Audit Outcome

Phase: audit

Status: complete

Scope: Terminal audit across obligations, authority, resume, exits,
handoffs, disclosure, tests, no-op pruning, and the available validator.

Artifacts: `SKILL.md`, `agents/openai.yaml`, `phases/router.md`, 12 flat gate
files, 5 references, and `tests/design-phase-graph.contract.test.mjs`.

Validation:

- Obligations O1–O20 each map to a state, a gate or router rule, and an
  evidence artifact; the terminal `design_complete` requires a fresh brief,
  which requires backlog linkage, a promote commit, a `keep`, passing quality
  results, and accepted Compositions and Brand Kit (or fresh brand
  artifacts).
- Router precedence is total and single-valued; authority order and the
  overlap tie-breaks in Define Authority Outcome hold. Each transition
  meaning has one owner: staleness and re-entry in the router; gate work in
  its gate; schema, storage, and Motion Plan writers in the handoff contract.
- `human_steering_required` is reachable from every gate, durable,
  authority-gated (row 1), and distinct from the three planned checkpoints.
- No-op pass over every gate with the `writing-for-agents` test: deleted the
  old "artifact intent" grill topic (superseded by the fixed graph), the old
  delivery-brief taste-skill step (delivery adds no UI, Q6), and a directive
  sentence on illustration placement that the grill did not decide. The
  remaining sentences change routing, evidence, validation, persistence, or
  stop behavior.
- Scripted pointer check: 56 relative pointers, 0 dead, 0 sibling links.
- `node --test tests/design-phase-graph.contract.test.mjs`: 17 of 17 pass.
- `node --check` passes for the test; `git diff --check` is clean for the
  scoped paths.
- Applicable packaging validator: `skills add /home/stefan/repos/skills
  --list` reports "Local path validated", finds 130 skills, and lists
  `design-phase` with the new description while `disable-model-invocation:
  true` stays in place.
- Full suite `node --test tests/*.test.mjs`: one failure is caused by this
  change and sits outside this write scope:
  `tests/wayfinder-lifecycle.contract.test.mjs` "design prototype step
  composes the primitive, not the standalone phase" reads the deleted
  `phases/prototype.md`. The other 14 failures were present before this
  change.

Domain state: every terminal audit obligation passes for the design-phase
graph. Follow-up outside this write scope: delete or replace the wayfinder
test case above, and update `ask-hi` references that still describe the
linear design-phase.

Terminal decision: `audit-complete`.

Next suggested route: terminal `audit-complete`

Blockers: none inside this skill.

Resume identity: none; the graph, tests, and this record reconstruct the
terminal decision.
