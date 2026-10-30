# Migration to the Entities Layer Model

Read this when a repository still has the earlier composition-layer layout: domain code in
`modules/<domain>/`, Surface folders in `composition/<surface>/`, or `mock*` folders. The
[agnostic reference](structure.md) is the target; this file maps old paths to it.

## Path Map

Move each old path to its new owner. Classify by the invariant owner, not by the old folder.

| Old path | New path |
| --- | --- |
| `modules/<domain>/` with product terms, for one business entity | `entities/<entity>/` |
| `modules/<domain>/` with product terms, for several entities | `features/<capability>/` |
| `composition/<surface>/shell/` | `composition/routing/shells/<name>/` |
| `composition/<surface>/pages/<page>/` | `composition/routing/pages/<page>/` |
| a layout file inside a page folder | `composition/routing/shells/<name>/` |
| `integrations/<mock-or-fake>/` | `simulated/` of the Entity or Feature that owns the port |
| `integrations/<app-api-client>/` | `remote/index.ts` of the owning Entity or Feature |
| `integrations/<server-reader>/` | `remote/server.ts` of the owning Entity or Feature |
| `integrations/<third-party>/` | stays in `integrations/` |
| sibling folders that repeat a prefix (`candidate-cv/`, `candidate-intake/`) | one domain with subpaths (`candidate/cv/`, `candidate/intake/`) |

## Providers

Composition keeps only global root providers in `composition/providers/`. Feature-scoped providers
move into their Feature; entity providers move into their Entity. A Shell mounts them with the Data
Sources that Composition selects. Logic that spans two Entities moves into a Feature.

## Modules

Agnostic code with no product terms stays in `modules/`. Generic helpers that sit in an
Integration without a third-party dependency move to `modules/`.

## Index Files and Tests

Move implementation out of each `index.ts` or `index.tsx` into named files and keep only re-exports.
Production files import named siblings instead of their own `./index`. Tests keep importing the
public entry.

## Completion

The migration of a scope is complete when the `frontend-layers` lint rules report no error in it and
its focused tests, type check and build pass with unchanged test assertions.
