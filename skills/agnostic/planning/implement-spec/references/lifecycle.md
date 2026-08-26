# Implement Spec Lifecycle

## Shared contract

`implement-spec` is the only public execution entrypoint.

Execution follows plan-derived worker waves. Read [parallel.md](parallel.md) for
the wave loop and keep shared lifecycle rules here.

## 1. Require an existing agent-ready spec folder

Execution must stay grounded in the first matching spec folder:

1. `apps/wiki/content/docs/project/specs/<domain>/<spec>/`
2. `apps/wiki/specs/<domain>/<spec>/`
3. `docs/specs/<domain>/<spec>/`

Required files:

- `SPEC.md`
- `PLAN.md`

If `SPEC.md` is missing, stop and report the resolved path error.

Require `readiness: agent-ready`; no separate spec review or approval state is
needed.

If `PLAN.md` is missing, stop and use `create-plan`. Do not auto-generate plans from this skill.

## 2. Resolve the target folder

Accept either:

- a domain plus spec folder name
- a full spec folder path
- a direct `SPEC.md` or `PLAN.md` path

Normalize to the containing spec folder before doing any work.

## 3. Load the working set

Read, in this order:

1. `apps/wiki/AGENTS.md`
2. `<resolved-spec-folder>/SPEC.md`
3. `<resolved-spec-folder>/PLAN.md`
4. `<resolved-spec-folder>/IMPLEMENTATION-NOTES.md` if present
5. `docs/reference/tech-debt/<domain>/<spec>.md` if present

When `PLAN.md` declares architecture applicability as `architecture-bearing`,
also read [architecture-conformance.md](architecture-conformance.md) before
dispatching the first wave.

If package or framework behavior matters, inspect source with `opensrc --modify false` before guessing.

## 4. Prepare execution notes

Use [../assets/IMPLEMENTATION-NOTES-TEMPLATE.md](../assets/IMPLEMENTATION-NOTES-TEMPLATE.md).

- Create `IMPLEMENTATION-NOTES.md` from the template when missing.
- Append or refine when it already exists.
- Keep it current during the run, not only at the end.
- For UI implementation changes, load [ui-screenshot-evidence.md](ui-screenshot-evidence.md) and keep `## UI Evidence Links` current.
- For tasks with `runtime_validation: required`, load [runtime-product-validation.md](runtime-product-validation.md) and keep `## Runtime Validation Evidence` current.
- For visibly exercisable acceptance criteria, keep `## Behavior Verification
  Evidence` current using the template contract.
- For architecture-bearing plans, seed `## Architecture Conformance Evidence`
  from the persisted architecture contract and keep one cumulative checkpoint
  per architecture wave plus final closure.
- Seed `## Skill Application Evidence` from every task's
  `implementation_skill_guidance`. Preserve each guidance item unchanged and
  create exactly one evidence row for it.

## 5. Prepare the tech-debt ledger

Persistent implementation drift belongs in:

`docs/reference/tech-debt/<domain>/<spec>.md`

This file is not a dumping ground for avoidable "later" work.

Default rule: resolve debt immediately when it appears.

Forbidden debt language:

- "do this later"
- "temporary workaround"
- "future implementation"
- "follow-up cleanup"
- vague TODOs without an owner, decision, and blocker

Use the ledger only for debt that cannot be resolved inside the current run because it is outside the active goal, requires a human product/scope decision, or is blocked by an external dependency.

For every ledger entry, record:

- exact debt
- why it cannot be resolved now
- decision needed or external blocker
- owner or next action

If the debt is inside the active goal, fix it before advancing. If the debt is outside the active goal but affects the implementation decision, stop and run a tiny `$requirements-phase` clarification. Resume execution from its recorded outcome, applying any accepted scope change before continuing.

Do not create the file when nothing durable must survive the run.

## 6. Shared execution invariants

- Require every planned task to declare dependencies, owned paths, validation gates, and a wave boundary.
- Read the plan's uniform `task_identity_mode`. In `provider-task` mode, require
  every `Tn` to resolve one stable provider Task ID and URL and preserve that
  identity, its same `V*`, and native blocker edges. In `planning-only` mode,
  keep `Tn` as the execution identity, provider fields `not_applicable`,
  `relation_mode: unprojected`, and the nonempty backlog-sync skip reason.
