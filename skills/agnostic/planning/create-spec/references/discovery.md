# Discovery

Use this reference before asking clarifying questions.

## Required order

1. Resolve the planning surface. Prefer the first existing layout:
   - routed project wiki: `apps/wiki/content/docs/project/specs`
   - legacy source wiki: `apps/wiki/specs`
   - docs fallback: `docs/specs`
2. Read local guidance for the resolved surface when present:
   - routed project wiki: `apps/wiki/AGENTS.md`, `apps/wiki/content/docs/project/index.mdx`, `apps/wiki/content/docs/project/meta.json`
   - legacy source wiki: `apps/wiki/AGENTS.md`, `apps/wiki/index.md`
   - docs fallback: `docs/README.md`, `docs/specs/index.md`
3. If none of those roots exists, create `docs/specs/<domain>/<folder>/SPEC.md` rather than blocking on scaffold setup.
   - Mention that the repo lacks a routed wiki planning surface in the handoff.
   - Do not create or scaffold `apps/wiki` from this skill.
4. Identify the primary spec domain or project area.
   - Prefer an existing `<resolved-specs-root>/<domain>/` directory when one clearly owns the request.
   - Otherwise infer a concise domain slug from backlog context or the user's request.
   - If multiple domains are involved, pick the primary owner and note cross-domain scope in the spec.
   - Do not create `apps/wiki/domains/` just to make discovery work.
5. Read existing context for that area when present:
   - `<resolved-specs-root>/<domain>/<domain>-specs.md`
   - routed project pages under `apps/wiki/content/docs/project/**` that match the area
   - docs pages under `docs/**` that match the area
6. Optionally read related routed project pages when they are obviously relevant.
7. Check for existing overlapping specs in:
   - `<resolved-specs-root>/<domain>/<domain>-specs.md`
8. If backlog context exists, inspect the parent epic/capability and every child story beneath it.
   Use [../../write-backlog/assets/concepts/backlog-model.md](../../write-backlog/assets/concepts/backlog-model.md) as the source of truth for how to interpret module -> epic -> story shape.
   Harvest:
   - epic outcome and constraints
   - each child story title
   - each child story body and acceptance signals
   - cross-story blockers or sequencing assumptions that affect the problem statement
9. Check existing DB schema when a matching domain schema file exists:
   - `packages/db/src/schema/<domain>.ts`
   Use it to:
   - avoid speccing duplicates
   - catch contradictions with the implemented model
   - surface open questions when a required field is absent
10. Glance at the top-level repo structure only if needed for terminology or context.

## Exploration rule

This is orientation, not deep implementation research.

- Keep it read-only
- Keep it fast
- Prefer enough context to ask better questions
- Do not drift into solution design

If the Agent tool is available, use the `planning-discovery` subagent for this pass so the main thread stays clean. Its output should be evidence, contradictions, overlapping work, and open questions only; keep synthesis and spec decisions in the parent thread.
