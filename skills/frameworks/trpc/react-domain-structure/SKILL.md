---
name: react-domain-structure
description: |
  Organize React and Next.js code into domain-first layers with thin route entrypoints,
  page-facing features, and reusable modules. Use when creating or refactoring React
  code, replacing flat components/lib/utils folders, deciding whether code belongs in
  framework composition folders, features/, modules/, or shared libraries, or
  reviewing import boundaries in React apps.
---

# React Domain Structure

## Overview

Use this skill to keep React code domain-based instead of folder-type-based.
Treat `features/*` and `modules/*` as the main domain containers.

Prefer:
- framework composition folders for route entrypoints, pages, and layouts
- `features/*` for business-facing domains
- `modules/*` for reusable support domains
- shared libraries and packages for cross-app domains, primitives, tokens, hooks, and presentation helpers

Read `references/structure.md` before making structure decisions or large refactors.

## Quick Classifier

Place code by responsibility, not by file type.

- Put route files, layout shells, metadata exports, and route-level composition in the framework composition layer such as `app/` in Next App Router.
- Put user-visible business flows and page sections in feature domains under `features/*`.
- Put reusable app-local concerns such as auth client wiring, providers, routes, metadata helpers, API clients, UI libraries, and framework integrations in module domains under `modules/*`.
- Put cross-app reusable domains and UI foundations in shared libraries or packages.

Inside each feature or module domain, organize by local responsibility as needed:

- `components/`
- `hooks/`
- `store/`
- `config/`
- `lib/`
- `utils/`

## Boundary Rules

- Keep the framework composition layer thin. Compose features and modules there; do not accumulate domain logic.
- Let `features/*` depend on `modules/*` and shared libraries.
- Do not let `modules/*` import `features/*`.
- Do not move app-specific product features into shared libraries.
- Avoid root-level generic buckets like `utils`, `helpers`, or `lib` when the code can belong to a domain.

## Shared Library Rule

Use shared libraries for code that is reused across app boundaries.

- Keep app-local reusable domains in `modules/*`.
- Keep user-facing domains in `features/*`.
- Move only truly shared domains, presentation layers, or utilities into shared libraries.

In a monorepo, do not let a shared package become a flat global bucket.

- Structure shared packages internally by domain too.
- Let each package expose one coherent shared domain or a few clearly separated internal domains.
- Use local `components/`, `hooks/`, `store/`, `config/`, `lib/`, and `utils/` inside those package domains only when needed.

## Use This Skill

- Read `references/structure.md`.
- Classify each file by responsibility first.
- Group by domain second.
- Organize inside each domain by local technical roles only when needed.
- Keep imports flowing downward: framework composition -> `features` -> `modules` -> shared libraries or shared packages.
