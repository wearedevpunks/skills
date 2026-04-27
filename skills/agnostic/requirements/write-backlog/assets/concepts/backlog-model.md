# Backlog Model

## Canonical hierarchy

- module
- epic
- story

Provider mapping:

- module -> milestone or equivalent grouping
- epic -> parent issue / capability item
- story -> child issue / sub-issue / child work item

## Ownership boundaries

- backlog owns product-facing coordination
- `SPEC.md` owns the full problem-space contract for one epic
- `PLAN.md` owns execution decomposition

## Epic contract

One epic:

- maps to one future `SPEC.md`
- groups the stories that share one coherent capability boundary
- can include cross-story scope and constraints

One epic must not:

- become an execution board
- duplicate the whole future `PLAN.md`
- be reduced to a pure label/container with no capability meaning

## Story contract

One story:

- is independently observable
- describes one user-visible slice or system behavior slice
- stays product-facing
- can be ordered relative to other stories with native blockers

One story must not:

- become a plan task
- carry TDD or file-level detail
- be phrased as a technical chore

## Order contract

Use native provider relations for ordering when available.

Preferred primitives:

- `blockedBy`
- `blocks`
- native parent/child

Do not encode story order only in prose when the provider can store it natively.

## `create-spec` reading contract

When `create-spec` reads backlog items:

- the parent epic is the spec anchor
- all child stories under that epic are source material
- the resulting `SPEC.md` must include the combined scope of those stories
- no child story requirement should remain only in the backlog and not appear in the spec
