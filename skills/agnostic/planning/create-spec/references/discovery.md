# Discovery

Use this reference before asking clarifying questions.

## Required order

1. Read `<wiki-root>/AGENTS.md`.
   - Stop if it does not exist. The wiki is not bootstrapped yet.
2. Read `<wiki-root>/index.md`.
   - Use it as the master map for domains, contracts, and existing specs.
3. Identify the primary domain.
   - Prefer the domain whose contract most clearly owns the request.
   - If multiple domains are involved, pick the primary owner and note cross-domain scope in the spec.
   - If no domain matches, stop and tell the user the wiki domain scaffold is missing and must be created first.
4. Read the relevant domain contract:
   - `<wiki-root>/domains/<domain>/<domain>-contract.md`
5. Optionally read related domain concepts or flows when they are obviously relevant.
6. Check for existing overlapping specs in:
   - `<wiki-root>/specs/<domain>/<domain>-specs.md`
7. Check existing DB schema when a matching domain schema file exists:
   - `packages/db/src/schema/<domain>.ts`
   Use it to:
   - avoid speccing duplicates
   - catch contradictions with the implemented model
   - surface open questions when a required field is absent
8. Glance at the top-level repo structure only if needed for terminology or context.

## Exploration rule

This is orientation, not deep implementation research.

- Keep it read-only
- Keep it fast
- Prefer enough context to ask better questions
- Do not drift into solution design

If the Agent tool is available, use a subagent for this pass so the main thread stays clean.
