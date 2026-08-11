# Frontend Domain Structure Reference

## Goal

Organize frontend code around stable responsibility owners. Frameworks choose entrypoint names and
rendering mechanics; the ownership and dependency rules here stay the same.

A common shape is:

```text
src/
  <framework-composition>/
  features/
  modules/
```

- **Framework composition** owns routes, screens, layouts, navigation shells, loading and error
  boundaries, metadata, and application assembly.
- **Features** own coherent user-facing capabilities and workflows.
- **Modules** own reusable app-local capabilities, integrations, foundations, and app-wide wiring.
- **Shared libraries** own domains or primitives whose reuse boundary genuinely spans applications or
  surfaces.

These labels may differ between projects. Preserve the responsibilities rather than imposing the
example names.

## Invariant Owner Classifier

Start with the **invariant owner**: the smallest stable domain responsible for the behavior, its rules,
and the changes that must remain coherent. A route name, visual region, file type, or reuse count alone
does not establish ownership.

Classify in this order:

1. Framework-mandated lifecycle or composition belongs to the framework composition layer.
2. A user-facing capability with its own workflow, policy, state transitions, or language belongs to a
   feature domain.
3. An app-local capability serving several features, without owning a user-facing workflow, belongs to
   a module domain.
4. A capability or primitive with real consumers across application or surface boundaries belongs to a
   shared library or package.
5. A detail with no independent invariant stays with its current owner.

Prefer the deepest honest owner. Move code upward only when the broader owner truly governs it.

## Domain-Worthiness Classifier

Before creating a feature, module, package, or nested domain, **scan the siblings**. Look for the same
invariant owner, product language, workflow, change cadence, and consumers. Extend or rename an existing
owner when it already covers the responsibility.

A new domain is worthy when it gives a coherent responsibility a stable name and at least one real
boundary, such as independent policy, lifecycle, state, workflow, consumer contract, or reuse scope.
Several tightly related files may form one worthy domain; one substantial public boundary may also be
enough. File count is not the classifier.

Keep implementation with its current owner when the proposed split is only navigational. In particular,
reject a cosmetic micro-feature or micro-module named after a panel, button, page fragment, file type, or
temporary layout. Keep a one-file folder folded into its owner until that folder expresses a deliberate
public or semantic boundary. This prevents directory depth from masquerading as architecture.

## Layer Responsibilities

### Framework Composition

Keep entrypoints thin: translate framework lifecycle into domain calls, assemble higher-level pieces,
and map domain results to framework output. Product policy, long workflows, reusable product sections,
and scattered client setup belong to their invariant owners.

### Features

A feature owns a coherent user-visible capability: its workflow, policy, state, data interaction,
presentation, and feature-local helpers. Examples include authentication, checkout, account settings,
or a dashboard capability when each name identifies real product behavior.

### Modules

A module owns an app-local capability reused by multiple features: client setup, application providers,
navigation configuration, form foundations, service adapters, metadata mechanics, or an app-local UI
system. Modules support product flows without owning those flows.

### Shared Libraries

A shared library owns code reused across application or surface boundaries: domain abstractions, design
tokens, primitives, framework-neutral helpers, or a coherent presentation system. Keep app-specific
widgets and workflows with the app that owns them. Inside a shared package, apply the same
domain-worthiness test; shared code is still organized by responsibility.

## Recursive Semantic Internals

The ownership rule is recursive at every directory and package depth. Within a feature, module, or
shared package, group semantic subdomains before adding technical folders. Introduce local folders such
as `state/`, `api/`, `models/`, or `presentation/` only when several related internals benefit from that
secondary grouping.

For example, a billing feature may contain semantic `invoices/` and `payment-methods/` subdomains. Each
subdomain follows the same invariant-owner, sibling-scan, public-boundary, and acyclic-dependency rules.
A flat technical bucket remains a poor substitute for semantic ownership even when nested.

## Public Entrypoints and Dependencies

Give every cross-domain dependency a **deliberate public entrypoint**. Export only the contracts,
views, operations, and types the domain intentionally offers. Imports within a domain may reach its
private internals; consumers use its public entrypoint.

Keep the graph one-way and acyclic:

- framework composition imports feature and module entrypoints;
- features import modules and shared-library entrypoints;
- modules import shared-library entrypoints and external libraries;
- shared libraries remain independent of app-local code;
- cross-domain deep imports and cycles are rejected;
- lazy loading, re-export chains, and path aliases preserve these boundaries rather than conceal cycles.

Peer-feature imports are highly discouraged. Permit one only when the dependency is justified as a real
one-way, acyclic relationship and it passes through the imported feature's public entrypoint. When both
features own part of the contract, move the common invariant to the nearest honest module or shared
domain. A reverse import or deep import invalidates the exception.

## Migration and Review

When migrating flat `views`, `state`, `lib`, or `utils` buckets:

1. Inventory behavior and identify each invariant owner.
2. Scan existing sibling domains before proposing new ones.
3. Move framework composition, feature behavior, app-local capabilities, and application- or
   surface-spanning code to their honest owners.
4. Create public entrypoints and update consumers before making internals private.
5. Repeat the classifier recursively inside each changed domain.
6. Validate changed behavior and dependency direction with the narrowest checks the project already
   supports.

The review is complete when every changed responsibility has one honest owner, every new domain passes
the worthiness classifier, and every affected cross-domain edge is public, one-way, and acyclic.
