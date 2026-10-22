# Frontend Domain Structure Reference

## Goal

Give each frontend behavior one stable owner in one fixed layer model. The layer names and their order
are the same in every project. The `frontend-layers` lint plugin checks the model with the rules in
[Lint Rules](#lint-rules).

## Layers

The layer root is `src/` when it exists, else the package root. These layers sit under the layer root,
from top to bottom:

| Layer | Owns |
| --- | --- |
| `app/` or `routes/` | Route files that the framework requires. They only connect Composition exports. |
| `composition/` | Combines Features and Modules into providers, Surface shells, page templates and registries. |
| `features/` | One user-facing capability with its own workflow, policy or state. |
| `modules/` | An app-local capability that several features use. It owns no user workflow. |
| `integrations/` | Adapters to outside systems, client setup, and mock, demo or fake runtimes. |
| `ui/` | Primitives and shadcn components. |

Each layer imports only lower layers. A layer can import any lower layer, not only the next one. The
rules govern imports between folders under the layer root, written as relative paths or with the `@/`
alias. Package imports, such as `next/navigation`, are outside these rules.

The layer root holds only these layer folders and `server/`. Any other top-level folder under the layer
root is an error. Test and story files follow the same rules as the code they test. The rules apply
to a package whose layer root contains `app/` or `routes/`; a package without a route layer is not
checked.

## Route Layer

The route layer imports only `composition/`. The root files `proxy.ts`, `middleware.ts` and
`instrumentation.ts` belong to the route layer. A route file reads framework inputs, calls the
Composition export for its page, and returns the result. Product policy, data reads and layout belong
to their invariant owners.

## Composition

Composition owns app-wide providers, Surface shells, page templates and cross-feature registries.

A **Surface** is one part of an app that a distinct user group sees through its own shell, for example
a public site and an admin panel. Its first level is fixed: `providers/` plus one folder per Surface,
for example `composition/providers/`, `composition/site/` and `composition/admin/`. Inside a Surface,
use `shell/` and `pages/<page>/`. Features stay flat; a Surface exists only as a folder of Composition.

A page template gives the route layer everything that one page needs, so that the route file only
connects it. Shell parts that features consume (a navigation registry, a header slot, a toast or
assistant channel) are Modules; the shell assembly is Composition.

## Features

A Feature owns a coherent user-visible capability: its workflow, policy, state, data interaction,
presentation and feature-local helpers. Examples are authentication, checkout and account settings,
when each name identifies real product behavior.

A Feature never imports another Feature. When two features work together, the nearest composition that
holds both connects them through props, slots or callbacks.

## Integrations

An Integration is an adapter to an outside system: an API client, client setup, an SDK wrapper or a
server reader. Mock data, demo data and fake runtimes are Integrations. Only Composition or tests select
a mock or fake runtime. Put no production UI in a folder named "prototype".

## Server

`server/` sits outside the layers, and `effect-backend-structure` governs it. Only `integrations/`
imports `server/`, and only through server public entrypoints. `app/api/` handlers import only
`server/`.

## UI

`ui/` holds primitives and shadcn components. In a monorepo, only the shared UI package (for example
`packages/ui`) holds them, and an app-local `ui/` folder is an error. A monorepo has a
`pnpm-workspace.yaml` or a `package.json` with `workspaces` at or above the package root. In a
single-package repository, `src/ui/` is the lowest layer. Other presentation stays with its owner, in a
Feature or a Module.

## Shared Packages

A capability or primitive with real consumers in more than one application belongs to a shared package.
Code that two Surfaces of one app use stays in a Feature or Module of that app. Keep app-specific
widgets and workflows with the app that owns them. Inside a shared package, apply the same
domain-worthiness test; shared code is still organized by responsibility.

## Domains and Public Entrypoints

A domain is the first folder under a layer, for example `features/checkout/`, `modules/navigation/`,
`integrations/payments/` or `composition/admin/`. Its `index.ts` or `index.tsx` is its only
cross-domain entrypoint. Imports inside a domain are free. `ui/` is exempt, because shadcn keeps one
file per component.

Make each entrypoint a **deliberate public entrypoint**. Export only the contracts, views, operations,
and types that the domain intentionally offers. Cross-domain deep imports and cycles are errors. Lazy
loading, re-export chains and path aliases keep these boundaries; they do not hide a cycle.

## Invariant Owner Classifier

Start with the **invariant owner**: the smallest stable domain responsible for the behavior, its rules,
and the changes that must remain coherent. A route name, visual region, file type, or reuse count alone
does not establish ownership.

Classify in this order:

1. Read the [Layers](#layers) table from top to bottom. The first layer whose "Owns" cell describes
   the responsibility owns it.
2. Code with real consumers in more than one application goes to [Shared Packages](#shared-packages).
3. A detail with no independent invariant stays with its current owner.

Prefer the narrowest honest owner. Move code to a broader owner only when that owner truly governs it.

## Domain-Worthiness Classifier

Before creating a feature, module, integration, package, or nested domain, **scan the siblings**. Look
for the same invariant owner, product language, workflow, change cadence, and consumers. Extend or rename
an existing owner when it already covers the responsibility.

A new domain is worthy when it gives a coherent responsibility a stable name and at least one real
boundary, such as independent policy, lifecycle, state, workflow, consumer contract, or reuse scope.
Several tightly related files may form one worthy domain; one substantial public boundary may also be
enough. File count is not the classifier.

Keep implementation with its current owner when the proposed split is only navigational. In particular,
reject a cosmetic micro-feature or micro-module named after a panel, button, page fragment, file type, or
temporary layout. Keep a one-file folder folded into its owner until that folder expresses a deliberate
public or semantic boundary. This prevents directory depth from masquerading as architecture.

## Recursive Semantic Internals

The ownership rule is recursive at every directory and package depth. Within a domain or shared package,
group semantic subdomains before adding technical folders. Introduce local folders such as `state/`,
`api/`, `models/`, or `presentation/` only when several related internals benefit from that secondary
grouping.

For example, a billing feature may contain semantic `invoices/` and `payment-methods/` subdomains. Each
subdomain follows the same invariant-owner, sibling-scan, public-boundary, and acyclic-dependency rules.
A flat technical bucket remains a poor substitute for semantic ownership even when nested.

## Lint Rules

The `frontend-layers` lint plugin implements this table. HI installs it as the `react-frontend-layers`
lint asset of the `react` Pack. This table is the authority; the plugin follows it. Every violation is
an error.

| Rule | Error when |
| --- | --- |
| `layer-order` | An import targets a higher layer, or a file outside `integrations/` and `app/api/` imports `server/`. |
| `route-imports` | A route-layer file imports a folder other than `composition/`, or an `app/api/` handler imports a folder other than `server/`. |
| `no-peer-feature` | A file in `features/<a>/` imports `features/<b>/`. |
| `public-entrypoint` | A cross-domain import targets a file other than the domain's `index.ts` or `index.tsx`; `ui/` is exempt. |
| `no-prototype-folder` | A folder named `*prototype*` or `mock*` exists outside `integrations/`. |
| `known-top-level` | A top-level folder under the layer root is not `app`, `routes`, `composition`, `features`, `modules`, `integrations`, `ui` or `server`. |
| `ui-placement` | An app-local `ui/` folder exists in a monorepo. |
