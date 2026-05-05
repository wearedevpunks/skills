---
name: create-plan
description: Creates execution-ready `PLAN.md` artifacts by explicitly wrapping `grill-me`, `swarm-planner`, and `tdd` into one planning run. Use when work must be decomposed before coding, especially for reviewed spec workflows, multi-agent execution, branch-scoped delivery, or any task that needs explicit dependencies, backlog items, review gates, and per-task RED targets.
---

# Create Plan

## Contract

- **Role:** higher-order planning orchestrator
- **Entrypoint type:** public entrypoint
- **Upstream:** approved `SPEC.md` or explicit planning request
- **Delegates to:** `$grill-me`, `$swarm-planner`, `$tdd`
- **Downstream:** execution-ready `PLAN.md` for `implement-spec`
- **Entry conditions:** scope is clear enough to plan; stop if required planning inputs or tools are missing
- **Stop conditions:** `PLAN.md` and backlog sync are complete; no implementation started

## Required Inner Skills

- MUST use `$grill-me`
- MUST use `$swarm-planner`
- MUST use `$tdd`

Create a plan first. Never implement code in this skill.

## Quick start

1. Read repo, git, existing plan, and backlog context before asking questions.
2. Keep a visible planning control panel in the conversation: locked decisions, open decisions, current phase, and next step.
3. Read `references/grill-phase.md` and run `$grill-me` as an explicit inner phase.
4. Update a running decision ledger after every answer so the user never has to reconstruct state from memory.
5. Insert a synthesis checkpoint before the thread gets noisy, then continue only if more ambiguity reduction is still needed.
6. Research with `opensrc path <package>` or `opensrc path <owner>/<repo>` plus primary-source web docs when current behavior matters.
7. Locate scoped `AGENTS.md` files for every planned task path, extract `Primary skills here` lists, and load the relevant skill guidance before finalizing task design.
8. Read `references/planner-phase.md` and run `$swarm-planner` as an explicit inner phase.
9. Read `references/tdd-phase.md` and run `$tdd` as an explicit inner phase.
10. Read `references/backlog-sync.md` and sync backlog at epic/story level, not one item per plan task.
11. Read `references/stop-conditions.md` and stop exactly there.

## Workflows

### Default workflow

1. Derive host, owner, tracker, and scope from repo state instead of assuming them.
2. Ask only for missing high-impact inputs such as scope, goal, or backlog target.
3. Every plan-shaping question must use the exact block: `Decision`, `Recommendation`, `Question`, `Why it matters`.
4. Keep `$grill-me`, `$swarm-planner`, and `$tdd` as visible required inner phases of one planning run.
5. Resolve each task's scoped guidance from root `AGENTS.md` down to the nearest `AGENTS.md` for its `location`.
6. Use each task's required skill guidance while shaping its scope, dependencies, validation, RED target, and review mode; do not merely list skills after the plan is written.
7. Assign each task the exact existing skills required by those scoped `Primary skills here` lists, merging all scopes for cross-directory tasks.
8. Normalize every task with stable ids, `depends_on`, `location`, `description`, `validation`, `status`, `log`, `files edited/created`, owning-story backlog references, `assigned_skills`, `tdd_target`, and `review_mode`.
9. Keep the saved plan standalone: include situation, issue, solution shape, assumptions, findings, research, dependency graph, testing strategy, skill-routing notes, risks, validation gates, unresolved questions, and a resolved decision ledger.
10. Stop after plan creation and backlog sync. Do not implement code or spawn implementation workers.

### Review modes

- `cli`: tests, commands, APIs, non-visual validation
- `browser`: interactive UI validation
- `mixed`: both are required

## Advanced features

See [REFERENCE.md](REFERENCE.md) for the overview and phase map.

- Grill / ambiguity-reduction phase: see [references/grill-phase.md](references/grill-phase.md)
- Planner / task-graph phase: see [references/planner-phase.md](references/planner-phase.md)
- TDD shaping phase: see [references/tdd-phase.md](references/tdd-phase.md)
- `PLAN.md` schema and task contract: see [references/plan-schema.md](references/plan-schema.md)
- Backlog sync rules: see [references/backlog-sync.md](references/backlog-sync.md)
- Stop conditions: see [references/stop-conditions.md](references/stop-conditions.md)