- Build each wave from tasks whose dependencies are complete and whose write scopes are disjoint.
- Workers own implementation changes. The parent coordinates, reviews, validates, updates shared artifacts, and finalizes.
- A wave may contain one worker when dependencies or owned paths leave one task unblocked.
- Worker routing must be available before implementation begins; otherwise repair it or report the blocker.
- Treat every `tdd_target` as required RED-first behavior, never optional guidance.
- Treat `tdd_status`, `red_command`, `expected_red_failure`, `green_command`, `reason_not_testable`, `red_evidence`, and `green_evidence` as the task completion contract.
- Treat `codebase_design_notes` as required design context for code-structure changes. Verify the implemented interface, seam, adapter strategy, and test surface match it, or update the notes with the real decision.
- For behavior-changing tasks, do not mark a task complete until real RED and GREEN evidence is recorded in `PLAN.md`.
- Accept missing RED/GREEN evidence only when the task has an explicit `reason_not_testable` or `tdd_status: not_applicable`.
- Do not accept `reason_not_testable` for forgotten RED. If code came first, recover by writing the public-result RED test, recording failure, patching to pass, and marking `tdd_status: recovered`.
- Treat every `review_mode` as required validation routing, never optional metadata.
- Forward every `implementation_skill_guidance` item unchanged to its worker.
  Completion requires exactly one evidence record per guidance entry and no
  unmatched record.
- Treat `runtime_validation`, `runtime_target`, `runtime_evidence`, and `runtime_cleanup` as a task completion contract orthogonal to `review_mode`.
- When `runtime_validation: required`, do not mark the task complete until the supported runtime has conclusive public-entrypoint-first evidence recorded under `## Runtime Validation Evidence`.
- An exact runtime blocker is an honest blocked result, not completion. Record it and keep the affected task and acceptance criterion blocked.
- Keep an operator-visible execution board in the conversation so progress is obvious.
- Keep scope discipline. Out-of-scope findings that do not affect the current implementation go to `IMPLEMENTATION-NOTES.md`, not silent scope creep.
- Never leave sloppy debt, TODO placeholders, temporary compromises, or "later" implementation notes for in-goal work.
- When unclear debt affects the current implementation and the answer is not already in the spec/plan/backlog, pause for a tiny `$requirements-phase` clarification instead of guessing.
- In `provider-task` mode, load `write-backlog`'s
  [delivery-status.md](../../write-backlog/references/delivery-status.md) branch
  for lifecycle facts. When work starts, becomes blocked, gains a pull request,
  merges, or receives staging or production evidence, immediately call
  `write-backlog` with only the directly observed fact and require exact
  readback before advancing the Task. Planning-only tasks emit no provider
  lifecycle mutation or readback claim.
- Merge, staging, and production are distinct observations. Merge is never
  deployment evidence. Fog completion remains production-only and requires
  production evidence for every accepted resulting Story and Task.
- Never rewrite Epic, Story, or Task bodies with Task ids, TDD targets,
  validation commands, or file lists. Provider mapping and mutations remain in
  `write-backlog`.

## 7. Shared upkeep after each completed wave

After each completed wave:

- update `PLAN.md` status
- append a concise execution log in `PLAN.md`
- record touched files in `PLAN.md`
- fill `red_evidence` and `green_evidence`, or the accepted non-testable reason, before marking behavior-changing work complete
- fill or reconcile `codebase_design_notes` when module shape, seam placement, adapters, or test surface changed
- reconcile `## Skill Application Evidence`: verify each skill identity, allowed
  status, and how/where pointer against changed artifacts; for
  `not_applicable`, verify why and where the guidance was assessed
- update `IMPLEMENTATION-NOTES.md` with non-obvious decisions, surprises, or deviations
- for architecture-bearing plans, run the cumulative conformance checkpoint
  after every architecture wave; persist the `$show-me` view, textual conclusion,
  graph and ownership evidence, public-seam delta, migration-ledger delta, and verdict
- for UI implementation changes, record durable before/after screenshot asset links in `IMPLEMENTATION-NOTES.md`
- for required runtime validation, record the scenario, public action, correlation or provenance ids, observed result, durable evidence, cleanup, and status or exact blocker in `IMPLEMENTATION-NOTES.md`
- persist each `$verify-behavior` result under `## Behavior Verification
  Evidence`: map the story and acceptance criterion, branch or ref, channel,
  scenario, status, and cited durable evidence or exact blocker. When it is the
  same scenario as a `## Runtime Validation Evidence` row, cross-reference that
  row; avoid duplicate evidence
- resolve any in-goal debt before advancing
- update the spec-linked tech-debt file only for blocked or explicitly parked debt with exact owner/next action
- if backlog sync is in scope, prefer native metadata changes or concise comments over body rewrites
- in `provider-task` mode, verify every observed provider Task fact has exact
  `write-backlog` readback; a missing readback keeps that Task blocked

