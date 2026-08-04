# Frontier Lifecycle

## Purpose

The frontier is the set of open, unblocked, and unclaimed decision tickets.

The backlog root is the living map. Docs, specs, grill logs, and notes are evidence for updating that map.

## States

### Fog

- Root-level only.
- Tracks a real but not-yet-sharp area of uncertainty.
- Graduates when its uncertainty can be stated as a precise question now.
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
- Closes with answer and immutable evidence. Wayfinder, not research, selects
  any product direction.

### Prototype

- Module/milestone-scoped.
- Used when learning needs an artifact, experiment, or throwaway proof.
- Closes with a human verdict and immutable artifact/verdict evidence.

### Epic

- Module/milestone-scoped.
- Accepted implementation capability.
- Is a post-spec delivery projection.

### Story

- Child of one epic.
- Accepted product-facing implementation slice.
- Must not become a plan task or file chore.

## Transition Rules

- Sharpening `fog` first chooses or creates a module/milestone, then creates concrete non-fog items there.
- `grilling`, `research`, and `prototype` do not become implementation scope silently.
- Resolution records for `grilling`, `research`, and `prototype` include:
  - answer
  - artifacts or evidence by immutable commit SHA and path
- Use provider-native blocker relations. Claim a ticket through native
  assignment/state before working it.
- Epic/story semantics stay strict even beside learning and uncertainty items.

## Handoff Shape

Return:

- current frontier
- selected next concept
- chosen or proposed placement
- evidence used
- open blockers
- next skill or phase
