# Direct-Composition Contract

## Inputs

- target depth: exactly `Business`, `Functional`, or `Technical`
- request and accepted audience-specific context
- optional stable provider Fog identity or durable wiki Fog identity
- wrapper presentation profile
- optional durable runtime-handoff locator

The invoking wrapper stays in control while loading this engine. It supplies no
route, lifecycle state, or provider mutation instructions.

## Shared Invariants

- One invocation creates or resumes exactly one Fog.
- Fog is lateral provenance, never a parent in the product hierarchy.
- One Fog owns exactly one Business grilling child, one or more Functional
  children, and one Technical child per Story.
- Research and Prototype are direct Fog children that support named grilling
  children. They cannot authorize backlog projection.
- Current provider and immutable evidence defeat stale artifacts and route
  suggestions.
- Functional or Technical depth may adopt an exact existing Product Area ->
  Initiative -> Epic path only after the human accepts `reuse-unchanged`; the
  engine still persists one exact Business child and immutable resolution.
- Ambiguous identity or conflicting accepted evidence produces zero writes and
  routes to human steering.
- Reaching target depth returns control without completing the Fog.

## Return

Return the stable Fog identities, target depth reached, accepted stage child
identities and immutable resolution pointers, created-or-enriched provider
object identities from exact readback, unresolved support evidence, and the
durable handoff locator. Business returns exactly one Business child;
Functional returns one or more Functional children selected for this
invocation; Technical returns exactly one Technical child per selected Story.
