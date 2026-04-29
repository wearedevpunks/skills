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

- Put root runtime composition, request context, transport runners, and router assembly in `platform/`.
- Put external system adapters and provider mechanics in `integrations/`.
- Put business use cases, policies, repositories, models, and transport endpoints in `features/<domain>/`.
- Put code reused across backend package boundaries in shared libraries or packages.

## Boundary Rules

- Keep transport thin. Parse input, call feature behavior, map errors at the boundary.
- Keep product policy out of `platform/` and `integrations/`.
- Let features depend on integrations and shared libraries.
- Do not let integrations import features.
- Do not move app-specific business logic into shared libraries.
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
- Keep dependencies flowing: `platform -> features -> integrations -> external systems`.
- Keep tests near the feature or module that owns the behavior.
