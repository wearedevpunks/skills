---
name: python-backend-structure
description: Organize Python backend domain and package architecture. Use when creating or refactoring Python backend packages, resolving import cycles, choosing composition roots or public package APIs, or placing actions, services, repositories, integrations, and adapters.
---

# Python Backend Structure

Apply `$backend-domain-structure` to the backend as a whole, then tighten its boundaries for Python packages and imports.

This Python overlay intentionally overrides its platform placement for application wiring. `backend/composition.py` is the parent-owned application composition module needed to preserve no-sibling imports; `platform/` retains runtime and transport assembly and accepts injected entrypoints.

## Domain tree

Start from responsibilities, not framework types:

```text
backend/
├── composition.py            # root-owned application wiring
├── platform/                 # runtime and transport mechanics
├── integrations/             # external-system adapters
└── features/
    └── commerce/             # domain parent
        ├── composition.py    # domain-owned child wiring
        ├── contracts.py      # parent-owned leaf contracts
        ├── models.py         # parent-owned domain values and events
        ├── checkout/         # child capability
        │   ├── composition.py
        │   ├── contracts.py
        │   ├── models.py
        │   ├── actions.py
        │   ├── services.py
        │   ├── repositories.py
        │   └── adapters.py
        └── fulfillment/      # equivalent sibling capability
            ├── composition.py
            ├── contracts.py
            └── models.py
```

Adapt names and depth to the product. The invariant is ownership: a domain parent owns leaf contract, model, and composition modules; child capabilities own their actions, services, repositories, and adapters. A composition module belongs to its parent and is not another child package. The rule is recursive at every package depth.

- Root `composition.py` owns application wiring across `platform/`, `integrations/`, and `features/`.
- `platform/` owns runtime and transport mechanics that accept injected entrypoints.
- `integrations/` owns external-system boundaries and concrete adapters that are not feature-private.
- `features/` owns product behavior grouped by domain.
- Actions own use-case policy, authorization, state transitions, and orchestration.
- Services own reusable capability mechanics used by actions.
- Repositories own persistence only: durable reads, writes, and transaction-shaped operations.
- External systems enter through integrations or adapters, not repositories.

## Import topology

Keep all top-level imports acyclic. Lazy imports must not conceal cycles; repair ownership or composition instead.

- Sibling packages at the same parent never import one another, even through public package roots. The same law covers sibling implementation branches represented as modules or packages. This includes actions, services, repositories, and adapters.
- Parent composition may import child implementations at its owning boundary: parent-owned composition modules import immediate child implementation branches and select their wiring. An outer parent imports the child's composed entrypoint, not its internals.
- Children never import parent composition modules.
- Child modules import parent-owned leaf `contracts.py` and `models.py` directly. They never import the parent `__init__` or `composition.py`.
- `checkout/composition.py` is parent-owned relative to checkout's implementation branches and may import and wire them.
- Each implementation branch imports checkout-owned leaf `contracts.py` and `models.py` and never imports its siblings.
- `commerce/composition.py` imports only the checkout composed entrypoint and fulfillment equivalent, never either child's internals.
- A workflow spanning siblings belongs at the nearest honest common parent. When orchestration should remain elsewhere, depend on a lower contract or event owned honestly by the domain that defines it.
- Root composition injects composed feature entrypoints into platform and transport, so platform and transport do not import feature siblings.
- Integration adapters can structurally satisfy feature-owned Protocols without importing feature implementation packages. Root composition wires those adapters into feature composition.
- Concrete adapters depend inward on owned contracts. Contracts and domain models do not import their implementations.

Treat an import cycle as evidence that policy, a contract, or construction lives under the wrong owner. Moving an import inside a function changes timing, not the dependency.

## Public package APIs

Keep every public `__init__.py` deliberately narrow. Re-export only stable entrypoints, contracts, and domain types that callers should couple to.

Use `__all__` at public package roots when useful, not every module. Import leaf modules directly inside a package, especially for contracts and models, so package initialization does not create hidden edges.

## Services and construction

Apply the service-versus-value deletion test before introducing a service: if deleting the seam leaves only a deterministic value or thin forwarding wrapper, keep a value or function. A service earns its name as an authority or capability seam over behavior, resources, external I/O, state, or meaningful production variation.

For each service, identify:

1. The contract owner: the domain that names the capability in caller terms.
2. The concrete adapter: the implementation that owns technology-specific mechanics.
3. The production construction owner: the parent or root composition module that selects the adapter.

Make dependencies visible through constructor or setup injection. Pass the capability a caller needs; a service locator hides both ownership and import direction. Keep per-call inputs as values rather than turning them into services.

## Applying the structure

Classify existing responsibilities before moving modules. Prefer the smallest tree that expresses honest ownership, then check that imports follow the rules above and public roots expose only intended contracts.

This skill is descriptive and stateless. Do not require projects to create architecture or import-boundary tests, ledgers, reports, or other persistent artifacts. Use existing validation when it is already part of the project.
