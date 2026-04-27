# Epic And Story Shape

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

Do not put these in epic or story bodies:

- `Plan task: T123`
- `TDD target`
- `Validation`
- file paths
- package names as pseudo-scope
- worker handoff notes

Those belong in `PLAN.md`, execution comments, or implementation notes instead.
