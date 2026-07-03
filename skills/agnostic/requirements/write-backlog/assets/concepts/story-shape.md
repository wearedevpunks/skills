# Backlog Item Body Shape

## Shared rules

Keep every backlog item body product-facing and kind-appropriate.

All bodies may include durable source links, accepted evidence, and closure notes. Do not include execution plans, file-level implementation notes, or validation commands.

## Fog body

Use a short root-level body.

Recommended sections:

```md
## Frontier

[What is real but still unclear]

## Why This Is Fog

- ...

## Suspected Directions

- ...

## Next Route

- `grilling` | `research` | `prototype` | `epic`
```

Fog bodies must not define child tickets or delivery scope.

## Grilling body

Recommended sections:

```md
## Decision

[The human decision to close]

## Context

- ...

## Options

- ...

## Closure

Answer:
Accepted direction:
Artifacts:
Created or updated implementation items:
```

## Research body

Recommended sections:

```md
## Question

[The fact to establish]

## Evidence Sources

- ...

## Answer Criteria

- ...

## Closure

Answer:
Evidence:
Accepted direction:
Created or updated implementation items:
```

## Prototype body

Recommended sections:

```md
## Learning Goal

[What the artifact must teach]

## Artifact Expectations

- ...

## Result Signal

- ...

## Closure

Artifacts:
Accepted direction:
Created or updated implementation items:
```

## Epic body

Use a short bounded body.

Recommended sections:

```md
## Outcome

[What capability this epic delivers and why it matters]

## Scope

- ...

## Constraints

- ...

## Links

- `SPEC.md` once it exists
```

Epic bodies may summarize the capability boundary, but should not re-copy every child story verbatim once the child stories exist.

## Story body

Keep stories product-facing and independently understandable.

Recommended sections:

```md
## Outcome

[What this story enables]

## Acceptance signals

- [ ] ...
- [ ] ...

## Non-goals

- ...

## Links

- Parent epic
- `SPEC.md` once it exists and matters
```

## Body anti-patterns

Do not put these in backlog bodies:

- `Plan task: T123`
- `TDD target`
- `Validation`
- file paths
- package names as pseudo-scope
- worker handoff notes

Those belong in `PLAN.md`, execution comments, or implementation notes instead.
