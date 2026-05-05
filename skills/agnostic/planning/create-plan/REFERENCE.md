# Create Plan Reference

`create-plan` is the wrapper. Do not merely mention the inner skills. Execute their behavior inside one planning run and stop only after the plan artifact and backlog sync are complete.

## Required inner skills

- MUST use `$grill-me`
- MUST use `$swarm-planner`
- MUST use `$tdd`
- `opensrc` provides source context for installed or external packages
- scoped `AGENTS.md` files provide per-path skill requirements through `Primary skills here`

## Phase map

1. Read current repo state and derive as much context as possible before asking.
2. Run the ambiguity-reduction phase:
   - see [references/grill-phase.md](references/grill-phase.md)
3. Run the task-graph phase:
   - see [references/planner-phase.md](references/planner-phase.md)
4. Run the TDD shaping phase:
   - see [references/tdd-phase.md](references/tdd-phase.md)
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
- Never start implementation from this skill.
