---
name: domain-plan
description: Create an execution-ready domain plan and sync its tasks to a chosen backlog. Use when work should be decomposed before implementation, especially for multi-agent or branch-scoped work that needs explicit dependencies, TDD targets, review modes, backlog items, and a reusable *-plan.md artifact.
---

# Domain Plan

Create a plan first. Do not implement code in this skill.

## Contract

- **Role:** higher-order planning orchestrator
- **Entrypoint type:** public entrypoint
- **Upstream:** explicit planning request, issue set, or reviewed problem statement
- **Delegates to:** `$grill-me`, `$swarm-planner`, `$tdd`
- **Downstream:** execution-ready `*-plan.md` for `$domain-execute`
- **Entry conditions:** scope is clear enough to plan; stop if required tools or planning inputs are missing
- **Stop conditions:** plan file and backlog sync are complete; no implementation started

## Required inner skills

- MUST use `$grill-me`
- MUST use `$swarm-planner`
- MUST use `$tdd`
- `opensrc`

## Quick start

1. Read repo, git, current plan files, and backlog context before asking questions.
2. Keep a visible planning control panel in the conversation: current phase, locked decisions, open decisions, next step.
3. Run `$grill-me` as an explicit ambiguity-reduction phase.
4. Update a running decision ledger after every answer.
5. Research with `opensrc path <package>` / `opensrc path owner/repo` and primary-source docs when current behavior matters.
6. Run `$swarm-planner` as the task-graph phase.
7. Run `$tdd` while shaping each execution task.
8. Normalize the saved plan so it stands alone without hidden chat context.
9. Sync one backlog item per task.
10. Stop after plan creation and backlog sync.

## Workflow

### Default workflow

1. Read the current repo state.
   Derive context from the current checkout and git remotes. Do not assume a host or owner up front.

2. Gather missing run inputs.
   Confirm only what cannot be derived:
   - domain or scope
   - issue list or goal statement
   - backlog target for this run
   - backlog context if that target requires it

3. Research before planning.
   Use `opensrc path <package>` or `opensrc path owner/repo` for external packages or repos when source context helps.
   Use web search when source retrieval is insufficient or when current API behavior matters.
   Prefer primary sources.

4. Reduce ambiguity explicitly.
   Ask only high-impact questions.
   Every plan-shaping question must use this exact order:
   - `Decision`
   - `Recommendation`
   - `Question`
   - `Why it matters`
   Ask one question at a time.
   If the codebase can answer it, inspect instead.

5. Maintain the decision ledger.
   After every answer, restate:
   - locked decisions
   - assumptions made
   - open decisions
   Emit a checkpoint summary before the thread gets noisy.

6. Invoke `$swarm-planner`.
   Produce one named `*-plan.md` in the current working directory.
   Preserve dependency-aware tasks, validations, and the planner review step.

7. Apply `$tdd` planning rules while shaping execution tasks.
   For each task, define the first public-interface behavior that should fail before implementation starts.
   Frame tasks so a worker can begin with a RED test, then drive to GREEN in vertical slices.
   Do not leave TDD intent implicit or hidden outside the saved plan.

8. Normalize the saved plan for execution.
   The plan must stand alone without hidden chat context.
   Include:
   - initial situation
   - issue / problem statement
   - solution shape
   - resolved decision ledger
   - assumptions and constraints
   - codebase findings
   - external research used
   - dependency graph
   - parallel execution waves when relevant
   - testing strategy
   - risks and mitigations
   - validation gates per phase when phases exist
   - unresolved questions

9. Normalize every task.
   Ensure every task has:
   - stable task id
   - `depends_on`
   - `location`
   - `description`
   - `validation`
   - `status`
   - `log`
   - `files edited/created`
   - `backlog_item_id`
   - `backlog_item_url`
   - `relation_mode`
   - concrete `tdd_target`
   - `review_mode`

10. Set task execution metadata.
    `tdd_target` must describe one public-interface behavior to prove first.
    It should be concrete enough that a subagent can write the first failing test without guessing scope.
    `review_mode` must be one of:
    - `cli` for tests, commands, APIs, or non-visual validation
    - `browser` for interactive UI validation
    - `mixed` when both are required

11. Sync tasks to the selected backlog.
    Create or update one backlog item per task.
    Track hierarchy and dependencies natively when the chosen system supports it.
    Otherwise fall back to structured body text plus cross-links.
    Write the planned TDD objective into each backlog item so execution starts from an explicit RED target.
    Record created or updated ids and URLs back into the plan.

12. Yield after planning.
    Stop after the plan and backlog sync are complete.
    Do not spawn implementation workers.
    Do not edit code beyond the plan artifact.

## Plan contract

The generated `*-plan.md` is the execution handoff. Each task should be execution-ready without hidden context.

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
- **tdd_target**: First failing public behavior to implement.
- **review_mode**: cli | browser | mixed
```

## Rules

- Keep the skill host-agnostic.
- Keep the user's sense of control explicit through visible state summaries.
- Use `$tdd` during planning to make each task's first failing behavior explicit.
- Derive repo ownership and hosting from git state instead of hardcoding assumptions.
- Prefer the selected backlog system's native CLI or tool when available.
- If the chosen tool is unavailable, stop clearly and report the missing dependency.
- Ask only high-impact clarification questions.
- Never start implementation from this skill.
