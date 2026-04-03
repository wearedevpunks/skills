---
name: domain-plan
description: Create an execution-ready domain plan and sync its tasks to a chosen backlog. Use when work should be decomposed into dependency-aware tasks before implementation, especially for multi-agent or branch-scoped work that needs backlog items, dependency tracking, TDD targets, and a reusable *-plan.md artifact.
---

# Domain Plan

Create a plan first. Do not implement code in this skill.

## Prerequisites

- `$swarm-planner`
- `$tdd`
- `opensrc`

## Workflow

1. Read the current repo state.
   Derive context from the current checkout and git remotes. Do not assume a host or owner up front.

2. Gather missing run inputs.
   Confirm only what cannot be derived:
   - domain or scope
   - issue list or goal statement
   - backlog target for this run
   - backlog context if that target requires it

3. Research before planning.
   Use `opensrc --modify false` for external packages or repos when source context helps.
   Use web search when source retrieval is insufficient or current API behavior matters.
   Prefer `opensrc --modify false` plus web search.

4. Invoke `$swarm-planner`.
   Produce one named `*-plan.md` in the current working directory.
   Preserve dependency-aware tasks, validations, and the planner review step.

5. Apply `$tdd` planning rules while shaping execution tasks.
   For each task, define the first public-interface behavior that should fail before implementation starts.
   Frame tasks so a worker can begin with a RED test, then drive to GREEN in vertical slices.
   Do not leave TDD intent implicit or hidden in Orc memory.

6. Normalize the plan for execution.
   Ensure every task has:
   - stable task id
   - `depends_on`
   - `location`
   - `description`
   - `validation`
   - `status`
   - `log`
   - `files edited/created`
   - concrete `tdd_target`
   - `review_mode`
   - backlog reference fields

7. Set task execution metadata.
   `tdd_target` must describe one public-interface behavior to prove first.
   It should be concrete enough that a subagent can write the first failing test without guessing scope.
   `review_mode` must be one of:
   - `cli` for tests, commands, APIs, or non-visual validation
   - `browser` for interactive UI validation
   - `mixed` when both are required

8. Sync tasks to the selected backlog.
   Create or update one backlog item per task.
   Track hierarchy and dependencies natively when the chosen system supports it.
   Otherwise fall back to structured body text plus cross-links.
   Write the planned TDD objective into each backlog item so execution starts from an explicit RED target.
   Record created or updated backlog ids and URLs back into the plan.

9. Yield after planning.
   Stop after the plan and backlog sync are complete.
   Do not spawn implementation workers.
   Do not edit code beyond the plan artifact.

## Plan Contract

The generated `*-plan.md` is the handoff contract into execution. Each task should be execution-ready without hidden Orc context.

Each task should include these fields:

```md
### T3: Example task
- **depends_on**: [T1, T2]
- **location**: src/example.ts
- **description**: Implement the task behavior.
- **validation**: Public-interface behavior that proves completion.
- **status**: Planned
- **log**:
- **files edited/created**:
- **backlog_item_id**:
- **backlog_item_url**:
- **relation_mode**: native | body-links
- **tdd_target**: First failing behavior to implement.
- **review_mode**: cli | browser | mixed
```

## Rules

- Keep the skill host-agnostic.
- Use `$tdd` during planning to make each task's first failing behavior explicit.
- Derive repo ownership and hosting from git state instead of hardcoding assumptions.
- Prefer the selected backlog system's native CLI or tool if available.
- If the chosen tool is unavailable, stop clearly and report the missing dependency.
- Ask only high-impact clarification questions.
- Never start implementation from this skill.
