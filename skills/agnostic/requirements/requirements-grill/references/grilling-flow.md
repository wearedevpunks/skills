# Grilling Flow

Use this reference during live requirements iteration.

This workflow is always paired with [artifact-output.md](artifact-output.md) during a serious grilling session.

## Session Behavior

Interview the user relentlessly about every aspect of the plan until shared understanding exists.

Walk the design tree branch by branch until each branch is:

- closed
- parked
- explicitly deferred

## Questioning Rules

- Ask one question at a time by default.
- Always include a recommended answer.
- Explain why the recommendation is preferred.
- If multiple interpretations exist, force a precise choice.
- When the answer can be found in code/docs, inspect first instead of asking.
- When the user authorizes auto-pinning, close obvious defaults without needless extra questions.

## Pressure Tests

Challenge glossary:

- If a term conflicts with existing specs, docs, or code language, call it out.
- Propose the canonical term.
- Make the user choose.

Sharpen vague language:

- Identify overloaded words.
- Replace fuzzy language with explicit states, enum values, ownership boundaries, or lifecycle rules.

Discuss concrete scenarios:

- Use edge cases to expose unclear boundaries.
- Stress-test state transitions, ownership, persistence, and failure behavior.

Cross-check with code:

- Verify user claims against local code when possible.
- Surface contradictions instead of smoothing them over.

## Conservative Closure

When the user asks to reduce scope or stop widening the design:

- choose the smallest already-justified model
- avoid new tables, modes, enum values, services, or abstractions
- keep future branches parked instead of partially designing them
- prefer app-layer projections before DB views or materialized layers
- prefer ordinary text/enforced-in-code enums before DB-native enum churn
