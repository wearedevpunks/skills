# Phase Handoff

Each phase must leave enough state for a later `delivery-phase` invocation to
resume without guessing.

## Minimum Handoff Shape

```text
Phase:
Status: complete | blocked | skipped
Scope:
Artifacts:
Validation:
Review/debug/docs state:
Next suggested route:
Blockers:
```

## Rules

- State what actually ran. Do not imply downstream phases ran.
- Prefer links or paths to durable artifacts over prose-only claims.
- If a phase is skipped, record the no-op reason.
- If the user requested HITL control, stop after the handoff even when the next
  route is obvious.
