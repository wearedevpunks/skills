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

Bad fits:

- business policy
- feature orchestration
- direct provider details that belong to an integration
- persistence queries that belong to repositories

### `integrations/`

Use `integrations/` for external systems and shared provider mechanics.

Good fits:

- auth provider client
- database adapter helpers
- email, queues, storage, billing, search, analytics, or third-party APIs
- SDK wrappers
- provider-specific error mapping

Do not put product policy in `integrations/`. An integration says how to talk to a system; a feature decides why and when.

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

- `platform -> features -> integrations -> external systems`
- `features -> shared libraries`
- `integrations -> shared libraries`

Avoid:

- `integrations -> features`
- shared libraries importing app-local code
- transport files importing many low-level helpers instead of one feature entrypoint
- feature domains reaching into another feature's internals

Features may depend on other features only when the domain relationship is explicit, stable, and exposed through a public feature entrypoint.

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
