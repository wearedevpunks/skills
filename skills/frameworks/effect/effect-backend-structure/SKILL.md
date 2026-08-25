---
name: effect-backend-structure
description: |
  Apply Effect-specific backend structure on top of backend-domain-structure.
  Use when creating or changing Effect actions, repositories, transport adapters,
  DB integrations, test placement, or backend boilerplate in any Effect backend
  root. Enforces actions-own-orchestration, integration dependency direction,
  effect-solutions plus opensrc source lookup, and @effect/vitest conventions.
compatibility: Requires Effect v4. Examples are reviewed against the version documented in this repository.
---

# Effect Backend Structure

Use this skill with `$backend-domain-structure` and `$effect` for Effect backend code. `$effect` owns Effect v4 API guidance. Use `$effect-service-design` for service qualification, service modules, Layers, requirements, test substitutes, and service audits.

The agnostic skill owns the layer model:

- `platform/`
- `integrations/`
- `features/*`
- shared libraries and packages

This skill adds Effect-specific backend topology, action ownership, source lookup, and test placement rules.

## Workflow

1. Identify the backend root, read its nearest `AGENTS.md` files, `$backend-domain-structure`, `$effect`, this skill's layout reference, and `$effect-service-design` when services or Layers are in scope.

   **Complete when:** the backend root and every governing instruction or reference used for the change are named.

2. Run the smallest relevant `effect-solutions` guides, then inspect local `opensrc` Effect sources for unfamiliar or ambiguous APIs.

   **Complete when:** every Effect API decision in scope is supported by a relevant guide or the current source.

3. Classify each Layer exactly once as leaf/module capability implementation, nearest-common-parent business composition, or process production root. Keep transport thin and preserve dependency requirements until their truthful owner supplies them.

   **Complete when:** every Layer in scope has exactly one owner and its public outputs and remaining requirements match that boundary.

4. Add or update colocated `@effect/vitest` tests for the changed unit or integration boundary.

   **Complete when:** focused tests validate the resulting public boundary and the repository's required checks pass or each failure is reported.

## Required Source Lookup

Always consult `effect-solutions` first. Use the smallest relevant set:

- `effect-solutions show config`
- `effect-solutions show data-modeling`
- `effect-solutions show error-handling`
- `effect-solutions show testing`

Use `opensrc` next when the guide is not enough:

- Run `opensrc path Effect-TS/effect`.
- Inspect `packages/effect`, `packages/sql`, or `packages/sql-drizzle` in that checkout.

For non-Effect libraries, run `opensrc path <package>` or `opensrc path owner/repo`.

## Effect Coding Rules

- Use `Effect.fn("Domain.action")` for actions.
- Use `Schema.TaggedError` for domain failures.
- Use branded IDs and Effect Schema for domain models.
- Use `Config.*` instead of reading `process.env` inside Effect code.
- Prefer `catchTag` / `catchTags`, not `catchAll`.
- Avoid `any`.

Read `references/layout.md` for the mutually exclusive Layer ownership classifier, composition terminology, and v4 operator rules.

## Testing Rules

- Keep tests inside the owning feature or module.
- Use `@effect/vitest`.
- Unit tests cover action and guard behavior.
- Integration tests use public action or transport boundaries.
- Apply `$effect-service-design` when tests replace or control a service.

## Output Checklist

- `$backend-domain-structure` was applied
- relevant `effect-solutions` guides were checked
- `opensrc` sources were checked when needed
- code landed in the correct backend layer
- actions own orchestration
- services are only reusable mechanics
- transport is thin
- tests follow the unit/integration split with feature-local support layers
