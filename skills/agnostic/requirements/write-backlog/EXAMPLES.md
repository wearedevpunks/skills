# Write Backlog Examples

## Agent-ready spec projection

Input:

```yaml
readiness: agent-ready
```

- immutable spec link: `<repository-url>/blob/<commit>/SPEC.md`
- `US-001`: Team lead restores ownership of an unassigned submission.
- `AC-001` — `Covers: US-001`: Reassignment preserves notes and evidence.
- `AC-002` — `Covers: US-001`: The new owner sees the submission in their queue.

Output:

- capability module: `Intake and review`
- epic: `Submission lifecycle management`, linked to the immutable spec
- story: `Lead restores ownership of an unassigned submission`
  - source: `US-001`
  - covers: `AC-001`, `AC-002`
  - demonstration: reassign one unassigned submission and observe preserved evidence plus the new owner's queue

This is a vertical tracer bullet: one agent can deliver and demonstrate the product outcome without splitting database, API, UI, and tests into separate backlog stories.

## Blocker graph

- `US-002 / Lead manages the unassigned queue` is blocked by `US-001 / Lead restores ownership`.
- Both targets exist and the graph is acyclic.
- Both stories share their containing epic's milestone when the provider supports membership; the native blocker relation carries their ordering.

If a blocker target is missing or the graph cycles, write nothing.

## Pre-spec intake resolution

An earlier `prototype` item established the review-screen direction. Resolve that intake item with its verdict plus the immutable spec link. Create a separate epic projection. Do not relabel or silently promote the prototype item into the epic.

## Invalid input

If readiness is absent, `AC-001` lacks `Covers: US-###`, a story is not demonstrable, or provider hierarchy cannot represent the required projection, return every gap before any mutation.
