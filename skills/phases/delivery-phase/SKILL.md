---
name: delivery-phase
description: Human-invoked AFK router for a scoped delivery goal using current artifacts and evidence.
disable-model-invocation: true
---

# Delivery Phase

## Quick Start

`delivery-phase` is a reusable phase router.

1. Read [phases/router.md](phases/router.md).
2. Inspect only enough issue, architecture, spec, plan, notes, diff, Pass Report, durable
   handoff, validation, and docs state to choose the current gate.
3. If approved artifact links or UI Evidence links are present, carry them as routing evidence.
4. Load exactly one phase file from `phases/`.
5. Complete that phase and write its outcome. Full delivery re-enters routing immediately; other modes stop at their selected boundary.

Within accepted bounds, full delivery grants its selected inner steps the authority needed to reach closeout. Progressive loading still exposes one phase at a time.

## AFK

`delivery-phase` is an **AFK** phase: the human starts it and is away until
its stop. Starting it grants the run authority to decide. Every mode, every
phase file and every inner step it runs, including Requirements Phase,
`implement-spec`, `debugging-phase` and their workers, settles each pending
user question as an **Autonomous Decision**:

1. Choose the recommended answer from current artifacts and evidence.
2. Mark it **out-of-bounds** when it changes accepted requirements or scope,
   weakens a gate, substantially redesigns implementation, or replaces a
   decision any delivery file or inner step reserves for the human
   (`human_steering_required`, `review_budget_exhausted`, human direction).
   Mark every other decision in-bounds.
3. Record the question, the answer, the evidence and the mark in the Phase
   Result's `changed_facts` and in the Delivery Handoff's
   `autonomous_decisions`.
4. For an out-of-bounds decision, post one thread message at once that opens
   with `⚠️ AUTONOMOUS DECISION OUTSIDE ACCEPTED BOUNDS` and states the
   question, the answer, the evidence and how to reverse it.
5. Continue.

Every report the human reads opens with the full Autonomous Decisions list,
out-of-bounds first: the closeout report, every stop report and, through
`$pr`, the PR body. Never call `AskUserQuestion`, `request_user_input` or any
other question tool during delivery. Only missing access that no decision can
grant, such as credentials, permissions or an unreachable provider, selects
[human steering](phases/human-steering.md).

## Entry Modes

- **Full delivery:** user asks to deliver a bounded goal end to end.
- **Resume:** user returns after manual spec, plan, implementation, review, debugging, or docs work.
- **HITL checkpoint:** user explicitly wants one phase handled, then a manual stop.
- **Closeout:** user asks to finish evidence, docs, stack, tracker, or PR state after the work is already done.

## Phase Files

- [phases/router.md](phases/router.md): choose the next phase from artifacts and evidence.
- [phases/spec.md](phases/spec.md): route missing or stale Architecture/SPEC, backlog projection or plan proof to Requirements Phase.
- [phases/implement.md](phases/implement.md): execute the accepted plan.
- [phases/review.md](phases/review.md): prepare the explicit review handoff or
  route findings from a Pass Report.
- [phases/debug.md](phases/debug.md): investigate runtime-evidence failures.
- [phases/human-steering.md](phases/human-steering.md): return a scope or authority boundary for human steering.
- [phases/docs-ingest.md](phases/docs-ingest.md): ingest docs-affecting changes or record a no-op.
- [phases/closeout.md](phases/closeout.md): finish tracker, PR, validation, and final report state; watch the open PR until it reports.

## Router Rules

- Read `router.md` and its continuity contract before selecting exactly one phase.
- Require the [Architecture/SPEC pair](references/artifact-state.md#architecturespec-pair-complete)
  before dependent dispatch in every entry mode, including local and resumed
  delivery. Reuse fresh matching authority; activate child skills only from
  their selected phase.
- One plan creates at most one pull request per Touched Repository; split or
  stack PRs only when the user explicitly asks. Every phase, including
  implementation, repair, review fixes, and docs, commits to that repository's
  branch and PR.
- Design-Owned UI Code from a `design-phase` promote commit is accepted input.
  Delivery adds logic, data, and the rest of the requirement to it. A change to a
  design-owned file is a defect fix only, recorded in the Phase Result.
- Full Delivery continues within accepted bounds. Other modes emit one common
  Phase Result and stop at their requested boundary.
- [references/context-continuity.md](references/context-continuity.md) owns
  Context Pointers, disposable packets, common Phase Results and legacy recovery.
- [references/phase-handoff.md](references/phase-handoff.md) owns durable delivery
  state and compact Delivery Handoff; [phases/review.md](phases/review.md) alone
  owns delivery review transitions and the two-completed-pass policy.
- Write every message the user reads, including relayed subagent reports,
  through `$wait-what`.
- Failed-task and repair evidence selects
  [references/failure-continuity.md](references/failure-continuity.md).

## Stop Conditions

- User explicitly requested a HITL checkpoint or one-phase mode and its resumable state was written.
- Router reaches closeout and final evidence is reported.
- Required access is missing and no [Autonomous Decision](#afk) can grant it.
- `human_steering_required` remains durable while its required access is missing.
