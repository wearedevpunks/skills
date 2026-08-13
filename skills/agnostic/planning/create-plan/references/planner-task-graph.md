# Planner Task Graph

Use this reference to run `$swarm-planner` and produce the swarm graph of `Tn` tasks.

## Research before task design

Use `opensrc path <package>` or `opensrc path <owner>/<repo>` when source context from installed or external packages matters.

Use web search when `opensrc` is insufficient or when current API behavior matters.

Prefer primary sources.

## Scoped skill routing

Before finalizing task boundaries:

1. List every concrete `location` each task may touch.
2. For each location, inspect the `AGENTS.md` chain from repo root to the nearest scoped file.
3. Read every applicable `Skill | What / when` table and select only rows whose
   exact `What / when` trigger matches the task.
4. Verify each selected skill exists in `.agents/skills/` or an installed skill
   source visible to the agent.
5. Open each selected skill's complete `SKILL.md` before finalizing the task's
   boundary, validation, RED target, and review mode.
6. Add the merged, deduplicated union from every touched scope to the task as
   `assigned_skills`.
7. For every implementation-applicable item, add exactly one
   `implementation_skill_guidance` entry with the exact skill identity and its
   concise applicable behavior. Planning-only items remain provenance without a
   guidance entry.
8. Classify architecture applicability using `architecture-convergence.md` before locking dependencies and
   waves. For architecture-bearing plans, derive task boundaries and architecture waves from the persisted
   target ownership topology, dependency graph, responsibility criteria, public seams, and migration ledger.

If a task spans multiple scopes, include all selected skills from all touched
scopes. If a matching row names a missing skill, keep the task planned but
record the missing skill in risks and unresolved questions.

`assigned_skills` remains planning provenance;
`implementation_skill_guidance` is the executor handoff. Do not design the task
first and attach skills afterward. Use guidance to decide the task slice,
dependency, validation, and test target.

## Planner behavior

Produce exactly one named `PLAN.md` in the target spec folder.

Preserve `$swarm-planner` behavior:

- explicit task ids and `depends_on`
- explicit `owned_paths` and `wave_boundary` per task
- atomic tasks sized for one worker
- validations per task
- parallel execution waves
- risks and mitigations
- explicit `assigned_skills` per task from exact scoped `What / when` trigger
  matches, with task design shaped by those skills
- complete one-to-one `implementation_skill_guidance` for every
  implementation-applicable assigned skill
- architecture-bearing task fields `architecture_wave`, `behavior_owner`, `integration_surface`, `public_seam`,
  `topology_delta`, `forbidden_ownership`, `temporary_seams`, and `responsibility_acceptance_criteria`
- stable criterion ids mapped to at least one task and exactly one due architecture wave
- a continuous convergence checkpoint after every architecture wave that checks all criteria due through the
  current wave and regression-checks previously met criteria
- a final `plan-reviewer` subagent review for missing deps, missing
  `owned_paths`, missing `wave_boundary`, ordering issues, edge cases, invalid
  parallelism, unsafe write overlap, missing RED targets, missing validation,
  missing `assigned_skills`, missing or duplicate implementation guidance, and
  holes before yielding

Do not stop between ambiguity reduction and swarm graph construction unless a true blocking ambiguity remains.
