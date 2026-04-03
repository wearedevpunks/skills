# React Domain Structure Reference

## Goal

Organize React code by responsibility and domain instead of by file type.

Prefer this shape:

```text
src/
  app/ or other framework composition folder
  features/
  modules/
```

Interpret the layers like this:

- framework composition layer
  Framework-provided user-land entrypoints such as pages, layouts, route metadata, loading and error boundaries
- `features/*`
  Domain containers for user-visible business logic and product slices
- `modules/*`
  Domain containers for reusable app-local support building blocks, integrations, and root-level dependencies reused by multiple features
- shared libraries
  Cross-app or cross-surface domains, primitives, hooks, utilities, tokens, and presentation helpers

The exact names of shared libraries vary by project. The rule does not.

The important idea is that `features` and `modules` are both domain layers. They are not flat dumping grounds. Each domain may then contain its own `components`, `hooks`, `store`, `config`, `lib`, `utils`, and similar internal folders.

The same principle applies to packages in a monorepo or Turborepo. A package should still be structured by domain internally instead of becoming one flat global `components`, `hooks`, or `utils` bucket.

## Why This Shape

Flat folders such as `components`, `hooks`, `lib`, and `utils` scale poorly because they group by technical type instead of business purpose.

Instead of placing all `components` together and all `hooks` together at the root, group around domains first, then use technical subfolders inside the domain when useful.

The same applies to root-level escape hatches like `utils/`. Small truly global helpers can exist, but most code placed there eventually belongs to a feature domain, a module domain, or a shared library.

This structure improves:

- discoverability
- ownership
- reuse boundaries
- route thinness
- resistance to feature leakage across the app

## Decision Table

Classify each file in this order.

1. Is this a route entrypoint or route shell?
   Put it in the framework composition layer.
2. Is this a user-facing business section or flow that a route should import?
   Put it in a feature domain under `features/*`.
3. Is this reusable inside the app but not itself a page-facing slice?
   Put it in a module domain under `modules/*`.
4. Is this generic enough to reuse across apps or surfaces?
   Put it in a shared library or shared package.

If a file is named by type instead of purpose, rename around the domain or concern.

## Layer Meanings

### Framework Composition Layer

Keep this layer thin.

Good fits:
- `page.tsx`
- `layout.tsx`
- route-level `loading`, `error`, `not-found`
- tiny route composition wrappers
- route metadata

Bad fits:
- domain logic
- long form flows
- reusable product sections
- low-level client setup scattered across many routes

The route should mostly assemble higher-level pieces.

In Next.js App Router, this is `app/`.

### `features/*`

Use features for meaningful user-facing domains.

Good fits:
- authentication screens and flows
- dashboard sections
- account settings areas
- navigation shells
- user-facing forms and workflows
- domain-specific business state and orchestration

A feature domain may contain:
- components
- hooks
- store
- config
- local helpers
- sub-sections
- feature-specific state or queries

Do not create a feature for every tiny component. A feature should represent a coherent user-facing capability.

### `modules/*`

Use modules for reusable app-local support domains.

Good fits:
- auth client setup
- API client wiring
- providers
- routes configuration
- metadata helpers
- form foundations reused across several features
- domain service adapters used by many features
- UI library domains
- framework integration layers
- root-level dependencies shared by several features

A module domain may contain:
- components
- hooks
- store
- config
- lib
- utils

Modules are reusable inside the app, but they are not page-facing product slices.

A `modules/ui` domain is valid when it is effectively the app's local UI library: primitives, brand-styled abstractions, UI hooks, and UI-specific logic reused across many features.

### Shared Libraries

Use shared libraries for code that is reused across app boundaries.

Good fits:
- shared domain abstractions
- UI primitives
- design tokens
- shared hooks without product coupling
- generic utility helpers
- icons
- styling foundations

Bad fits:
- page sections
- product workflows
- app-specific domain widgets
- route-specific logic

If the code is only reusable within one app, keep it inside that app, usually in `modules/*`.

In a monorepo or Turborepo, shared packages should still be domain-based internally.

Good package patterns:
- a package that is itself one coherent shared domain
- a package with a small number of clearly separated internal domains

Examples:
- `<shared-ui-root>/src/primitives/*`
- `<shared-ui-root>/src/brand/*`
- `<auth-package-root>/src/client/*`
- `<auth-package-root>/src/server/*`
- `<forms-package-root>/src/fields/*`

Bad package patterns:
- a giant `<shared-ui-root>/src/components` folder holding unrelated concerns
- `<shared-foundation-root>/src/utils` growing without domain ownership
- a single package collecting every reusable concern just because it is shared

If a package contains several unrelated concerns, split the package or introduce internal domain folders.

## Import Boundaries

Keep dependencies flowing downward.

- framework composition layer may import:
  - `features/*`
  - `modules/*`
  - bootstrapping helpers
- `features/*` may import:
  - sibling files in the same feature
  - `modules/*`
  - shared libraries
- `modules/*` may import:
  - sibling files in the same module
  - shared libraries
  - external libraries
- shared packages may import:
  - sibling files inside the same package domain
  - lower-level shared utilities inside that package
  - external libraries

Avoid these inversions:

- `modules/*` importing `features/*`
- shared libraries importing app-local code
- one shared package domain importing unrelated package domains without a clear boundary
- routes importing many low-level helpers instead of a feature-level entrypoint

## Refactoring Guide

When migrating from flat buckets like `components`, `hooks`, `lib`, and `utils`:

- move route-facing composition into the framework composition layer
- group page-facing workflows under domain folders in `features/*`
- group reusable app-local support code under domain folders in `modules/*`
- move only truly shared code into shared libraries or shared packages

Name folders by domain or responsibility, not by file type.

Prefer:
- `features/auth`
- `features/settings`
- `features/layout`
- `modules/auth`
- `modules/providers`
- `modules/api`
- `modules/ui`

In monorepos, also prefer:
- `<shared-ui-root>/src/primitives`
- `<shared-ui-root>/src/brand`
- `<auth-package-root>/src/client`
- `<auth-package-root>/src/server`
- `<table-package-root>/src/hooks`

Then, inside a domain, use local technical folders only when they help:
- `features/auth/components`
- `features/auth/hooks`
- `features/auth/store`
- `modules/auth/config`
- `modules/auth/hooks`
- `modules/api/lib`
- `<auth-package-root>/src/client/hooks`
- `<shared-ui-root>/src/brand/components`

Avoid:
- `components/common`
- `components/shared`
- `utils/misc`
- `lib/helpers`

When root-level `utils/` already exists, treat it as migration debt unless the helpers are genuinely global and domain-neutral.

## Review Checklist

When reviewing or designing structure:

- Can the framework composition file get thinner?
- Is the route importing a feature instead of several low-level files?
- Is reusable app-local logic living in a module instead of scattered buckets?
- Is truly shared code kept out of app-local layers?
- Are shared packages internally domain-based instead of flat dumping grounds?
- Are features coherent user-facing slices rather than random groups of components?
- Are imports flowing one way without inversions?
- Are folders named after responsibilities rather than generic technical types?
