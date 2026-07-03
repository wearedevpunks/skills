# Backlog Model

## Canonical model

```text
Backlog root
  fog
  module/milestone
    grilling
    research
    prototype
    epic
      story
```

Provider mapping:

- kind -> provider-native single-value kind storage where available
- fog -> root-level first-class backlog item
- module -> milestone or equivalent grouping
- grilling -> module/milestone-scoped first-class decision item
- research -> module/milestone-scoped first-class investigation item
- prototype -> module/milestone-scoped first-class learning item
- epic -> module/milestone-scoped parent issue / capability item
- story -> child issue / sub-issue / child work item under an epic

Every supported kind must be visible, assignable, searchable, linkable, and closeable in the target provider.

## Kind contract

`kind` values:

- `fog`
- `grilling`
- `research`
- `prototype`
- `epic`
- `story`

`kind` is separate from:

- workflow state
- module/milestone grouping
- parent/child hierarchy
- provider issue type, unless the provider requires that type for structure

Labels and tags may mirror `kind`, but they are not canonical when a provider-native field exists.

## Fog contract

One fog item:

- lives at the backlog root
- tracks a real but not-yet-sharp area of uncertainty
- anticipates future modules, tickets, epics, and stories

One fog item must not:

- be delivery-eligible
- be a `SPEC.md` anchor
- become an execution container
- own child tickets by default

Sharpening fog first chooses or creates a module/milestone, then creates concrete non-fog items there.

## Learning item contract

`grilling`, `research`, and `prototype` items:

- live under a module/milestone
- represent decision, investigation, or artifact-learning work
- close before implementation scope changes

Closure notes include:

- answer
- accepted direction
- artifacts or evidence
- created or updated epics/stories

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
- absorb unresolved grilling, research, or prototype work as if it were accepted scope

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
