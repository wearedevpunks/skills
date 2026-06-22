---
name: effect-backend-structure
description: |
  Apply Effect-specific backend structure on top of backend-domain-structure.
  Use when creating or changing Effect services, layers, actions, repositories,
  transport adapters, DB integrations, test layers, or backend boilerplate in any
  Effect backend root. Enforces visible Effect requirements, layer-provided
  implementations, effect-solutions plus opensrc source lookup, and @effect/vitest
  testing conventions.
---

# Effect Backend Structure

Use this skill with `$backend-domain-structure` for Effect backend code.

The agnostic skill owns the layer model:

- `platform/`
- `integrations/`
- `features/*`
- shared libraries and packages

This skill adds Effect-specific services, layers, dependency visibility, source lookup, and testing rules.

## Workflow

1. Identify the backend root from the current repo; do not assume a monorepo path.
2. Read the nearest relevant `AGENTS.md` files.
3. Read `$backend-domain-structure` and `references/layout.md`.
4. Run the relevant `effect-solutions` guides before coding.
5. Check local `opensrc` Effect sources when docs are vague or an API surface is unfamiliar.
6. Place code using the agnostic backend layers plus the Effect rules below.
7. Keep transport thin and run business logic through Effects.
8. Add or update colocated `@effect/vitest` tests with test layers for unit coverage and live layers for integration coverage.

## Required Source Lookup

Always consult `effect-solutions` first. Use the smallest relevant set:

- `effect-solutions show services-and-layers`
- `effect-solutions show config`
- `effect-solutions show data-modeling`
- `effect-solutions show error-handling`
- `effect-solutions show testing`

Use `opensrc` next when the guide is not enough:

- `opensrc/repos/github.com/Effect-TS/effect/packages/effect`
- `opensrc/repos/github.com/Effect-TS/effect/packages/sql`
- `opensrc/repos/github.com/Effect-TS/effect/packages/sql-drizzle`

For non-Effect libraries, run `opensrc path <package>` or `opensrc path owner/repo`.

## Services and Layers

- Use `Effect.Service` for business services, repositories, and reusable capability interfaces.
- Use `Context.Tag` only for externally supplied runtime handles or third-party tags.
- Declare construction dependencies in `dependencies: [Dep.Default]`.
- Let actions consume services/repositories through Effect accessors or `yield* Service`.
- Keep action requirements visible until a feature, app, runner, or test layer provides them.
- Compose feature dependencies in `features/<domain>/layer.ts` or the local equivalent.
- Compose cross-feature and infrastructure dependencies in `platform/`.
- Use `Layer.mergeAll` for same-level composition and shallow `Layer.provide` / `Layer.provideMerge` for wiring levels together.
- Avoid `Effect.provide` inside actions, services, repositories, and transport adapters except at the final runner/test boundary.

## Effect Coding Rules

- Use `Effect.fn("Domain.action")` for actions and service methods.
- Use `Schema.TaggedError` for domain failures.
- Use branded IDs and Effect Schema for domain models.
- Use `Config.*` instead of reading `process.env` inside Effect code.
- Prefer `catchTag` / `catchTags`, not `catchAll`.
- Avoid `any`.

## Testing Rules

- Keep tests inside the owning feature or module.
- Use `@effect/vitest`.
- Unit tests provide fake leaf services/repos via test layers.
- Integration tests use live layers and public action or transport boundaries.
- Expose assertions through test-state tags in `tests/support`.
- Do not add test-only methods to production services.
- Do not use module mocks for Effect services; provide a replacement `Layer`.

## Output Checklist

- `$backend-domain-structure` was applied
- relevant `effect-solutions` guides were checked
- `opensrc` sources were checked when needed
- dependencies stay visible as Effect requirements or service dependencies
- implementations are supplied by layers, not hidden imports or module mocks
- code landed in the correct backend layer
- actions own orchestration
- services are only reusable mechanics
- transport is thin
- tests follow the unit/integration split with feature-local support layers
