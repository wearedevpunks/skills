---
name: create-plan
description: Creates execution-ready `PLAN.md` artifacts by composing `grilling`, `parallel-research`, `swarm-planner`, `tdd`, and `codebase-design` into one planning run. Use when work must be decomposed before coding into a swarm graph of `Tn` tasks with explicit dependencies, backlog items, review gates, and per-task RED targets.
---

# Create Plan

## Contract

- **Role:** higher-order planning orchestrator
- **Entrypoint type:** public entrypoint
- **Upstream:** approved `SPEC.md` or explicit planning request
- **Delegates to:** `planning-discovery` for bounded readonly orientation when subagents are available; `$grilling`, `$parallel-research`, `$swarm-planner`, `$tdd`, `$codebase-design`; `plan-reviewer` for the final readonly plan review
- **Downstream:** execution-ready `PLAN.md` for `implement-spec`
- **Entry conditions:** scope is clear enough to plan; stop if required planning inputs or tools are missing
- **Stop conditions:** `PLAN.md` and backlog sync are complete; no implementation started

## Required Inner Skills

- MUST use `$grilling`
- MUST consider `$parallel-research` for readonly planning discovery
- MUST use `$swarm-planner`
- MUST use `$tdd`
- MUST use `$codebase-design`

Create a plan first. Never implement code in this skill.

## Quick start

1. Read repo, git, existing plan, and backlog context before asking questions.
2. Keep a visible planning control panel in the conversation: locked decisions, open decisions, current graph step, and next step.
3. Read `references/grill-ambiguity.md` and run `$grilling` as explicit ambiguity reduction.
4. Update a running decision ledger after every answer so the user never has to reconstruct state from memory.
5. Insert a synthesis checkpoint before the thread gets noisy, then continue only if more ambiguity reduction is still needed.
6. If readonly discovery has independent code paths, specs, backlog items, external docs, or hypotheses, read and use `$parallel-research` before final task synthesis.
7. Research with `opensrc path <package>` or `opensrc path <owner>/<repo>` plus primary-source web docs when current behavior matters.
8. Locate scoped `AGENTS.md` files for every planned task path, extract `Primary skills here` lists, and load the relevant skill guidance before finalizing task design.
9. Read `references/planner-task-graph.md` and run `$swarm-planner` to produce the swarm graph and `Tn` task contract.
10. Read `references/tdd-shaping.md` and run `$tdd` to attach RED/GREEN targets to each `Tn` task.
11. Read `references/backlog-sync.md` and sync backlog at epic/story level, not one item per plan task.
12. Read `references/stop-conditions.md` and stop exactly there.

## Workflows

### Default workflow

1. Derive host, owner, tracker, and scope from repo state instead of assuming them.
2. Ask only for missing high-impact inputs such as scope, goal, or backlog target.
3. Every plan-shaping question must use the exact block: `Decision`, `Recommendation`, `Question`, `Why it matters`.
4. Keep `$grilling`, `$parallel-research`, `$swarm-planner`, `$tdd`, and `$codebase-design` as visible inputs to one planning run; record when `$parallel-research`, `planning-discovery`, or `plan-reviewer` is used or intentionally skipped because the work is not split-friendly or subagents are unavailable.
5. Scan relevant routed learning artifacts before task synthesis when prior bug knowledge, domain behavior, or project conventions could affect the plan.
6. Resolve each task's scoped guidance from root `AGENTS.md` down to the nearest `AGENTS.md` for its `location`.
7. Use each task's required skill guidance while shaping its scope, dependencies, validation, RED target, and review mode; do not merely list skills after the plan is written.
8. Assign each task the exact existing skills required by those scoped `Primary skills here` lists, merging all scopes for cross-directory tasks.
9. Normalize every task with stable ids, `depends_on`, `location`, `description`, `validation`, `status`, `log`, `files edited/created`, owning-story backlog references, `assigned_skills`, `tdd_status`, `tdd_target`, RED/GREEN commands, evidence fields, `codebase_design_notes`, `review_mode`, `runtime_validation`, `runtime_target`, `runtime_evidence`, and `runtime_cleanup`.
10. Keep `PLAN.md` self-contained: embed gathered context, relevant code paths, existing patterns, constraints, assumptions, design reasoning, tradeoffs, initial situation, issue, solution shape, findings, research, dependency graph, testing strategy, skill-routing notes, risks, validation gates, unresolved questions, and a resolved decision ledger.
11. Write enough conceptual reasoning that an executor can implement from `PLAN.md` alone, using supplementary research only when they choose to refresh or deepen context.
12. For complex work, express the plan as a swarm graph of `Tn` tasks with dependency-aware validation gates, expected outcomes, assertions, or checks that let the executor self-verify before moving on.
13. Stop after plan creation and backlog sync. Do not implement code or spawn implementation workers.

### Stack-aware preservation

If `SPEC.md` contains `Dependency Readiness` or `Branch/Base Intent`, copy those
sections into `PLAN.md` and validate that they are internally consistent.

- Preserve the exact dependency status: `No Stack Required`,
  `Branch/Base Intent`, or `Blocked`.
- Do not decide stack topology in `create-plan`.
- Do not convert task-level `depends_on` into stacked PRs. Intra-epic task
  dependencies stay inside one PR and only control implementation order.
- If `Dependency Readiness` is `Blocked`, stop planning and report the blocker
  instead of producing an execution-ready plan.
- If `Branch/Base Intent` exists, make implementation tasks reference that
  branch/base intent as an execution constraint.

### Review modes

- `cli`: tests, commands, APIs, non-visual validation
- `browser`: interactive UI validation
- `mixed`: both are required

## Advanced features

See [REFERENCE.md](REFERENCE.md) for the overview and graph map.

- Grill / ambiguity reduction: see [references/grill-ambiguity.md](references/grill-ambiguity.md)
- Planner / swarm graph: see [references/planner-task-graph.md](references/planner-task-graph.md)
- TDD shaping: see [references/tdd-shaping.md](references/tdd-shaping.md)
- `PLAN.md` schema and task contract: see [references/plan-schema.md](references/plan-schema.md)
- Backlog sync rules: see [references/backlog-sync.md](references/backlog-sync.md)
- Stop conditions: see [references/stop-conditions.md](references/stop-conditions.md)
