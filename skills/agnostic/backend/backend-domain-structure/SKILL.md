---
name: backend-domain-structure
description: |
  Organize backend code into domain-first layers with thin transport entrypoints,
  platform composition, external integrations, and feature-owned business behavior.
  Use when creating or refactoring backend services, API routes, repositories,
  providers, test layout, or import boundaries across backend frameworks.
---

# Backend Domain Structure

Use this skill to keep backend code domain-based instead of transport- or utility-bucket-based.

Read `references/layout.md` before structure decisions or large refactors.

## Quick Classifier

Place code by responsibility first.

- Put root runtime composition, request context, transport runners, router/app assembly, and dependency wiring in `platform/`.
- Put feature/product use cases, policy, ports/contracts, feature transport adapters, and public entrypoints in `features/<domain>/`.
- Put platform/framework concerns in `platform/` unless they are feature-owned adapters.
- Put external system adapters and provider mechanics in `integrations/`.
- Put database persistence behind repositories or persistence adapters.
- Put pure domain models, events, identifiers, and invariants in feature `models/` or shared domain libraries.
- Put code reused across backend package boundaries in shared libraries or packages.

## Boundary Rules

- Keep transport thin. Parse input, call feature behavior, map errors at the boundary.
- Let transport and app composition compose feature entrypoints.
- Let features depend on platform contracts, integrations, and shared domain libraries.
- Let infrastructure implement ports/contracts; do not let it own product policy.
- Keep database code behind repositories or persistence adapters.
- Do not let lower layers import route/app composition.
- Do not let integrations import feature internals.
- Do not move app-specific business logic into shared libraries.
- Keep composition roots responsible for container wiring.
- Pass protocols, interfaces, or adapters into business logic; do not leak containers into domain code.
- Do not use lazy imports to hide dependency cycles.
- Expose deliberate services, contracts, protocols/interfaces, adapters, and named types from feature modules or package roots.
- Keep internals private; remove compatibility aliases after clean refactors.
- Avoid root-level generic buckets like `services`, `utils`, `helpers`, or `lib` when code can belong to a domain.

## Actions, Services, Repositories

Default to explicit use-case actions.

- Use `actions/` for orchestration, authorization checks, policy, state transitions, and business flows.
- Use `repositories/` for persistence reads and writes.
- Use `services/` only for reusable mechanics or capability abstractions consumed by multiple actions.
- Use `models/` for domain data shapes, schemas, and branded identifiers when the stack supports them.

## Use This Skill

- Read `references/layout.md`.
- Identify the backend root from the current repo instead of assuming a package path.
- Classify each file by responsibility first.
- Group business behavior under feature domains.
- Keep dependencies flowing: transport/composition -> features -> integrations/infrastructure -> external systems.
- Keep tests near the feature or module that owns the behavior.
- Validate module import direction, import cycles, stale symbols after moves, architecture tests when available, and focused compile/type checks.
