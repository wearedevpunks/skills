# Backlog Item Body Shape

## Shared Rules

Preserve the user's title and wording unless accepted evidence changes the
meaning. Use canonical project terms and `$wait-what` to re-pitch unclear text.
Keep every body independently understandable, product-facing at its level, and
linked to durable source authority.

Add a compact `$show-me` visual when hierarchy, alternatives, or dependencies
are harder to understand in prose. The visual is explanatory. Native parent,
milestone, blocker, provenance, source, and approval records remain authority.

## Fog Body

- uncertainty or request
- why it is still Fog
- accepted and open decisions
- generic Grilling child identities and immutable intake lens
- supporting Research or Prototype evidence
- affected or produced backlog objects
- target and completion iteration when known

## Grilling Body

- bounded unknown closed by this generic Grilling child
- question and accepted decision
- evidence, observations, and open decisions
- immutable resolution pointer
- supported-by and produced-or-enriched relations

Research and Prototype bodies preserve the exact supported grilling child,
question or learning goal, answer or verdict, evidence, observations, open
decisions, and immutable resolution pointer.

## Epic Body

- business outcome and why it matters
- scope, boundaries, constraints, and non-goals
- Initiative parent and Fog provenance
- child Story links when available
- durable Business evidence

## Story Body

```md
## Outcome

[One shippable product result]

## Source outcomes

- `OUT-###`

## Acceptance criteria

- `AC-###`

## Demonstration

[One observable end-to-end result]

## Boundaries

- ...

## Non-goals

- ...

## Dependencies

- Stable product or provider identity

## Durable accepted-artifact links

- Immutable evidence or approved visual: ...

## Authority

- Parent Epic: ...
- Fog and Functional resolution: ...
- Immutable spec: ... when compiled
- Milestone iteration: `V*`
```

## Task Body

```md
## Responsibility

[One atomic shippable unit]

## Owner

[One explicit ownership boundary]

## Acceptance

- Source Story and `AC-###`

## Verification

[Observable evidence]

## Blockers

- Stable provider Task identity

## Authority

- Parent Story: ...
- Immutable spec: ...
- Compiled outcome and Fog provenance: ...
- Milestone iteration: same `V*` as Story
```

Task bodies may name the owned delivery responsibility and proof seam. Private
worker handoffs, transient commands, or plan-only identities remain in planning
and execution notes. The provider Task ID is the durable identity that planning
preserves.
