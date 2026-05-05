# Planner Phase

Use this reference for the `$swarm-planner` phase.

## Research before task design

Use `opensrc path <package>` or `opensrc path <owner>/<repo>` when source context from installed or external packages matters.

Use web search when `opensrc` is insufficient or when current API behavior matters.

Prefer primary sources.

## Scoped skill routing

Before finalizing task boundaries:

1. List every concrete `location` each task may touch.
2. For each location, inspect the `AGENTS.md` chain from repo root to the nearest scoped file.
3. Extract every `Primary skills here` entry from applicable scoped files.
4. Verify each named skill exists in `.agents/skills/` or an installed skill source visible to the agent.
5. Load the relevant skill instructions before finalizing the task's boundary, validation, RED target, and review mode.
6. Add the merged, deduplicated list to the task as `assigned_skills`.

If a task spans multiple scopes, include all required skills from all touched scopes. If a scope names a missing skill, keep the task planned but record the missing skill in risks and unresolved questions.

`assigned_skills` is both planning input and executor handoff. Do not design the task first and attach skills afterward. Use the skill guidance to decide what a correct task slice, dependency, validation, and test target should look like.

## Planner behavior

Produce exactly one named `PLAN.md` in the target spec folder.

Preserve `$swarm-planner` behavior:

- explicit task ids and `depends_on`
- atomic tasks sized for one worker
- validations per task
- parallel execution waves
- risks and mitigations
- explicit `assigned_skills` per task from scoped `AGENTS.md`, with task design shaped by those skills
- a final subagent review for missing deps, ordering issues, edge cases, and holes before yielding

Do not stop between the grill and planner phases unless a true blocking ambiguity remains.
