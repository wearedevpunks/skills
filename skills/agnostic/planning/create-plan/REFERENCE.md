# Create Plan Reference

`create-plan` is the wrapper. Do not merely mention the inner skills. Execute their behavior inside one planning run and stop only after the plan artifact and backlog sync are complete.

## Required inner skills

- MUST use `$grilling`
- MUST use `$swarm-planner`
- MUST use `$tdd`
- MUST use `$codebase-design`
- `opensrc` provides source context for installed or external packages
- scoped `AGENTS.md` files provide per-path skill requirements through `Primary skills here`

## Graph map

1. Read current repo state and derive as much context as possible before asking.
2. Reduce ambiguity before task synthesis:
   - see [references/grill-ambiguity.md](references/grill-ambiguity.md)
3. Build the swarm graph of `Tn` tasks:
   - see [references/planner-task-graph.md](references/planner-task-graph.md)
4. Attach TDD shaping to each `Tn` task:
   - see [references/tdd-shaping.md](references/tdd-shaping.md)
5. Normalize the saved plan using:
   - [references/plan-schema.md](references/plan-schema.md)
6. Sync backlog items using:
   - [references/backlog-sync.md](references/backlog-sync.md)
7. Stop using:
   - [references/stop-conditions.md](references/stop-conditions.md)

## Global rules

- Keep the skill host-agnostic.
- Keep the user's sense of control explicit through visible state summaries, not implied progress.
- Derive repo ownership and hosting from git state instead of hardcoding assumptions.
- If a required tool is unavailable, stop clearly and report the missing dependency.
- Keep the canonical backlog model aligned with [../write-backlog/assets/concepts/backlog-model.md](../write-backlog/assets/concepts/backlog-model.md).
- For every planned task, locate the relevant scoped `AGENTS.md` chain, load the relevant skill guidance during planning, and assign the existing skills that the executor must load again before editing.
- Because the default quality pack is always present, include `$codebase-design` in task shaping when module interfaces, seams, adapters, or test surfaces matter.
- Never start implementation from this skill.
