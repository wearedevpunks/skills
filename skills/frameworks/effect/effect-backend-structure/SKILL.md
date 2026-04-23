---
name: effect-backend-structure
description: Bootstrap and refactor repo-specific Effect backends in `packages/api`. Use when creating or changing Effect services, layers, tRPC procedures, DB integrations, test layers, or initial backend boilerplate. Enforce this repo's `platform / integrations / features` structure, feature-local actions vs services split, `effect-solutions` + `opensrc` source workflow, and `@effect/vitest` unit/integration testing conventions.
---

# Effect Backend Structure

## Overview

Use this skill to keep `packages/api` aligned with this repo's Effect backend architecture. Start with `effect-solutions`, verify against local `opensrc` sources, then place code in the correct level and domain before writing any implementation.

## Workflow

1. Read `packages/api/AGENTS.md`.
2. Run the relevant `effect-solutions` guides before coding.
3. Check the local `opensrc` Effect sources when docs are vague or an API surface is unfamiliar.
4. Place code using the level-based root and feature-local domain rules below.
5. Keep tRPC transport thin and run business logic through Effects.
6. Add or update colocated `@effect/vitest` tests with test layers for unit coverage and live layers for integration coverage.
7. Update docs when architecture, contracts, setup, or workflow changed.

## Required source lookup

Always consult `effect-solutions` first. Use the smallest relevant set:

- `effect-solutions show services-and-layers`
- `effect-solutions show config`
- `effect-solutions show data-modeling`
- `effect-solutions show error-handling`
- `effect-solutions show testing`

Use `opensrc` next when the guide is not enough or you need real source context:

- `opensrc/repos/github.com/Effect-TS/effect/packages/effect`
- `opensrc/repos/github.com/Effect-TS/effect/packages/sql`
- `opensrc/repos/github.com/Effect-TS/effect/packages/sql-drizzle`

For non-Effect libraries, run `opensrc path <package>` or `opensrc path owner/repo` to resolve the local checkout path, then inspect there instead of guessing.

## Structure rules

Top-level backend shape:

- `platform/`
  Root Effect composition and transport adapters only.
- `integrations/`
  External/provider boundaries only.
- `features/`
  Business domains only.

Read [references/layout.md](references/layout.md) for the target tree and dependency direction.

## Placement rules

Put code in `platform/` only when it is cross-domain execution wiring:

- root app layer composition
- request-scoped layer construction
- tRPC context and runner
- router assembly

Put code in `integrations/` only when it wraps an external system or shared provider mechanic:

- Better Auth client
- DB adapter helpers if they are owned by `packages/api`
- email, queues, storage, third-party APIs

Do not put product policy in `integrations/`.

Put code in `features/<domain>/` for business behavior. Each feature owns its own:

- `actions/`
- `models/`
- `errors.ts`
- `repositories/`
- `services/` only when a reusable mechanic actually exists
- `layer.ts`
- `router.ts` if the feature exposes transport endpoints

## Actions vs services

Default to actions.

Use `actions/` for:

- orchestration
- auth checks
- policy
- state transitions
- use cases

Use `services/` only for reusable mechanics consumed by multiple actions, such as:

- provider wrappers already scoped to the feature
- shared low-level operations
- capability-style abstractions with stable reuse

Do not create broad god-services just because Effect has services.

Quick rule:

- "what this flow means" -> `actions/`
- "how this reusable mechanic works" -> `services/`
- "how data is persisted/read" -> `repositories/`

## Transport boundary

Keep tRPC thin.

- procedures parse input and call Effects
- business logic stays in feature actions
- DB queries never live in procedures
- Better Auth calls never live in procedures
- map domain failures to `TRPCError` only at the procedure boundary
- keep a single shared Effect runner for procedure execution

## Effect coding rules

- Use `Effect.Service` for reusable services.
- Use `Effect.fn("Domain.action")` for actions and service methods.
- Use `Schema.TaggedError` for domain failures.
- Use branded IDs and Effect Schema for domain models.
- Use `Config.*` instead of reading `process.env` inside Effect code.
- Prefer `catchTag` / `catchTags`, not `catchAll`.
- Avoid `any`.

## Naming rules

Let the path carry context.

- prefer `client.ts` under `integrations/auth/`, not `better-auth-gateway.ts`
- prefer `membership.ts` under `features/auth/repositories/`, not `membership-repository.ts`
- prefer `change-role.ts` under `features/user-management/actions/`, not `change-member-role-action.ts`

Keep names short unless a shorter name becomes ambiguous inside the folder.

## Testing rules

Keep tests inside the owning feature:

- `features/*/tests/unit/*`
- `features/*/tests/integration/*`
- `features/*/tests/support/*`

Use `@effect/vitest`.

Unit tests:

- test actions and guards
- provide fake leaf services/repos via test layers
- expose assertions through test-state tags in `tests/support`
- do not add test-only methods to production services

Integration tests:

- use the live app layer
- keep real Better Auth + DB wiring
- cover public behavior through the router/action boundary
- run serially when they share mutable auth/DB state

## Backend boundaries in this repo

- `packages/auth` owns Better Auth config and plugins
- `packages/db` owns Drizzle schema and Effect DB runtime
- `packages/api` owns application logic, Effect services/actions, and tRPC procedures

Do not move app business logic into `packages/auth`.

## Output checklist

Before finishing, confirm:

- relevant `effect-solutions` guides were checked
- `opensrc` sources were checked when needed
- code landed in `platform / integrations / features`
- actions own orchestration
- services are only reusable mechanics
- procedures are thin
- tests follow unit/integration split with feature-local support layers
- docs were updated if architecture/setup/contracts changed
