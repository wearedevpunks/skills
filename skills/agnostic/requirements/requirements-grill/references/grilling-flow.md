# Grilling Flow

Use this reference during live requirements iteration.

This workflow is always paired with [artifact-output.md](artifact-output.md) during a serious grilling session.

## Session Behavior

Use the shared `$grilling` primitive as the sole scheduling and traversal contract, then apply the requirements-specific pressure tests below. When the user authorizes auto-pinning, record obvious defaults without needless extra questions.

Before the first question, invoke `$domain-modeling` and give it the current status-file glossary as working persistence. During the grill, invoke it whenever terminology, relationships, or domain decisions change. Persist accepted results at the current round boundary rather than writing a separate domain artifact mid-grill.

## Technical Grounding

Before `$grilling` constructs the first frontier:

1. Identify every active branch whose decisions affect code or architecture.
2. Inspect the smallest relevant slice of current code, tests, schemas, contracts, configuration, and runtime paths.
3. Record concrete evidence anchors and the applicable technical dimensions in the status file. Use anchors such as `path:symbol`, a schema, a contract operation, a configuration key, or a runtime flow.
4. Mark each active technical branch `grounded`. Keep it `unknown`, or park or defer it explicitly, when current evidence cannot ground it. Open the first frontier only when no active technical branch remains `unknown`.

Technical grounding supplies requirements evidence, not an implementation plan. Ask which ownership, contract, invariant, lifecycle, or boundary must hold. Leave edit order, estimates, task breakdown, and reversible coding tactics to planning.

## Live Visual Reasoning

Use `$show-me` inside any grilling branch when a difficult question, comparison, set of interacting parts, or key turning point is easier to reason about visually. Select the smallest applicable view from its full view catalog. Derive the view from current code evidence and durable artifacts; route decisions and corrections through the ordinary question ids and round persistence contract.

At each persisted round boundary, reassess the next frontier, glossary, parked branches, and flow for a useful `$show-me` view. The persisted artifacts remain authoritative.

## Round Artifact Integration

At each `$grilling` round boundary, apply the [round persistence contract](artifact-output.md#round-persistence-contract). A partial response set resolves only the supplied stable question ids; omitted ids stay unanswered. Persist `$grilling` completion in the artifact's shared-understanding confirmation field before any downstream transition.

## Domain Modeling

Use `$domain-modeling` for terminology, relationships, and implementation pressure. For each active technical branch, ask questions for the applicable topology, dependency direction or injection, seams, boundaries, persistence, and module shape. State the evidence anchor and observed code constraint, ask the unresolved requirements decision, then state its code consequence. Persist accepted architecture in grill artifacts for `create-spec`; keep the active glossary implementation-free.

## Conservative Closure

When the user asks to reduce scope or stop widening the design:

- choose the smallest already-justified model
- avoid new tables, modes, enum values, services, or abstractions
- keep future branches parked instead of partially designing them
- prefer app-layer projections before DB views or materialized layers
- prefer ordinary text/enforced-in-code enums before DB-native enum churn

When `$grilling` completes, invoke `$domain-modeling` once more against the full active glossary before requesting shared-understanding confirmation.
