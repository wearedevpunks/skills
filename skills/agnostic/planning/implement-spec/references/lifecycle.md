# Implement Spec Lifecycle

## Shared contract

`implement-spec` is the only public execution entrypoint.

It routes to one of two approaches:

- `sequential` — one thread, no workers
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

Use it only for durable drift that should inform later work on the same spec:

- scoped compromises
- unresolved gaps
- pre-existing debt discovered during execution
- cleanup intentionally deferred by the current spec

Do not create the file when nothing durable must survive the run.

## 6. Shared execution invariants

- Mode is manual. The chosen approach decides the execution path.
- Do not switch modes mid-run unless the user explicitly redirects.
- Treat every `tdd_target` as required RED-first behavior, never optional guidance.
- Treat every `review_mode` as required validation routing, never optional metadata.
- Keep an operator-visible execution board in the conversation so progress is obvious.
- Keep scope discipline. Out-of-scope findings go to `IMPLEMENTATION-NOTES.md`, not silent scope creep.
- If backlog sync is part of the run, keep epic and story bodies product-facing.
- Execution-time backlog sync may use comments, links, native status, and native relations.
- Never rewrite epic or story bodies with task ids, TDD targets, validation commands, or file lists.

## 7. Shared upkeep after each completed unit

After each completed task or wave:

- update `PLAN.md` status
- append a concise execution log in `PLAN.md`
- record touched files in `PLAN.md`
- update `IMPLEMENTATION-NOTES.md` with non-obvious decisions, surprises, or deviations
- update the spec-linked tech-debt file when durable drift appears
- if backlog sync is in scope, prefer native metadata changes or concise comments over body rewrites

## 8. Handle blockers honestly

If a task is blocked:

1. record it in `IMPLEMENTATION-NOTES.md`
2. update the spec-linked tech-debt file when the blocker is durable
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

## 11. Finalize the spec folder

Before reporting back:

- remove empty sections from `IMPLEMENTATION-NOTES.md`
- ensure **Execution mode** reflects the mode actually used
- ensure **Sanity checks** lists only commands actually run
- ensure **Remaining work** matches any unmet or blocked criteria
- set `SPEC.md` frontmatter `status: implemented`
- set `PLAN.md` `**Status:** Complete` when that line exists

## 12. Final report shape

Summarize:

- implementation status
- validation results
- key deviations or surprises
- acceptance-criteria status
- blocked tasks needing input
- whether the spec-linked tech-debt file was created or updated