## 8. Handle blockers honestly

If a task is blocked:

1. record it in `IMPLEMENTATION-NOTES.md`
2. update the spec-linked tech-debt file only when the blocker creates durable unresolved debt
3. skip only tasks truly blocked by it
4. finish all remaining reachable work
5. report blocked tasks clearly at the end

Do not fake completion.

## 9. Apply runtime-aware validation

Use the task `review_mode`:

- `cli`: tests, commands, type-checks, API calls, or non-visual checks
- `browser`: browser validation through `$agent-browser`
- `mixed`: both

If running inside a worktree and `portless` is available, prefer it for server-based validation to avoid port conflicts.

For UI implementation changes, runtime validation must also follow [ui-screenshot-evidence.md](ui-screenshot-evidence.md).

For every task with `runtime_validation: required`, follow [runtime-product-validation.md](runtime-product-validation.md). Automated checks alone do not satisfy this gate.

## 10. Verify acceptance criteria

Re-read `SPEC.md` acceptance criteria and mark each one:

- met
- unmet
- blocked

Record a reason for every unmet or blocked item in `IMPLEMENTATION-NOTES.md`.

For architecture-bearing plans, acceptance also audits every Responsibility
Acceptance Criterion against the cumulative evidence. A failed topology,
dependency, public-seam, or migration-ledger checkpoint keeps affected criteria
unmet or blocked.

Acceptance that depends on required runtime validation is `met` only when its recorded evidence is conclusive. An exact blocker makes it `blocked`.

Visibly exercisable acceptance is `met` only when its Behavior Verification
Evidence row cites interactive evidence for the mapped story and criterion.
`not verified` is `unmet`; a verification blocker is `blocked`.

## 11. Write the manual review checklist

Before finalization, `IMPLEMENTATION-NOTES.md` must contain `## Manual Review Checklist`.

This section is a user handoff checklist, not an agent completion tracker. Derive it from completed tasks, `review_mode`, `tdd_target`, acceptance criteria, touched public surfaces, deviations, and risky integrations.

Use exactly this table shape:

| Area | Check | How to perform | Expected result |
|------|-------|----------------|-----------------|

Rules:

- Browser or mixed review tasks must include concrete user flows to try end to end.
- CLI review tasks must include exact commands, fixtures, or scenarios the user can rerun.
- Include manual-only checks for product behavior, visual review, integration smoke, tracker/docs review, or anything automation cannot prove.
- Empty checklist sections are invalid.
- If no manual review applies, write one explicit row explaining why there is no user-verifiable surface.

## 12. Finalize the spec folder

Before reporting back:

- remove empty sections from `IMPLEMENTATION-NOTES.md`
- ensure **Sanity checks** lists only commands actually run
- ensure **UI Evidence Links** has durable before/after asset links for UI implementation changes, or an explicit reason no pair was possible
- ensure **Runtime Validation Evidence** contains conclusive proof for every required task, or an exact blocker with the task and acceptance criterion still marked blocked
- ensure **Behavior Verification Evidence** maps every visibly exercisable
  criterion to cited interactive evidence or an exact blocker, cross-referencing
  matching Runtime Validation Evidence instead of copying it
- ensure **Manual Review Checklist** has at least one concrete row, or one explicit non-applicability row
- ensure **Skill Application Evidence** has exact one-to-one cardinality with
  plan guidance; allowed statuses are `loaded`, `applied`, and
  `not_applicable`
- ensure **Architecture Conformance Evidence**, when applicable, contains every
  wave checkpoint and final closure; closure proves zero drift and an empty
  migration ledger
- ensure **Remaining work** matches any unmet or blocked criteria
- ensure no in-goal debt remains as TODO, follow-up cleanup, or vague later-work text
- ensure every tech-debt ledger entry has exact blocker/decision/owner/next action
- set `SPEC.md` frontmatter `status: implemented` and `PLAN.md` `**Status:**
  Complete` only when every acceptance criterion is met, every reachable task is
  complete, and any architecture-bearing plan has successful final architecture
  closure
- preserve the current blocked or incomplete `SPEC.md` and `PLAN.md` statuses
  when any acceptance item, task, checkpoint, or final architecture closure is
  unmet or blocked
- ensure the PR body, PR comment, or PR-ready handoff snippet includes the same UI evidence links when UI changed

## 13. Final report shape

Summarize:

- implementation status
- validation results
- key deviations or surprises
- acceptance-criteria status
- runtime-validation evidence and exact blockers
- behavior-verification evidence and exact blockers
- manual review checklist
- blocked tasks needing input
- whether the spec-linked tech-debt file was created or updated
