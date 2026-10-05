# Grilling Flow

Use this reference during live requirements iteration.

This workflow is always paired with [artifact-output.md](artifact-output.md) during a serious grilling session.

## Session Behavior

Use the shared `$grilling` primitive as the sole scheduling and traversal contract, then apply the requirements-specific pressure tests below. When the user authorizes auto-pinning, record obvious defaults without needless extra questions.

Before the first question, invoke `$domain-modeling` and give it the current status-file glossary as working persistence. During the grill, invoke it whenever terminology, relationships, or domain decisions change. Persist accepted results at the current round boundary rather than writing a separate domain artifact mid-grill.

## Technical Grounding

Before `$grilling` constructs the first frontier, identify every active branch whose decisions affect code or architecture. Prepare each applicable technical decision below, including later rounds, partial response sets, and resumed sessions:

1. **Locate the behavior.** Trace the actual caller through the smallest relevant slice of code, tests, schemas, contracts, configuration, and runtime paths. Label existing and proposed locations. Record concrete evidence anchors such as `path:symbol`, schema, contract operation, configuration key, or runtime flow.
2. **Identify the owner.** Show whether the behavior belongs to an existing module, new capability, adapter, private helper, or plain value. Explain why the boundary earns its place, dependency direction, where dependencies are supplied, and who acquires and releases resources. Apply the relevant stack guidance; for Effect, use `$effect-service-design` to qualify services and scoped Layer ownership.
3. **Inspect the primitive.** Follow the applicable stack skills and project source guide/`opensrc` to inspect the exact library or runtime module/symbol and source version/identity. State its useful guarantees, material limitations, and the responsibility left to the application. Keep installed-version facts, proposed or accepted target-version design, and unproved runtime behavior distinct.
4. **Show the consequence.** Use `$show-me` to select the smallest useful tree, interface sketch, call sequence, or diff. Label existing and proposed boundaries; expose material ordering, scope/lifetime, transaction participation, and failure consequences beside the view, with the caller-visible result. A sketch or source inspection establishes design evidence; runtime proof remains separate.
5. **Ask the decision.** State the evidence anchor and observed code constraint, ask one unresolved requirements decision, then state its code consequence. Give a recommendation, rationale, and a meaningful alternative for the human contract or tradeoff.

These are preparation obligations, not mandatory headings for each question. Product-only branches keep product-level views.

Reuse inspected evidence while its source identity and assumptions remain valid. After an answer or on resume, trace changed decisions through affected paths and refresh only the evidence they invalidate. Persist the evidence and acceptance scope through [artifact-output](artifact-output.md#grill-log-contract).

Record each missing fact or source/version mismatch as an exact prerequisite of the affected question ids. Use `$grilling`'s fact exploration: hold only dependent questions and continue the independent ready frontier. Track evidence readiness in the status file separately from decision closure.

Technical grounding supplies requirements evidence, not an implementation plan. Settle ownership, contract, invariant, lifecycle, and boundary. Once those guarantees are settled, leave illustrative spelling, tuning constants, implementation proof, edit order, estimates, and task breakdown to downstream work; reopen only when they expose a material contract or tradeoff.

## Live Visual Reasoning

Use `$show-me` inside any grilling branch when a difficult question, comparison, set of interacting parts, or key turning point is easier to reason about visually. Select the smallest applicable view from its full view catalog. Derive the view from current code evidence and durable artifacts; route decisions and corrections through the ordinary question ids and round persistence contract.

At each persisted round boundary, reassess the next frontier, glossary, parked branches, and flow for a useful `$show-me` view. The persisted artifacts remain authoritative.

## Round Artifact Integration

At each `$grilling` round boundary, apply the [round persistence contract](artifact-output.md#round-persistence-contract). A partial response set resolves only the supplied stable question ids; omitted ids stay unanswered. Persist `$grilling` completion in the artifact's shared-understanding confirmation field before any downstream transition.

## Domain Modeling

Use `$domain-modeling` for terminology, relationships, and implementation pressure. Persist accepted architecture in grill artifacts for `create-spec`; keep the active glossary implementation-free.

## Conservative Closure

When the user asks to reduce scope or stop widening the design:

- choose the smallest already-justified model
- avoid new tables, modes, enum values, services, or abstractions
- keep future branches parked instead of partially designing them
- prefer app-layer projections before DB views or materialized layers
- prefer ordinary text/enforced-in-code enums before DB-native enum churn

When `$grilling` completes, invoke `$domain-modeling` once more against the full active glossary before requesting shared-understanding confirmation.
