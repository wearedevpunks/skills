# Frontier Lifecycle

## Purpose

The frontier is the visible set of unresolved uncertainty that must be routed before delivery scope is accepted.

The backlog root is the living map. Docs, specs, grill logs, and notes are evidence for updating that map.

## States

### Fog

- Root-level only.
- Tracks a real but not-yet-sharp area of uncertainty.
- Anticipates future modules, tickets, epics, and stories.
- Is not delivery-eligible.
- Is not a `SPEC.md` anchor.
- Does not own child tickets by default.

### Grilling

- Module/milestone-scoped.
- Used when a human decision must close ambiguity.
- Closes with an accepted decision note before implementation scope changes.

### Research

- Module/milestone-scoped.
- Used when readonly investigation can answer the unknown.
- Closes with answer, evidence, accepted direction, and created or updated implementation items when applicable.

### Prototype

- Module/milestone-scoped.
- Used when learning needs an artifact, experiment, or throwaway proof.
- Closes with produced artifacts, accepted direction, and created or updated implementation items when applicable.

### Epic

- Module/milestone-scoped.
- Accepted implementation capability.
- Anchors one future `SPEC.md`.

### Story

- Child of one epic.
- Accepted product-facing implementation slice.
- Must not become a plan task or file chore.

## Transition Rules

- Sharpening `fog` first chooses or creates a module/milestone, then creates concrete non-fog items there.
- `grilling`, `research`, and `prototype` do not become implementation scope silently.
- Closure notes for `grilling`, `research`, and `prototype` must include:
  - answer
  - accepted direction
  - artifacts or evidence
  - created or updated epics/stories
- Epic/story semantics stay strict even beside learning and uncertainty items.

## Handoff Shape

Return:

- current frontier
- selected next kind
- chosen or proposed placement
- evidence used
- open blockers
- next skill or phase
