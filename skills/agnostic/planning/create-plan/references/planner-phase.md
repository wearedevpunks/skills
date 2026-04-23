# Planner Phase

Use this reference for the `$swarm-planner` phase.

## Research before task design

Use `opensrc --modify false` when source context from installed or external packages matters.

Use web search when `opensrc` is insufficient or when current API behavior matters.

Prefer primary sources.

## Planner behavior

Produce exactly one named `PLAN.md` in the target spec folder.

Preserve `$swarm-planner` behavior:

- explicit task ids and `depends_on`
- atomic tasks sized for one worker
- validations per task
- parallel execution waves
- risks and mitigations
- a final subagent review for missing deps, ordering issues, edge cases, and holes before yielding

Do not stop between the grill and planner phases unless a true blocking ambiguity remains.
