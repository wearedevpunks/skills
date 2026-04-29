---
name: frontend-domain-structure
description: |
  Organize frontend applications into domain-first layers with thin framework composition entrypoints,
  user-facing features, reusable app-local modules, and shared libraries. Use when creating or
  refactoring frontend code, replacing flat components/hooks/lib/utils folders, deciding whether code
  belongs in framework composition, features/, modules/, or shared packages, or reviewing frontend
  import boundaries across React, Vue, Svelte, Solid, or other UI frameworks.
---

# Frontend Domain Structure

Use this skill to keep frontend code domain-based instead of folder-type-based.
Treat `features/*` and `modules/*` as the main app-local domain containers.

Read `references/structure.md` before structure decisions or large refactors.
For React scopes, also read `references/react/structure.md`.

## Quick Classifier

Place code by responsibility first, framework file type second.

- Put route files, screen entrypoints, layout shells, metadata, and framework-owned composition in the framework composition layer.
- Put user-visible flows, screens, sections, and product orchestration in feature domains under `features/*`.
- Put reusable app-local concerns such as providers, client wiring, routing helpers, metadata helpers, API clients, form foundations, and UI libraries in module domains under `modules/*`.
- Put cross-app reusable domains, UI foundations, tokens, primitives, and framework-neutral helpers in shared libraries or packages.

Inside each feature or module domain, use local technical folders only when useful.

## Boundary Rules

- Keep framework composition thin. Compose features and modules there; do not accumulate domain logic.
- Let `features/*` depend on `modules/*` and shared libraries.
- Do not let `modules/*` import `features/*`.
- Do not move app-specific product features into shared libraries.
- Avoid root-level generic buckets like `components`, `hooks`, `utils`, `helpers`, or `lib` when code can belong to a domain.

## Shared Library Rule

Use shared libraries for code reused across app boundaries.

- Keep app-local reusable domains in `modules/*`.
- Keep user-facing product domains in `features/*`.
- Move only truly shared domains, presentation layers, primitives, tokens, or utilities into shared libraries.

In a monorepo, shared packages should still be domain-first internally instead of becoming global buckets.

## Use This Skill

- Read `references/structure.md`.
- Add framework-specific references only when the current scope uses that framework.
- Classify each file by responsibility first.
- Group by domain second.
- Organize inside each domain by local technical role only when needed.
- Keep imports flowing downward: framework composition -> `features` -> `modules` -> shared libraries or shared packages.
