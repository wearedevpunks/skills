# Discovery

Use this reference before asking clarifying questions.

## Required order

1. Read `apps/wiki/AGENTS.md`.
   - Stop if it does not exist. The wiki is not bootstrapped yet.
2. Read `apps/wiki/index.md`.
   - Use it as the master map for source specs, routed project docs, and recent wiki activity.
3. Identify the primary spec domain or project area.
   - Prefer an existing `apps/wiki/specs/<domain>/` directory when one clearly owns the request.
   - Otherwise infer a concise domain slug from backlog context or the user's request.
   - If multiple domains are involved, pick the primary owner and note cross-domain scope in the spec.
   - Do not create `apps/wiki/domains/` just to make discovery work.
4. Read existing context for that area when present:
   - `apps/wiki/specs/<domain>/<domain>-specs.md`
   - `apps/wiki/content/docs/project/**` pages that match the area
5. Optionally read related routed project pages when they are obviously relevant.
6. Check for existing overlapping specs in:
   - `apps/wiki/specs/<domain>/<domain>-specs.md`
7. If backlog context exists, inspect the parent epic/capability and every child story beneath it.
   Use [../../write-backlog/assets/concepts/backlog-model.md](../../write-backlog/assets/concepts/backlog-model.md) as the source of truth for how to interpret module -> epic -> story shape.
   Harvest:
   - epic outcome and constraints
   - each child story title
   - each child story body and acceptance signals
   - cross-story blockers or sequencing assumptions that affect the problem statement
8. Check existing DB schema when a matching domain schema file exists:
   - `packages/db/src/schema/<domain>.ts`
   Use it to:
   - avoid speccing duplicates
   - catch contradictions with the implemented model
   - surface open questions when a required field is absent
9. Glance at the top-level repo structure only if needed for terminology or context.

## Exploration rule

This is orientation, not deep implementation research.

- Keep it read-only
- Keep it fast
- Prefer enough context to ask better questions
- Do not drift into solution design

If the Agent tool is available, use a subagent for this pass so the main thread stays clean.
