<!-- Skeleton for the draft PR body. Replace every <...> with observed facts. Contract: ../references/pr-body.md -->

## Summary

<Optional: intent and scope in one to three sentences.>

## Testing

- `<command>`: <result> (<focused | CI <link> | local broad>)
- Not run: <check> because <reason>

### UI Evidence

| Surface | Viewport | Before | After |
|---------|----------|--------|-------|
| <surface> | <viewport> | <durable link> | <durable link> |

<Delete the UI Evidence subsection when no user-visible UI changed.>

## Risk

- Tier: <low | medium | high>
- Rationale: <what can break, who is affected, which runtime or data surfaces are touched>

## How to revert

1. <`git revert <commit>` | disable flag `<name>` with value `<value>`>
- Data: <none | non-revertible state and its repair step>

---

Drafted by AI. The human operator of the agent reviews these answers before merge readiness.
