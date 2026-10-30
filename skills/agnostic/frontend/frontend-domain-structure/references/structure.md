# Frontend Domain Structure Reference

## Goal

Give each frontend behavior one stable owner in one fixed layer model. The layer names and their order
are the same in every project. The `frontend-layers` lint plugin checks the model with the rules in
[Lint Rules](#lint-rules). To move a repository from the earlier composition-layer model, read
[the migration map](migration.md).

## Layers

The layer root is `src/` when it exists, else the package root. These layers sit under the layer root,
from top to bottom:

| Layer | Owns |
| --- | --- |
| `app/` or `routes/` | Route files that the framework requires. They only connect Composition exports. |
| `composition/` | Global root providers, the proxy, and routing: access, Shells and Page Templates. |
| `features/` | One user-facing capability that combines Entities, with its own workflow, policy, state and providers. |
| `entities/` | One business entity, like a repository: contract, port, CRUD and query machinery, providers, Data Sources and entity views. |
| `modules/` | Business-agnostic app-local code with no product terms. |
| `integrations/` | Adapters to third-party systems: SDK wrappers and client setup. |
| `ui/` | Primitives and shadcn components. |

Each layer imports only lower layers. A layer can import any lower layer, not only the next one. The
rules govern imports between folders under the layer root, written as relative paths or with the `@/`
alias. Package imports, such as `next/navigation`, are outside these rules.

The layer root holds only these layer folders and `server/`. Any other top-level folder under the layer
root is an error. Test and story files follow the same rules as the code they test, except that they
may import Data Sources and their own folder's `index`. A test or story file has `.test.`, `.spec.` or
`.stories.` in its file name. The rules apply to a package whose layer root contains `app/` or
`routes/`; a package without a route layer is not checked.

## Route Layer

The route layer imports only `composition/`. The root files `proxy.ts`, `middleware.ts` and
`instrumentation.ts` belong to the route layer; they connect `composition/proxy/`. A route file reads
framework inputs, calls the Composition export for its page, and returns the result. Product policy,
data reads and layout belong to their invariant owners.

## Composition

Composition holds the global root providers, the proxy, and routing. Its first level is fixed:
`providers/`, `proxy/` and `routing/`.

- `providers/` holds only global root providers, such as the query client, the SDK runtime and
  session tracking. A provider that serves one capability belongs to its Feature or Entity.
- `routing/` holds `access/`, `shells/<name>/` and `pages/<page>/`, plus its `index.ts` entry. Each app has
  exactly one `routing/`.
- A **Shell** is the layout of one route group, such as a portal or a CMS. A layout file lives only in
  `composition/routing/shells/<name>/`, one layout per folder, with only the files it governs. A Shell
  combines Feature providers with the Data Sources that Composition selects.
- A **Page Template** is the component that a route renders. Its folder `pages/<page>/` holds
  `index.ts`, the route entry and the template at its root; other components and hooks go in
  `components/` and `hooks/` only when needed. Use one folder per route.

A Page Template gives the route layer everything that one page needs, so that the route file only
connects it.

## Features

A Feature owns a coherent user-visible capability: its workflow, policy, state, providers,
presentation and feature-local helpers. A Feature combines one or more Entities; for example, an HR
feature combines the developer and salary Entities. Code that is not a clear single-entity concern is
a Feature.

A Feature never imports another Feature. When two features work together, the nearest composition that
holds both connects them through props, slots or callbacks. A Feature takes its dependencies as inputs.

## Entities

An **Entity** is a repository-like domain for one business entity: its contract, port, CRUD and query
machinery, providers, Data Sources and entity views (`views/`: pickers, badges, formatters). Name the
folder after the entity, for example `entities/candidate/`.

An Entity never imports another Entity; it refers to another entity only by its id. Logic that spans
two Entities lives in a Feature.

## Data Sources

A **Data Source** implements a port of an Entity or a Feature. It lives in one of two subpaths:

- `remote/` holds the server-backed source. `remote/index.ts` is the browser entry. `remote/server.ts`
  starts with `import "server-only"` and holds server readers.
- `simulated/` holds the in-memory source, seeds and fake runtimes.

Only Composition and tests import a Data Source. Features and entity views use the Entity root.
Folders named `mock*` or `*prototype*` are errors; put fakes in `simulated/`. Put no production UI in a
folder named "prototype".

## Modules

A Module carries no product terms: another product could use it unchanged. Examples are form
scaffolding, a navigation guard, async pacing helpers and a theme.

## Integrations

An Integration is an adapter to a third-party system: an SDK wrapper, client setup or a document
renderer. The app's own API and its fakes are Data Sources, not Integrations.

## Server

`server/` sits outside the layers, and `effect-backend-structure` governs it. Only `remote/` Data
Sources and `app/api/` handlers import `server/`, and only through server public entrypoints.
`app/api/` handlers import only `server/`.

## UI

`ui/` holds primitives and shadcn components. In a monorepo, only the shared UI package (for example
`packages/ui`) holds them, and an app-local `ui/` folder is an error. A monorepo has a
`pnpm-workspace.yaml` or a `package.json` with `workspaces` at or above the package root. In a
single-package repository, `src/ui/` is the lowest layer. Other presentation stays with its owner, in a
Feature or an Entity.

## Shared Packages

A capability or primitive with real consumers in more than one application belongs to a shared package.
Code that two Shells of one app use stays in a Feature, Entity or Module of that app. Keep
app-specific widgets and workflows with the app that owns them. Inside a shared package, apply the same
domain-worthiness test; shared code is still organized by responsibility.

## Domains and Public Entrypoints

A domain is the first folder under a layer, for example `features/checkout/`, `entities/order/`,
`modules/navigation/` or `integrations/payments/`. A domain may have subpaths, such as
`entities/order/refunds/`. The domain `index.ts` or `index.tsx`, or a subpath `index.ts` or
`index.tsx`, is the only cross-domain entrypoint; `remote/server.ts` is the server entry. Imports
inside a domain are free. `ui/` is exempt, because shadcn keeps one file per component.

An `index` file only re-exports: implementation lives in named files beside it. Production code never
imports its own folder's `./index`; tests may, because they exercise the public entry.

Name one domain folder with subpaths instead of sibling folders that repeat a prefix: use
`entities/candidate/cv/`, not `entities/candidate-cv/` beside `entities/candidate/`.

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

Before creating a feature, entity, module, integration, package, or nested domain, **scan the
siblings**. Look for the same invariant owner, product language, workflow, change cadence, and
consumers. Extend or rename an existing owner when it already covers the responsibility.

A new domain is worthy when it gives a coherent responsibility a stable name and at least one real
boundary, such as independent policy, lifecycle, state, workflow, consumer contract, or reuse scope.
Several tightly related files may form one worthy domain; one substantial public boundary may also be
enough. File count is not the classifier.

Keep implementation with its current owner when the proposed split is only navigational. In particular,
reject a cosmetic micro-feature, micro-entity or micro-module named after a panel, button, page
fragment, file type, or temporary layout. Keep a one-file folder folded into its owner until that
folder expresses a deliberate public or semantic boundary. This prevents directory depth from
masquerading as architecture.

## Recursive Semantic Internals

The ownership rule is recursive at every directory and package depth. Within a domain or shared package,
group semantic subdomains before adding technical folders. Introduce local folders such as `state/`,
`models/`, or `presentation/` only when several related internals benefit from that secondary
grouping. `remote/`, `simulated/` and `views/` are reserved subpaths with the meanings above.

For example, a billing feature may contain semantic `invoices/` and `payment-methods/` subdomains. Each
subdomain follows the same invariant-owner, sibling-scan, public-boundary, and acyclic-dependency rules.
A flat technical bucket remains a poor substitute for semantic ownership even when nested.

## Lint Rules

The `frontend-layers` lint plugin implements this table. HI installs it as the `react-frontend-layers`
lint asset of the `react` Pack. This table is the authority; the plugin follows it. Every violation is
an error. A Module's no-product-terms test is a review rule; lint checks only its imports.

| Rule | Error when |
| --- | --- |
| `layer-order` | An import targets a higher layer, or a file outside `entities/*/remote/`, `features/*/remote/` and `app/api/` imports `server/`. |
| `route-imports` | A route-layer file imports a folder other than `composition/`, or an `app/api/` handler imports a folder other than `server/`. |
| `no-peer-feature` | A file in `features/<a>/` imports `features/<b>/`. |
| `no-peer-entity` | A file in `entities/<a>/` imports `entities/<b>/`. |
| `public-entrypoint` | A cross-domain import targets a file other than a domain or subpath `index.ts` or `index.tsx`, or `remote/server.ts`; `ui/` is exempt. |
| `data-source-imports` | A file outside `composition/` that is not a test or story file imports another domain's `remote/` or `simulated/` subpath. |
| `index-reexports-only` | An `index.ts` or `index.tsx` holds a statement other than an import or a re-export. |
| `no-self-index-import` | A file that is not a test or story file imports its own folder's `./index` or `.`. |
| `layout-placement` | A layout file under `composition/` exists outside `composition/routing/shells/<name>/`. |
| `composition-shape` | A first-level folder of `composition/` is not `providers`, `proxy` or `routing`. |
| `no-prefix-siblings` | Two domains of one layer share the name part before their first `-` (`candidate-cv` beside `candidate-database`), or one domain's name is another domain's name plus `-` (`candidate-cv` beside `candidate`). |
| `no-prototype-folder` | A folder named `*prototype*` or `mock*` exists. |
| `known-top-level` | A top-level folder under the layer root is not `app`, `routes`, `composition`, `features`, `entities`, `modules`, `integrations`, `ui` or `server`. |
| `ui-placement` | An app-local `ui/` folder exists in a monorepo. |
