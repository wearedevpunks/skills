# Backend Domain Structure Reference

## Goal

Organize backend code by responsibility and domain instead of by file type.

Prefer this shape inside the backend root:

```text
<backend-root>/src/
  platform/
  integrations/
  features/
```

The backend root may be an app folder, package folder, service folder, or workspace package. Derive it from the current repo.

## Layer Classifier

Classify by responsibility before naming files or moving code.

- Transport/app composition: app creation, route registration, server start, middleware assembly, request context, top-level dependency wiring, and composition modules.
- Feature/product domains: use cases, policy, ports/contracts, protocols/interfaces, repositories, feature transport adapters, and public entrypoints for one product domain.
- Platform/framework concerns: framework modules, runtime context, request lifecycle, common middleware, config loading, and process adapters.
- Infrastructure/integrations: external SDKs, provider adapters, queues, email, storage, billing, search, analytics, and third-party API mechanics.
- Database persistence: queries, persistence model mapping, migrations, transaction helpers, and database client adapters.
- Pure domain models/events: identifiers, value objects, invariants, domain events, and data shapes without framework, transport, container, or persistence imports.

## Layer Meanings

### `platform/`

Use `platform/` for cross-domain execution wiring.

Good fits:

- root app composition
- request-scoped context construction
- transport runners
- router assembly
- dependency graph assembly
- process/runtime adapters
- framework modules and middleware shared by multiple features

Bad fits:

- business policy
- feature orchestration
- direct provider details that belong to an integration
- persistence queries that belong to repositories
- pure domain models or events

### `integrations/`

Use `integrations/` for external systems and shared provider mechanics.

Good fits:

- auth provider client
- database adapter helpers
- email, queues, storage, billing, search, analytics, or third-party APIs
- SDK wrappers
- provider-specific error mapping

Do not put product policy in `integrations/`. An integration says how to talk to a system; a feature decides why and when.

Infrastructure implements feature ports/contracts or shared platform contracts. It should not import feature internals unless the project has an explicit adapter registration convention.

### `features/<domain>/`

Use features for business behavior.

Common local folders:

- `actions/`
- `models/`
- `repositories/`
- `services/`
- `tests/`
- `errors.ts`
- `layer.ts`, `container.ts`, `module.ts`, or equivalent composition file
- `router.ts`, `controller.ts`, or equivalent transport adapter when the feature exposes endpoints

Feature domains own use cases, policy, persistence contracts, and public behavior.

Keep pure domain models, events, identifiers, and invariants free of transport, framework, container, and database imports.

## Actions vs Services

Default to actions.

Use `actions/` for:

- orchestration
- auth checks
- policy
- state transitions
- use cases
- multi-step workflows

Use `services/` only for reusable mechanics consumed by multiple actions, such as:

- provider wrappers already scoped to the feature
- shared low-level operations
- capability-style abstractions with stable reuse

Use `repositories/` for:

- persistence reads
- persistence writes
- query composition
- persistence model mapping

Database code stays behind repositories or persistence adapters. Actions and services should depend on repository contracts, not raw database clients or query builders, unless the existing stack has a narrow equivalent boundary.

Quick rule:

- "what this flow means" -> `actions/`
- "how this reusable mechanic works" -> `services/`
- "how data is persisted/read" -> `repositories/`

Avoid broad god-services that collect unrelated use cases.

## Transport Boundary

Keep transport thin.

- parse and validate input
- resolve request context
- call feature actions or query entrypoints
- map domain failures to transport errors
- return transport-shaped output

Business logic, external side effects, and DB queries should not live directly in routers, controllers, or handlers.

## Dependency Direction

Prefer this direction:

- transport/app composition -> features
- platform composition -> features
- features -> platform contracts
- features -> integrations or infrastructure through ports/contracts
- features -> shared domain libraries
- integrations/infrastructure -> external systems
- integrations/infrastructure -> shared libraries

Avoid:

- `integrations -> features`
- lower layers importing route files, app creation, server start, or root composition
- shared libraries importing app-local code
- transport files importing many low-level helpers instead of one feature entrypoint
- feature domains reaching into another feature's internals
- database code leaking above repositories or persistence adapters
- lazy imports used to hide dependency cycles

Features may depend on other features only when the domain relationship is explicit, stable, and exposed through a public feature entrypoint.

## Dependency Injection

Composition roots own container wiring.

- Build containers, layers, modules, or dependency graphs in root composition or feature composition files.
- Pass protocols, interfaces, contracts, or concrete adapters into business logic.
- Keep domain models, events, actions, policies, and repository contracts free of container lookups.
- Treat lazy imports as a smell when they avoid a cycle instead of fixing import direction.
- Keep test wiring in test support or feature composition helpers, not inside production domain logic.

## Public Boundaries

Feature modules or package roots should expose deliberate public API.

- Export services, actions, ports/contracts, protocols/interfaces, adapters, events, errors, and named types meant for other layers.
- Keep internal helpers, provider details, persistence models, and transport plumbing private.
- Prefer stable named types at cross-layer boundaries over inline anonymous shapes.
- Remove compatibility aliases after clean refactors; do not leave stale names as a second API.
- Cross-feature calls should use public feature entrypoints, not internal files.

## Testing Layout

Keep tests near the owning feature or module.

Prefer:

```text
<backend-root>/src/features/<domain>/
  tests/
    support/
    unit/
    integration/
```

Testing split:

- `tests/support`
  fakes, builders, fixtures, and test-specific dependency wiring
- `tests/unit`
  action, guard, policy, and repository behavior with controlled dependencies
- `tests/integration`
  public behavior through live infrastructure or the transport/action boundary

Avoid a distant package-root `tests/` folder unless the project already has a strong convention for it.

## Review Checklist

- Is transport thin?
- Did business policy land in a feature?
- Did external provider code stay in an integration?
- Are repositories the only persistence owners?
- Are services reusable mechanics rather than use-case buckets?
- Are tests colocated with the owning domain?
- Are imports flowing one way without layer inversions?
- Does the composition root own container wiring?
- Are domain models/events free of framework, transport, container, and persistence imports?
- Do public feature modules or package roots expose only deliberate services/contracts and stable named types?
- Were compatibility aliases and stale symbols removed after moves?

## Validation Prompts

- Run architecture/import-boundary tests if the repo has them.
- Run focused compile, type, or test checks for the touched backend root.
- Grep for stale symbols, old paths, and compatibility aliases after moves.
- Inspect module import direction from route/app composition down through features and infrastructure.
- Check import cycles; do not silence them with local or lazy imports.
