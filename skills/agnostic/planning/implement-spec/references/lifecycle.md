# Implement Spec Lifecycle

## Shared contract

`implement-spec` is the only public execution entrypoint.

It routes to one of two approaches:

- `sequential` — one implementation worker, parent orchestration, parent validation
- `parallel` — wave-based execution with explicit worker orchestration

Do not recreate wrapper skills for these modes. Keep the routing here and load only the needed mode reference.

## 1. Require an existing reviewed spec folder

Execution must stay grounded in:

`apps/wiki/specs/<domain>/<spec>/`

Required files:

- `SPEC.md`
- `PLAN.md`

If `SPEC.md` is missing, stop and report the resolved path error.

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
2. `apps/wiki/specs/<domain>/<spec>/SPEC.md`
3. `apps/wiki/specs/<domain>/<spec>/PLAN.md`
4. `apps/wiki/specs/<domain>/<spec>/IMPLEMENTATION-NOTES.md` if present
5. `docs/reference/tech-debt/<domain>/<spec>.md` if present

If package or framework behavior matters, inspect source with `opensrc --modify false` before guessing.

## 4. Prepare execution notes

Use [../assets/IMPLEMENTATION-NOTES-TEMPLATE.md](../assets/IMPLEMENTATION-NOTES-TEMPLATE.md).

- Create `IMPLEMENTATION-NOTES.md` from the template when missing.
- Append or refine when it already exists.
- Keep it current during the run, not only at the end.

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

If the debt is inside the active goal, fix it before advancing. If the debt is outside the active goal but affects the implementation decision, stop and run a tiny `$requirements-phase` clarification with one narrow question and a recommended answer. Continue only after the branch is closed, parked explicitly, or converted into an accepted scope change.

Do not create the file when nothing durable must survive the run.

## 6. Shared execution invariants

- Mode is manual. The chosen approach decides the execution path.
- Do not switch modes mid-run unless the user explicitly redirects.
- Default to `sequential` when the user does not choose a mode.
- In `sequential`, keep implementation work inside one worker; the parent coordinates, reviews, validates, and finalizes.
- Treat every `tdd_target` as required RED-first behavior, never optional guidance.
- Treat every `review_mode` as required validation routing, never optional metadata.
- Keep an operator-visible execution board in the conversation so progress is obvious.
- Keep scope discipline. Out-of-scope findings that do not affect the current implementation go to `IMPLEMENTATION-NOTES.md`, not silent scope creep.
- Never leave sloppy debt, TODO placeholders, temporary compromises, or "later" implementation notes for in-goal work.
- When unclear debt affects the current implementation and the answer is not already in the spec/plan/backlog, pause for a tiny `$requirements-phase` clarification instead of guessing.
- If backlog sync is part of the run, keep epic and story bodies product-facing.
- Execution-time backlog sync may use comments, links, native status, and native relations.
- Never rewrite epic or story bodies with task ids, TDD targets, validation commands, or file lists.

## 7. Shared upkeep after each completed unit

After each completed task or wave:

- update `PLAN.md` status
- append a concise execution log in `PLAN.md`
- record touched files in `PLAN.md`
- update `IMPLEMENTATION-NOTES.md` with non-obvious decisions, surprises, or deviations
- resolve any in-goal debt before advancing
- update the spec-linked tech-debt file only for blocked or explicitly parked debt with exact owner/next action
- if backlog sync is in scope, prefer native metadata changes or concise comments over body rewrites

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

## 10. Verify acceptance criteria

Re-read `SPEC.md` acceptance criteria and mark each one:

- met
- unmet
- blocked

Record a reason for every unmet or blocked item in `IMPLEMENTATION-NOTES.md`.

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
- ensure **Execution mode** reflects the mode actually used
- ensure **Sanity checks** lists only commands actually run
- ensure **Manual Review Checklist** has at least one concrete row, or one explicit non-applicability row
- ensure **Remaining work** matches any unmet or blocked criteria
- ensure no in-goal debt remains as TODO, follow-up cleanup, or vague later-work text
- ensure every tech-debt ledger entry has exact blocker/decision/owner/next action
- set `SPEC.md` frontmatter `status: implemented`
- set `PLAN.md` `**Status:** Complete` when that line exists

## 13. Final report shape

Summarize:

- implementation status
- validation results
- key deviations or surprises
- acceptance-criteria status
- manual review checklist
- blocked tasks needing input
- whether the spec-linked tech-debt file was created or updated
