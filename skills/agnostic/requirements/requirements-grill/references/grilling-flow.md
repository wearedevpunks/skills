# Grilling Flow

Use this reference during live requirements iteration.

This workflow is always paired with [artifact-output.md](artifact-output.md) during a serious grilling session.

## Session Behavior

Use the shared `$grilling` primitive as the sole scheduling and traversal contract, then apply the requirements-specific pressure tests below. When the user authorizes auto-pinning, record obvious defaults without needless extra questions.

## Round Artifact Integration

At each `$grilling` round boundary, apply the [round persistence contract](artifact-output.md#round-persistence-contract). A partial response set resolves only the supplied stable question ids; omitted ids stay unanswered. Persist `$grilling` completion in the artifact's shared-understanding confirmation field before any downstream transition.

## Pressure Tests

Challenge glossary:

- If a term conflicts with existing specs, docs, code language, or the grill status glossary, call it out.
- Propose one canonical term and the aliases to avoid.
- Make the user choose, then update the glossary sections in the grill artifacts.

Sharpen vague language:

- Identify overloaded words.
- Replace fuzzy language with explicit terms, states, enum values, ownership boundaries, lifecycle rules, or domain axioms.
- When the user decides an invariant that should not be re-debated, capture it as an axiom.

Discuss concrete scenarios:

- Use edge cases to expose unclear boundaries.
- Stress-test state transitions, ownership, persistence, and failure behavior.

Cross-check with code:

- Verify user claims against local code when possible.
- Surface contradictions instead of smoothing them over.

## Glossary Discipline

Keep glossary pressure inside the active grill loop:

- Only add project/domain-specific terms; skip generic programming words.
- Define what the term is in one sentence, not how it is implemented.
- Record avoided aliases when competing words exist.
- Record relationships between terms, including cardinality when obvious.
- Record flagged ambiguities with the resolution that closed them.
- Treat glossary corrections from the user as authoritative and update the artifacts immediately.

## Conservative Closure

When the user asks to reduce scope or stop widening the design:

- choose the smallest already-justified model
- avoid new tables, modes, enum values, services, or abstractions
- keep future branches parked instead of partially designing them
- prefer app-layer projections before DB views or materialized layers
- prefer ordinary text/enforced-in-code enums before DB-native enum churn
